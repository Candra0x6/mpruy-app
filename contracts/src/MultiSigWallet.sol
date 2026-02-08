// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MultiSigWallet
 * @dev A smart contract for managing multi-signature transactions with N/M approval mechanism
 */
contract MultiSigWallet is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Enums ============
    enum TransactionStatus {
        Pending,
        Executed,
        Cancelled
    }

    // ============ Structs ============
    struct Transaction {
        uint256 id;
        address to;
        uint256 value;
        bytes data;
        TransactionStatus status;
        uint256 confirmations;
        uint256 createdAt;
        address initiator;
    }

    struct Owner {
        address ownerAddress;
        bool isActive;
    }

    // ============ State Variables ============
    address[] public ownerList;
    mapping(address => bool) public isOwner;
    mapping(address => bool) private _deletedOwners; // Track deleted owners

    uint256 public requiredConfirmations;
    uint256 public transactionCount;

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    mapping(uint256 => address[]) public transactionConfirmers;

    // ============ Events ============
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event TransactionSubmitted(
        uint256 indexed txId,
        address indexed initiator,
        address indexed to,
        uint256 value
    );
    event TransactionConfirmed(
        uint256 indexed txId,
        address indexed confirmer,
        uint256 confirmationCount
    );
    event TransactionExecuted(
        uint256 indexed txId,
        address indexed executor,
        uint256 timestamp
    );
    event TransactionCancelled(uint256 indexed txId, uint256 timestamp);
    event ConfirmationRevoked(uint256 indexed txId, address indexed owner);
    event RequiredConfirmationsChanged(
        uint256 newRequiredConfirmations,
        uint256 timestamp
    );
    event Deposit(address indexed from, uint256 amount, uint256 balance);

    modifier txExists(uint256 _txId) {
        require(_txId < transactionCount, "Transaction does not exist");
        _;
    }

    modifier notConfirmed(uint256 _txId) {
        require(
            !confirmations[_txId][msg.sender],
            "Transaction already confirmed"
        );
        _;
    }

    modifier notExecuted(uint256 _txId) {
        require(
            transactions[_txId].status == TransactionStatus.Pending,
            "Transaction already executed or cancelled"
        );
        _;
    }

    // ============ Constructor ============
    /**
     * @dev Initialize the multi-sig wallet with initial owners and required confirmations
     * @param _owners Array of initial owner addresses
     * @param _requiredConfirmations Number of confirmations required
     */
    constructor(address[] memory _owners, uint256 _requiredConfirmations) {
        require(_owners.length > 0, "Owners required");
        require(
            _requiredConfirmations > 0 &&
                _requiredConfirmations <= _owners.length,
            "Invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner address");
            require(!isOwner[owner], "Owner not unique");

            isOwner[owner] = true;
            ownerList.push(owner);
        }

        requiredConfirmations = _requiredConfirmations;
        transactionCount = 0;
    }

    // ============ Receiver ============
    /**
     * @dev Receive ETH directly to the wallet
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    // ============ Owner Management ============
    /**
     * @dev Add a new owner to the wallet
     * @param _newOwner Address of the new owner
     */
    function addOwner(address _newOwner) external {
        require(_newOwner != address(0), "Invalid address");
        require(!isOwner[_newOwner], "Owner already exists");

        isOwner[_newOwner] = true;
        ownerList.push(_newOwner);
        _deletedOwners[_newOwner] = false;

        emit OwnerAddition(_newOwner);
    }

    /**
     * @dev Remove an owner from the wallet
     * @param _owner Address of the owner to remove
     */
    function removeOwner(address _owner) external {
        require(isOwner[_owner], "Owner does not exist");
        require(getActiveOwnerCount() > 1, "Cannot remove last owner");
        require(
            getActiveOwnerCount() - 1 >= requiredConfirmations,
            "Cannot drop below required confirmations"
        );

        isOwner[_owner] = false;
        _deletedOwners[_owner] = true;

        emit OwnerRemoval(_owner);
    }

    /**
     * @dev Update the number of required confirmations
     * @param _newRequiredConfirmations New required confirmations count
     */
    function updateRequiredConfirmations(
        uint256 _newRequiredConfirmations
    ) external {
        uint256 activeOwners = getActiveOwnerCount();
        require(
            _newRequiredConfirmations > 0 &&
                _newRequiredConfirmations <= activeOwners,
            "Invalid number of required confirmations"
        );

        requiredConfirmations = _newRequiredConfirmations;
        emit RequiredConfirmationsChanged(
            _newRequiredConfirmations,
            block.timestamp
        );
    }

    // ============ Transaction Management ============
    /**
     * @dev Submit a new transaction for approval
     * @param _to Destination address
     * @param _value ETH value to send
     * @param _data Encoded function call data
     */
    function submitTransaction(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) external returns (uint256) {
        require(_to != address(0), "Invalid destination");

        uint256 txId = transactionCount++;

        transactions[txId] = Transaction({
            id: txId,
            to: _to,
            value: _value,
            data: _data,
            status: TransactionStatus.Pending,
            confirmations: 0,
            createdAt: block.timestamp,
            initiator: msg.sender
        });

        // Auto-confirm by transaction initiator
        confirmations[txId][msg.sender] = true;
        transactionConfirmers[txId].push(msg.sender);
        transactions[txId].confirmations = 1;

        emit TransactionSubmitted(txId, msg.sender, _to, _value);
        emit TransactionConfirmed(txId, msg.sender, 1);

        return txId;
    }

    /**
     * @dev Confirm a pending transaction
     * @param _txId ID of the transaction
     */
    function confirmTransaction(
        uint256 _txId
    ) external txExists(_txId) notConfirmed(_txId) notExecuted(_txId) {
        confirmations[_txId][msg.sender] = true;
        transactionConfirmers[_txId].push(msg.sender);
        transactions[_txId].confirmations += 1;

        emit TransactionConfirmed(
            _txId,
            msg.sender,
            transactions[_txId].confirmations
        );
    }

    /**
     * @dev Revoke confirmation for a transaction
     * @param _txId ID of the transaction
     */
    function revokeConfirmation(
        uint256 _txId
    ) external txExists(_txId) notExecuted(_txId) {
        require(confirmations[_txId][msg.sender], "Must be confirmed");

        confirmations[_txId][msg.sender] = false;
        transactions[_txId].confirmations -= 1;

        emit ConfirmationRevoked(_txId, msg.sender);
    }

    /**
     * @dev Execute a transaction after required confirmations are met
     * @param _txId ID of the transaction
     */
    function executeTransaction(
        uint256 _txId
    ) external txExists(_txId) notExecuted(_txId) nonReentrant {
        Transaction storage transaction = transactions[_txId];
        require(
            transaction.confirmations >= requiredConfirmations,
            "Cannot execute: not enough confirmations"
        );

        transaction.status = TransactionStatus.Executed;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction execution failed");

        emit TransactionExecuted(_txId, msg.sender, block.timestamp);
    }

    /**
     * @dev Cancel a pending transaction
     * @param _txId ID of the transaction
     */
    function cancelTransaction(
        uint256 _txId
    ) external txExists(_txId) notExecuted(_txId) {
        transactions[_txId].status = TransactionStatus.Cancelled;
        emit TransactionCancelled(_txId, block.timestamp);
    }

    // ============ View Functions ============
    /**
     * @dev Get number of active owners
     */
    function getActiveOwnerCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < ownerList.length; i++) {
            if (isOwner[ownerList[i]]) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev Get list of all active owners
     */
    function getOwners() external view returns (address[] memory) {
        address[] memory activeOwners = new address[](getActiveOwnerCount());
        uint256 index = 0;

        for (uint256 i = 0; i < ownerList.length; i++) {
            if (isOwner[ownerList[i]]) {
                activeOwners[index] = ownerList[i];
                index++;
            }
        }

        return activeOwners;
    }

    /**
     * @dev Get transaction details
     * @param _txId ID of the transaction
     */
    function getTransaction(
        uint256 _txId
    ) external view txExists(_txId) returns (Transaction memory) {
        return transactions[_txId];
    }

    /**
     * @dev Get confirmation status for a transaction
     * @param _txId ID of the transaction
     */
    function getConfirmationStatus(
        uint256 _txId
    ) external view txExists(_txId) returns (uint256, uint256) {
        return (transactions[_txId].confirmations, requiredConfirmations);
    }

    /**
     * @dev Check if an address has confirmed a transaction
     * @param _txId ID of the transaction
     * @param _owner Owner address
     */
    function hasConfirmed(
        uint256 _txId,
        address _owner
    ) external view txExists(_txId) returns (bool) {
        return confirmations[_txId][_owner];
    }

    /**
     * @dev Get all confirmers for a transaction
     * @param _txId ID of the transaction
     */
    function getTransactionConfirmers(
        uint256 _txId
    ) external view txExists(_txId) returns (address[] memory) {
        return transactionConfirmers[_txId];
    }

    /**
     * @dev Get wallet balance in ETH
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Get total transaction count
     */
    function getTransactionCount() external view returns (uint256) {
        return transactionCount;
    }

    /**
     * @dev Get wallet details
     */
    function getWalletDetails()
        external
        view
        returns (
            uint256 activeOwners,
            uint256 requiredSigs,
            uint256 balance,
            uint256 txCount
        )
    {
        return (
            getActiveOwnerCount(),
            requiredConfirmations,
            address(this).balance,
            transactionCount
        );
    }
}
