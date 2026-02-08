// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PredictionMarket
 * @dev A smart contract for creating binary prediction markets with on-chain resolution
 */
contract PredictionMarket is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Enums ============
    enum MarketStatus {
        Active,
        Resolved,
        Cancelled
    }

    enum Outcome {
        Yes,
        No,
        Unresolved
    }

    // ============ Structs ============
    struct Market {
        uint256 id;
        string description;
        address tokenAddress; // Address of ERC-20 token; address(0) for ETH
        uint256 creationBlockNumber;
        uint256 resolutionBlockNumber;
        uint256 resolutionCheckCondition; // e.g., gas price threshold
        MarketStatus status;
        Outcome resolvedOutcome;
        uint256 totalYesStakes;
        uint256 totalNoStakes;
        uint256 createdAt;
    }

    struct Stake {
        address staker;
        Outcome outcome;
        uint256 amount;
    }

    // ============ State Variables ============
    uint256 public marketCounter;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => Stake[]) public marketStakes;
    mapping(uint256 => mapping(address => uint256)) public userStakeAmount;
    mapping(uint256 => mapping(address => Outcome)) public userStakeOutcome;

    // ============ Events ============
    event MarketCreated(
        uint256 indexed marketId,
        string description,
        address tokenAddress,
        uint256 resolutionBlockNumber,
        uint256 indexed createdAt
    );

    event StakePlaced(
        uint256 indexed marketId,
        address indexed staker,
        Outcome outcome,
        uint256 amount,
        address tokenAddress
    );

    event MarketResolved(
        uint256 indexed marketId,
        Outcome outcome,
        uint256 timestamp
    );

    event WinningsWithdrawn(
        uint256 indexed marketId,
        address indexed winner,
        uint256 winnings
    );

    event MarketCancelled(uint256 indexed marketId, uint256 timestamp);

    // ============ Constructor ============
    constructor() Ownable(msg.sender) {
        marketCounter = 0;
    }

    // ============ Market Creation ============
    /**
     * @dev Create a new prediction market
     * @param _description Description of the market outcome
     * @param _tokenAddress Address of ERC-20 token (address(0) for ETH)
     * @param _resolutionBlockNumber Block number at which market will be resolved
     * @param _resolutionCheckCondition Condition parameter (e.g., gas price threshold)
     */
    function createMarket(
        string calldata _description,
        address _tokenAddress,
        uint256 _resolutionBlockNumber,
        uint256 _resolutionCheckCondition
    ) external returns (uint256) {
        require(
            _resolutionBlockNumber > block.number,
            "Resolution block must be in the future"
        );
        require(bytes(_description).length > 0, "Description cannot be empty");

        uint256 marketId = marketCounter++;

        markets[marketId] = Market({
            id: marketId,
            description: _description,
            tokenAddress: _tokenAddress,
            creationBlockNumber: block.number,
            resolutionBlockNumber: _resolutionBlockNumber,
            resolutionCheckCondition: _resolutionCheckCondition,
            status: MarketStatus.Active,
            resolvedOutcome: Outcome.Unresolved,
            totalYesStakes: 0,
            totalNoStakes: 0,
            createdAt: block.timestamp
        });

        emit MarketCreated(
            marketId,
            _description,
            _tokenAddress,
            _resolutionBlockNumber,
            block.timestamp
        );

        return marketId;
    }

    // ============ Staking Functions ============
    /**
     * @dev Place a stake on a market outcome
     * @param _marketId ID of the market
     * @param _outcome Outcome to stake on (Outcome.Yes or Outcome.No)
     * @param _amount Amount to stake
     */
    function placeStake(
        uint256 _marketId,
        Outcome _outcome,
        uint256 _amount
    ) external payable nonReentrant {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Active, "Market is not active");
        require(
            block.number < market.resolutionBlockNumber,
            "Market is locked"
        );
        require(_amount > 0, "Stake amount must be greater than 0");
        require(
            _outcome == Outcome.Yes || _outcome == Outcome.No,
            "Invalid outcome"
        );

        if (market.tokenAddress == address(0)) {
            // ETH stake
            require(msg.value == _amount, "Incorrect ETH amount");
        } else {
            // ERC-20 stake
            require(msg.value == 0, "Do not send ETH with ERC-20 stakes");
            IERC20(market.tokenAddress).safeTransferFrom(
                msg.sender,
                address(this),
                _amount
            );
        }

        // Update stake tracking
        if (userStakeAmount[_marketId][msg.sender] == 0) {
            // New staker
            Stake memory newStake = Stake({
                staker: msg.sender,
                outcome: _outcome,
                amount: _amount
            });
            marketStakes[_marketId].push(newStake);
            userStakeOutcome[_marketId][msg.sender] = _outcome;
            userStakeAmount[_marketId][msg.sender] = _amount;
        } else {
            // Existing staker - update amount
            require(
                userStakeOutcome[_marketId][msg.sender] == _outcome,
                "Cannot stake on different outcome"
            );
            userStakeAmount[_marketId][msg.sender] += _amount;
        }

        // Update market totals
        if (_outcome == Outcome.Yes) {
            market.totalYesStakes += _amount;
        } else {
            market.totalNoStakes += _amount;
        }

        emit StakePlaced(
            _marketId,
            msg.sender,
            _outcome,
            _amount,
            market.tokenAddress
        );
    }

    // ============ Resolution Functions ============
    /**
     * @dev Admin-triggered market resolution
     * @param _marketId ID of the market
     * @param _outcome The resolved outcome (Yes or No)
     */
    function adminResolveMarket(uint256 _marketId, Outcome _outcome) external {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Active, "Market is not active");
        require(
            block.number >= market.resolutionBlockNumber,
            "Resolution block not reached"
        );
        require(
            _outcome == Outcome.Yes || _outcome == Outcome.No,
            "Invalid outcome"
        );

        _resolveMarket(_marketId, _outcome);
    }

    /**
     * @dev Auto-resolve market based on on-chain data check
     * @param _marketId ID of the market
     * @param _currentGasPrice Current gas price for condition checking
     */
    function autoResolveMarket(
        uint256 _marketId,
        uint256 _currentGasPrice
    ) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Active, "Market is not active");
        require(
            block.number >= market.resolutionBlockNumber,
            "Resolution block not reached"
        );

        // Determine outcome based on gas price condition
        Outcome outcome = _currentGasPrice > market.resolutionCheckCondition
            ? Outcome.Yes
            : Outcome.No;

        _resolveMarket(_marketId, outcome);
    }

    /**
     * @dev Internal function to resolve a market
     * @param _marketId ID of the market
     * @param _outcome The resolved outcome
     */
    function _resolveMarket(uint256 _marketId, Outcome _outcome) internal {
        Market storage market = markets[_marketId];
        market.status = MarketStatus.Resolved;
        market.resolvedOutcome = _outcome;

        emit MarketResolved(_marketId, _outcome, block.timestamp);
    }

    // ============ Withdrawal Functions ============
    /**
     * @dev Withdraw winnings from a resolved market
     * @param _marketId ID of the market
     */
    function withdrawWinnings(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");

        uint256 userStake = userStakeAmount[_marketId][msg.sender];
        require(userStake > 0, "No stake in this market");

        Outcome userOutcome = userStakeOutcome[_marketId][msg.sender];
        require(userOutcome != Outcome.Unresolved, "No valid stake found");

        uint256 winnings = 0;

        if (userOutcome == market.resolvedOutcome) {
            // User won - calculate proportional winnings
            uint256 totalWinningStakes = userOutcome == Outcome.Yes
                ? market.totalYesStakes
                : market.totalNoStakes;
            uint256 totalLosingStakes = userOutcome == Outcome.Yes
                ? market.totalNoStakes
                : market.totalYesStakes;

            // Winnings = original stake + proportional share of losing stakes
            winnings =
                userStake +
                (userStake * totalLosingStakes) /
                totalWinningStakes;
        } else {
            // User lost - no winnings
            winnings = 0;
        }

        // Clear user's stake
        userStakeAmount[_marketId][msg.sender] = 0;
        userStakeOutcome[_marketId][msg.sender] = Outcome.Unresolved;

        // Transfer winnings or return stake if lost
        if (market.tokenAddress == address(0)) {
            // ETH transfer
            (bool success, ) = msg.sender.call{value: winnings}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC-20 transfer
            IERC20(market.tokenAddress).safeTransfer(msg.sender, winnings);
        }

        emit WinningsWithdrawn(_marketId, msg.sender, winnings);
    }

    // ============ Admin Functions ============
    /**
     * @dev Cancel a market (only callable by owner)
     * @param _marketId ID of the market
     */
    function cancelMarket(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Active, "Market is not active");

        market.status = MarketStatus.Cancelled;

        emit MarketCancelled(_marketId, block.timestamp);
    }

    // ============ View Functions ============
    /**
     * @dev Get market details
     * @param _marketId ID of the market
     */
    function getMarket(
        uint256 _marketId
    ) external view returns (Market memory) {
        return markets[_marketId];
    }

    /**
     * @dev Get user's stake in a market
     * @param _marketId ID of the market
     * @param _user Address of the user
     */
    function getUserStake(
        uint256 _marketId,
        address _user
    ) external view returns (uint256 amount, Outcome outcome) {
        return (
            userStakeAmount[_marketId][_user],
            userStakeOutcome[_marketId][_user]
        );
    }

    /**
     * @dev Get all stakes for a market
     * @param _marketId ID of the market
     */
    function getMarketStakes(
        uint256 _marketId
    ) external view returns (Stake[] memory) {
        return marketStakes[_marketId];
    }

    /**
     * @dev Get total number of markets
     */
    function getMarketCount() external view returns (uint256) {
        return marketCounter;
    }
}
