// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PredictionMarket.sol";
import "./MultiSigWallet.sol";

/**
 * @title GroupPool
 * @dev A smart contract for managing pooled stakes in prediction markets with multi-sig approval
 */
contract GroupPool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Enums ============
    enum PoolStatus {
        Active,
        Staked,
        Resolved,
        Closed
    }

    // ============ Structs ============
    struct Pool {
        uint256 id;
        string name;
        address multiSigWallet;
        address tokenAddress; // address(0) for ETH
        uint256 totalDeposits;
        uint256 totalWithdrawn;
        PoolStatus status;
        uint256 createdAt;
        uint256 marketId;
        bool outcomeStaked; // Whether stake was placed on market
    }

    struct Member {
        address memberAddress;
        uint256 depositAmount;
        uint256 withdrawnAmount;
        bool isActive;
    }

    struct MarketStake {
        uint256 marketId;
        uint256 stakedAmount;
        bool hasStaked;
    }

    // ============ State Variables ============
    uint256 public poolCounter;
    PredictionMarket public predictionMarket;

    mapping(uint256 => Pool) public pools;
    mapping(uint256 => Member[]) public poolMembers;
    mapping(uint256 => mapping(address => uint256)) public memberIndex; // Index in poolMembers array
    mapping(uint256 => mapping(address => bool)) public isMember;
    mapping(uint256 => MarketStake) public poolMarketStakes;

    // ============ Events ============
    event PoolCreated(
        uint256 indexed poolId,
        string name,
        address multiSigWallet,
        address tokenAddress,
        uint256 timestamp
    );

    event MemberAdded(
        uint256 indexed poolId,
        address indexed member,
        uint256 timestamp
    );

    event DepositMade(
        uint256 indexed poolId,
        address indexed member,
        uint256 amount,
        uint256 totalPoolDeposits,
        uint256 timestamp
    );

    event WithdrawalRequested(
        uint256 indexed poolId,
        address indexed member,
        uint256 amount,
        uint256 timestamp
    );

    event StakePlacedOnMarket(
        uint256 indexed poolId,
        uint256 indexed marketId,
        uint256 stakedAmount,
        bool outcomeYes,
        uint256 timestamp
    );

    event WinningsDistributed(
        uint256 indexed poolId,
        uint256 totalWinnings,
        uint256 timestamp
    );

    event MemberPaidOut(
        uint256 indexed poolId,
        address indexed member,
        uint256 payout,
        uint256 timestamp
    );

    event PoolClosed(uint256 indexed poolId, uint256 timestamp);

    // ============ Modifiers ============
    modifier poolExists(uint256 _poolId) {
        require(_poolId < poolCounter, "Pool does not exist");
        _;
    }

    modifier poolIsActive(uint256 _poolId) {
        require(
            pools[_poolId].status == PoolStatus.Active,
            "Pool is not active"
        );
        _;
    }

    modifier onlyMember(uint256 _poolId) {
        require(isMember[_poolId][msg.sender], "Not a pool member");
        _;
    }

    modifier onlyMultiSig(uint256 _poolId) {
        require(
            msg.sender == pools[_poolId].multiSigWallet,
            "Only multi-sig wallet can call"
        );
        _;
    }

    // ============ Constructor ============
    /**
     * @dev Initialize the GroupPool with PredictionMarket reference
     * @param _predictionMarketAddress Address of the PredictionMarket contract
     */
    constructor(address _predictionMarketAddress) {
        require(
            _predictionMarketAddress != address(0),
            "Invalid PredictionMarket address"
        );
        predictionMarket = PredictionMarket(_predictionMarketAddress);
        poolCounter = 0;
    }

    // ============ Pool Management ============
    /**
     * @dev Create a new group pool
     * @param _name Name of the pool
     * @param _multiSigWallet Address of the MultiSigWallet for approvals
     * @param _tokenAddress Address of ERC-20 token (address(0) for ETH)
     */
    function createPool(
        string calldata _name,
        address _multiSigWallet,
        address _tokenAddress
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Pool name cannot be empty");
        require(_multiSigWallet != address(0), "Invalid multi-sig wallet");

        uint256 poolId = poolCounter++;

        pools[poolId] = Pool({
            id: poolId,
            name: _name,
            multiSigWallet: _multiSigWallet,
            tokenAddress: _tokenAddress,
            totalDeposits: 0,
            totalWithdrawn: 0,
            status: PoolStatus.Active,
            createdAt: block.timestamp,
            marketId: 0,
            outcomeStaked: false
        });

        // Add creator as first member
        _addMember(poolId, msg.sender);

        emit PoolCreated(
            poolId,
            _name,
            _multiSigWallet,
            _tokenAddress,
            block.timestamp
        );

        return poolId;
    }

    /**
     * @dev Internal function to add a member to the pool
     * @param _poolId ID of the pool
     * @param _member Address of the member
     */
    function _addMember(uint256 _poolId, address _member) internal {
        require(!isMember[_poolId][_member], "Already a member");

        memberIndex[_poolId][_member] = poolMembers[_poolId].length;
        poolMembers[_poolId].push(
            Member({
                memberAddress: _member,
                depositAmount: 0,
                withdrawnAmount: 0,
                isActive: true
            })
        );
        isMember[_poolId][_member] = true;

        emit MemberAdded(_poolId, _member, block.timestamp);
    }

    /**
     * @dev Add a member to an existing pool
     * @param _poolId ID of the pool
     * @param _member Address of the member to add
     */
    function addMember(
        uint256 _poolId,
        address _member
    ) external poolExists(_poolId) onlyMultiSig(_poolId) {
        _addMember(_poolId, _member);
    }

    // ============ Deposit Functions ============
    /**
     * @dev Deposit funds to the pool (ETH)
     * @param _poolId ID of the pool
     */
    function depositETH(
        uint256 _poolId
    ) external payable poolExists(_poolId) poolIsActive(_poolId) nonReentrant {
        Pool storage pool = pools[_poolId];
        require(
            pool.tokenAddress == address(0),
            "This pool uses ERC-20 tokens"
        );
        require(msg.value > 0, "Deposit amount must be greater than 0");

        // Add as member if not already
        if (!isMember[_poolId][msg.sender]) {
            _addMember(_poolId, msg.sender);
        }

        // Update member deposit
        uint256 memberIdx = memberIndex[_poolId][msg.sender];
        poolMembers[_poolId][memberIdx].depositAmount += msg.value;
        pool.totalDeposits += msg.value;

        emit DepositMade(
            _poolId,
            msg.sender,
            msg.value,
            pool.totalDeposits,
            block.timestamp
        );
    }

    /**
     * @dev Deposit ERC-20 tokens to the pool
     * @param _poolId ID of the pool
     * @param _amount Amount to deposit
     */
    function depositToken(
        uint256 _poolId,
        uint256 _amount
    ) external poolExists(_poolId) poolIsActive(_poolId) nonReentrant {
        Pool storage pool = pools[_poolId];
        require(pool.tokenAddress != address(0), "This pool uses ETH");
        require(_amount > 0, "Deposit amount must be greater than 0");

        // Add as member if not already
        if (!isMember[_poolId][msg.sender]) {
            _addMember(_poolId, msg.sender);
        }

        // Transfer tokens from sender to this contract
        IERC20(pool.tokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _amount
        );

        // Update member deposit
        uint256 memberIdx = memberIndex[_poolId][msg.sender];
        poolMembers[_poolId][memberIdx].depositAmount += _amount;
        pool.totalDeposits += _amount;

        emit DepositMade(
            _poolId,
            msg.sender,
            _amount,
            pool.totalDeposits,
            block.timestamp
        );
    }

    // ============ Withdrawal Functions ============
    /**
     * @dev Request withdrawal from the pool (only before staking)
     * @param _poolId ID of the pool
     * @param _amount Amount to withdraw
     */
    function requestWithdrawal(
        uint256 _poolId,
        uint256 _amount
    ) external poolExists(_poolId) onlyMember(_poolId) nonReentrant {
        Pool storage pool = pools[_poolId];
        require(pool.status == PoolStatus.Active, "Pool not in active state");

        uint256 memberIdx = memberIndex[_poolId][msg.sender];
        Member storage member = poolMembers[_poolId][memberIdx];

        uint256 availableBalance = member.depositAmount -
            member.withdrawnAmount;
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= availableBalance, "Insufficient balance");

        // Update member withdrawal
        member.withdrawnAmount += _amount;
        pool.totalWithdrawn += _amount;

        // Transfer funds back
        if (pool.tokenAddress == address(0)) {
            (bool success, ) = payable(msg.sender).call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(pool.tokenAddress).safeTransfer(msg.sender, _amount);
        }

        emit WithdrawalRequested(_poolId, msg.sender, _amount, block.timestamp);
    }

    // ============ Market Staking Functions ============
    /**
     * @dev Stake pooled funds into a prediction market (only via multi-sig)
     * @param _poolId ID of the pool
     * @param _marketId ID of the prediction market
     * @param _stakedAmount Amount to stake
     * @param _outcomeYes Whether staking on Yes (true) or No (false)
     */
    function stakePoolOnMarket(
        uint256 _poolId,
        uint256 _marketId,
        uint256 _stakedAmount,
        bool _outcomeYes
    ) external poolExists(_poolId) onlyMultiSig(_poolId) nonReentrant {
        Pool storage pool = pools[_poolId];
        require(pool.status == PoolStatus.Active, "Pool is not active");
        require(_stakedAmount > 0, "Stake amount must be greater than 0");
        require(
            _stakedAmount <= (pool.totalDeposits - pool.totalWithdrawn),
            "Insufficient pool balance"
        );
        require(
            !poolMarketStakes[_poolId].hasStaked,
            "Pool already staked on a market"
        );

        // Place stake on prediction market
        PredictionMarket.Outcome outcome = _outcomeYes
            ? PredictionMarket.Outcome.Yes
            : PredictionMarket.Outcome.No;

        if (pool.tokenAddress == address(0)) {
            // ETH stake
            predictionMarket.placeStake{value: _stakedAmount}(
                _marketId,
                outcome,
                _stakedAmount
            );
        } else {
            // ERC-20 stake - approve the PredictionMarket first
            IERC20(pool.tokenAddress).safeIncreaseAllowance(
                address(predictionMarket),
                _stakedAmount
            );
            predictionMarket.placeStake(_marketId, outcome, _stakedAmount);
        }

        // Update pool state
        pool.status = PoolStatus.Staked;
        pool.marketId = _marketId;
        pool.outcomeStaked = true;

        poolMarketStakes[_poolId] = MarketStake({
            marketId: _marketId,
            stakedAmount: _stakedAmount,
            hasStaked: true
        });

        emit StakePlacedOnMarket(
            _poolId,
            _marketId,
            _stakedAmount,
            _outcomeYes,
            block.timestamp
        );
    }

    // ============ Winnings Distribution ============
    /**
     * @dev Claim winnings from resolved market and distribute to members
     * @param _poolId ID of the pool
     */
    function claimAndDistributeWinnings(
        uint256 _poolId
    ) external poolExists(_poolId) nonReentrant {
        Pool storage pool = pools[_poolId];
        require(pool.status == PoolStatus.Staked, "Pool has not staked");
        require(poolMarketStakes[_poolId].hasStaked, "No market stake found");

        // Claim winnings from prediction market
        uint256 balanceBefore = _getPoolBalance(pool);

        predictionMarket.withdrawWinnings(pool.marketId);

        uint256 balanceAfter = _getPoolBalance(pool);
        uint256 totalWinnings = balanceAfter - balanceBefore;

        pool.status = PoolStatus.Resolved;

        emit WinningsDistributed(_poolId, totalWinnings, block.timestamp);
    }

    /**
     * @dev Distribute winnings to a specific member proportionally
     * @param _poolId ID of the pool
     * @param _member Address of the member
     */
    function distributeMemberPayout(
        uint256 _poolId,
        address _member
    ) external poolExists(_poolId) nonReentrant {
        Pool storage pool = pools[_poolId];
        require(pool.status == PoolStatus.Resolved, "Pool not resolved");
        require(isMember[_poolId][_member], "Not a pool member");

        uint256 memberIdx = memberIndex[_poolId][_member];
        Member storage member = poolMembers[_poolId][memberIdx];

        require(member.isActive, "Member is not active");

        uint256 currentBalance = _getPoolBalance(pool);
        uint256 memberDeposit = member.depositAmount;
        uint256 totalDeposits = pool.totalDeposits;

        // Calculate member's proportional share of remaining balance
        uint256 memberShare = (currentBalance * memberDeposit) / totalDeposits;

        require(memberShare > 0, "No payouts remaining");

        // Deactivate member to prevent double payouts
        member.isActive = false;

        // Transfer payout to member
        if (pool.tokenAddress == address(0)) {
            (bool success, ) = _member.call{value: memberShare}("");
            require(success, "Payout transfer failed");
        } else {
            IERC20(pool.tokenAddress).safeTransfer(_member, memberShare);
        }

        emit MemberPaidOut(_poolId, _member, memberShare, block.timestamp);
    }

    /**
     * @dev Internal function to get pool balance
     * @param _pool The Pool struct
     */
    function _getPoolBalance(
        Pool memory _pool
    ) internal view returns (uint256) {
        if (_pool.tokenAddress == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(_pool.tokenAddress).balanceOf(address(this));
        }
    }

    // ============ Pool Closure ============
    /**
     * @dev Close the pool (only via multi-sig)
     * @param _poolId ID of the pool
     */
    function closePool(
        uint256 _poolId
    ) external poolExists(_poolId) onlyMultiSig(_poolId) {
        Pool storage pool = pools[_poolId];
        require(pool.status != PoolStatus.Closed, "Pool already closed");

        pool.status = PoolStatus.Closed;

        emit PoolClosed(_poolId, block.timestamp);
    }

    // ============ View Functions ============
    /**
     * @dev Get pool details
     * @param _poolId ID of the pool
     */
    function getPool(
        uint256 _poolId
    ) external view poolExists(_poolId) returns (Pool memory) {
        return pools[_poolId];
    }

    /**
     * @dev Get member information
     * @param _poolId ID of the pool
     * @param _member Address of the member
     */
    function getMemberInfo(
        uint256 _poolId,
        address _member
    )
        external
        view
        poolExists(_poolId)
        returns (uint256 deposit, uint256 withdrawn, bool active)
    {
        require(isMember[_poolId][_member], "Not a pool member");
        uint256 memberIdx = memberIndex[_poolId][_member];
        Member memory member = poolMembers[_poolId][memberIdx];

        return (member.depositAmount, member.withdrawnAmount, member.isActive);
    }

    /**
     * @dev Get all members of a pool
     * @param _poolId ID of the pool
     */
    function getPoolMembers(
        uint256 _poolId
    ) external view poolExists(_poolId) returns (Member[] memory) {
        return poolMembers[_poolId];
    }

    /**
     * @dev Get number of members in a pool
     * @param _poolId ID of the pool
     */
    function getMemberCount(
        uint256 _poolId
    ) external view poolExists(_poolId) returns (uint256) {
        return poolMembers[_poolId].length;
    }

    /**
     * @dev Get current pool balance
     * @param _poolId ID of the pool
     */
    function getPoolBalance(
        uint256 _poolId
    ) external view poolExists(_poolId) returns (uint256) {
        Pool memory pool = pools[_poolId];
        return _getPoolBalance(pool);
    }

    /**
     * @dev Get market stake information
     * @param _poolId ID of the pool
     */
    function getMarketStakeInfo(
        uint256 _poolId
    )
        external
        view
        poolExists(_poolId)
        returns (uint256 marketId, uint256 stakedAmount, bool hasStaked)
    {
        MarketStake memory stake = poolMarketStakes[_poolId];
        return (stake.marketId, stake.stakedAmount, stake.hasStaked);
    }

    /**
     * @dev Get total number of pools
     */
    function getPoolCount() external view returns (uint256) {
        return poolCounter;
    }

    // ============ Receiver ============
    /**
     * @dev Receive ETH directly to the pool
     */
    receive() external payable {}
}
