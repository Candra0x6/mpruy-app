import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GroupPool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const groupPoolAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_predictionMarketAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [
      { name: '_poolId', internalType: 'uint256', type: 'uint256' },
      { name: '_member', internalType: 'address', type: 'address' },
    ],
    name: 'addMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'claimAndDistributeWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'closePool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_multiSigWallet', internalType: 'address', type: 'address' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'createPool',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'depositETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_poolId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_poolId', internalType: 'uint256', type: 'uint256' },
      { name: '_member', internalType: 'address', type: 'address' },
    ],
    name: 'distributeMemberPayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMarketStakeInfo',
    outputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'stakedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'hasStaked', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_poolId', internalType: 'uint256', type: 'uint256' },
      { name: '_member', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberInfo',
    outputs: [
      { name: 'deposit', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawn', internalType: 'uint256', type: 'uint256' },
      { name: 'active', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'getPool',
    outputs: [
      {
        name: '',
        internalType: 'struct GroupPool.Pool',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'multiSigWallet', internalType: 'address', type: 'address' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
          { name: 'totalDeposits', internalType: 'uint256', type: 'uint256' },
          { name: 'totalWithdrawn', internalType: 'uint256', type: 'uint256' },
          {
            name: 'status',
            internalType: 'enum GroupPool.PoolStatus',
            type: 'uint8',
          },
          { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'outcomeStaked', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'getPoolBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_poolId', internalType: 'uint256', type: 'uint256' }],
    name: 'getPoolMembers',
    outputs: [
      {
        name: '',
        internalType: 'struct GroupPool.Member[]',
        type: 'tuple[]',
        components: [
          { name: 'memberAddress', internalType: 'address', type: 'address' },
          { name: 'depositAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'withdrawnAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'isMember',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'memberIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'poolCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'poolMarketStakes',
    outputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'stakedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'hasStaked', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'poolMembers',
    outputs: [
      { name: 'memberAddress', internalType: 'address', type: 'address' },
      { name: 'depositAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawnAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'isActive', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'pools',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'multiSigWallet', internalType: 'address', type: 'address' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'totalDeposits', internalType: 'uint256', type: 'uint256' },
      { name: 'totalWithdrawn', internalType: 'uint256', type: 'uint256' },
      {
        name: 'status',
        internalType: 'enum GroupPool.PoolStatus',
        type: 'uint8',
      },
      { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'outcomeStaked', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'predictionMarket',
    outputs: [
      { name: '', internalType: 'contract PredictionMarket', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_poolId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'requestWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_poolId', internalType: 'uint256', type: 'uint256' },
      { name: '_marketId', internalType: 'uint256', type: 'uint256' },
      { name: '_stakedAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_outcomeYes', internalType: 'bool', type: 'bool' },
    ],
    name: 'stakePoolOnMarket',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalPoolDeposits',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MemberAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'payout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MemberPaidOut',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PoolClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'multiSigWallet',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PoolCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'stakedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'outcomeYes',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakePlacedOnMarket',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'totalWinnings',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WinningsDistributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WithdrawalRequested',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MultiSigWallet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const multiSigWalletAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_owners', internalType: 'address[]', type: 'address[]' },
      {
        name: '_requiredConfirmations',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [{ name: '_newOwner', internalType: 'address', type: 'address' }],
    name: 'addOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_txId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_txId', internalType: 'uint256', type: 'uint256' }],
    name: 'confirmTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'confirmations',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_txId', internalType: 'uint256', type: 'uint256' }],
    name: 'executeTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveOwnerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_txId', internalType: 'uint256', type: 'uint256' }],
    name: 'getConfirmationStatus',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOwners',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_txId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTransaction',
    outputs: [
      {
        name: '',
        internalType: 'struct MultiSigWallet.Transaction',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          {
            name: 'status',
            internalType: 'enum MultiSigWallet.TransactionStatus',
            type: 'uint8',
          },
          { name: 'confirmations', internalType: 'uint256', type: 'uint256' },
          { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
          { name: 'initiator', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_txId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTransactionConfirmers',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTransactionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWalletDetails',
    outputs: [
      { name: 'activeOwners', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredSigs', internalType: 'uint256', type: 'uint256' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'txCount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_txId', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'hasConfirmed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isOwner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerList',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_owner', internalType: 'address', type: 'address' }],
    name: 'removeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requiredConfirmations',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_txId', internalType: 'uint256', type: 'uint256' }],
    name: 'revokeConfirmation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'submitTransaction',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transactionConfirmers',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'transactionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'transactions',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      {
        name: 'status',
        internalType: 'enum MultiSigWallet.TransactionStatus',
        type: 'uint8',
      },
      { name: 'confirmations', internalType: 'uint256', type: 'uint256' },
      { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
      { name: 'initiator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_newRequiredConfirmations',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'updateRequiredConfirmations',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ConfirmationRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'balance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnerAddition',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnerRemoval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newRequiredConfirmations',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RequiredConfirmationsChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransactionCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'confirmer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'confirmationCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransactionConfirmed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransactionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'initiator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransactionSubmitted',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PredictionMarket
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const predictionMarketAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: '_marketId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_outcome',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
      },
    ],
    name: 'adminResolveMarket',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_marketId', internalType: 'uint256', type: 'uint256' },
      { name: '_currentGasPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'autoResolveMarket',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelMarket',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      {
        name: '_resolutionBlockNumber',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_resolutionCheckCondition',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'createMarket',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMarket',
    outputs: [
      {
        name: '',
        internalType: 'struct PredictionMarket.Market',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
          {
            name: 'creationBlockNumber',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'resolutionBlockNumber',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'resolutionCheckCondition',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'status',
            internalType: 'enum PredictionMarket.MarketStatus',
            type: 'uint8',
          },
          {
            name: 'resolvedOutcome',
            internalType: 'enum PredictionMarket.Outcome',
            type: 'uint8',
          },
          { name: 'totalYesStakes', internalType: 'uint256', type: 'uint256' },
          { name: 'totalNoStakes', internalType: 'uint256', type: 'uint256' },
          { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMarketCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMarketStakes',
    outputs: [
      {
        name: '',
        internalType: 'struct PredictionMarket.Stake[]',
        type: 'tuple[]',
        components: [
          { name: 'staker', internalType: 'address', type: 'address' },
          {
            name: 'outcome',
            internalType: 'enum PredictionMarket.Outcome',
            type: 'uint8',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_marketId', internalType: 'uint256', type: 'uint256' },
      { name: '_user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserStake',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'outcome',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'marketCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'marketStakes',
    outputs: [
      { name: 'staker', internalType: 'address', type: 'address' },
      {
        name: 'outcome',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
      },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'markets',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'creationBlockNumber', internalType: 'uint256', type: 'uint256' },
      {
        name: 'resolutionBlockNumber',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'resolutionCheckCondition',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'status',
        internalType: 'enum PredictionMarket.MarketStatus',
        type: 'uint8',
      },
      {
        name: 'resolvedOutcome',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
      },
      { name: 'totalYesStakes', internalType: 'uint256', type: 'uint256' },
      { name: 'totalNoStakes', internalType: 'uint256', type: 'uint256' },
      { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_marketId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_outcome',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'placeStake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'userStakeAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'userStakeOutcome',
    outputs: [
      {
        name: '',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MarketCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'resolutionBlockNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'createdAt',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'MarketCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'outcome',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MarketResolved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'staker',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'outcome',
        internalType: 'enum PredictionMarket.Outcome',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakePlaced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'winnings',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WinningsWithdrawn',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__
 */
export const useReadGroupPool = /*#__PURE__*/ createUseReadContract({
  abi: groupPoolAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"getMarketStakeInfo"`
 */
export const useReadGroupPoolGetMarketStakeInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: groupPoolAbi,
    functionName: 'getMarketStakeInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"getMemberCount"`
 */
export const useReadGroupPoolGetMemberCount =
  /*#__PURE__*/ createUseReadContract({
    abi: groupPoolAbi,
    functionName: 'getMemberCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"getMemberInfo"`
 */
export const useReadGroupPoolGetMemberInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: groupPoolAbi,
    functionName: 'getMemberInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"getPool"`
 */
export const useReadGroupPoolGetPool = /*#__PURE__*/ createUseReadContract({
  abi: groupPoolAbi,
  functionName: 'getPool',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"getPoolBalance"`
 */
export const useReadGroupPoolGetPoolBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: groupPoolAbi,
    functionName: 'getPoolBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"getPoolCount"`
 */
export const useReadGroupPoolGetPoolCount = /*#__PURE__*/ createUseReadContract(
  { abi: groupPoolAbi, functionName: 'getPoolCount' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"getPoolMembers"`
 */
export const useReadGroupPoolGetPoolMembers =
  /*#__PURE__*/ createUseReadContract({
    abi: groupPoolAbi,
    functionName: 'getPoolMembers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"isMember"`
 */
export const useReadGroupPoolIsMember = /*#__PURE__*/ createUseReadContract({
  abi: groupPoolAbi,
  functionName: 'isMember',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"memberIndex"`
 */
export const useReadGroupPoolMemberIndex = /*#__PURE__*/ createUseReadContract({
  abi: groupPoolAbi,
  functionName: 'memberIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"poolCounter"`
 */
export const useReadGroupPoolPoolCounter = /*#__PURE__*/ createUseReadContract({
  abi: groupPoolAbi,
  functionName: 'poolCounter',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"poolMarketStakes"`
 */
export const useReadGroupPoolPoolMarketStakes =
  /*#__PURE__*/ createUseReadContract({
    abi: groupPoolAbi,
    functionName: 'poolMarketStakes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"poolMembers"`
 */
export const useReadGroupPoolPoolMembers = /*#__PURE__*/ createUseReadContract({
  abi: groupPoolAbi,
  functionName: 'poolMembers',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"pools"`
 */
export const useReadGroupPoolPools = /*#__PURE__*/ createUseReadContract({
  abi: groupPoolAbi,
  functionName: 'pools',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"predictionMarket"`
 */
export const useReadGroupPoolPredictionMarket =
  /*#__PURE__*/ createUseReadContract({
    abi: groupPoolAbi,
    functionName: 'predictionMarket',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__
 */
export const useWriteGroupPool = /*#__PURE__*/ createUseWriteContract({
  abi: groupPoolAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"addMember"`
 */
export const useWriteGroupPoolAddMember = /*#__PURE__*/ createUseWriteContract({
  abi: groupPoolAbi,
  functionName: 'addMember',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"claimAndDistributeWinnings"`
 */
export const useWriteGroupPoolClaimAndDistributeWinnings =
  /*#__PURE__*/ createUseWriteContract({
    abi: groupPoolAbi,
    functionName: 'claimAndDistributeWinnings',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"closePool"`
 */
export const useWriteGroupPoolClosePool = /*#__PURE__*/ createUseWriteContract({
  abi: groupPoolAbi,
  functionName: 'closePool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"createPool"`
 */
export const useWriteGroupPoolCreatePool = /*#__PURE__*/ createUseWriteContract(
  { abi: groupPoolAbi, functionName: 'createPool' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"depositETH"`
 */
export const useWriteGroupPoolDepositEth = /*#__PURE__*/ createUseWriteContract(
  { abi: groupPoolAbi, functionName: 'depositETH' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"depositToken"`
 */
export const useWriteGroupPoolDepositToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: groupPoolAbi,
    functionName: 'depositToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"distributeMemberPayout"`
 */
export const useWriteGroupPoolDistributeMemberPayout =
  /*#__PURE__*/ createUseWriteContract({
    abi: groupPoolAbi,
    functionName: 'distributeMemberPayout',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"requestWithdrawal"`
 */
export const useWriteGroupPoolRequestWithdrawal =
  /*#__PURE__*/ createUseWriteContract({
    abi: groupPoolAbi,
    functionName: 'requestWithdrawal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"stakePoolOnMarket"`
 */
export const useWriteGroupPoolStakePoolOnMarket =
  /*#__PURE__*/ createUseWriteContract({
    abi: groupPoolAbi,
    functionName: 'stakePoolOnMarket',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__
 */
export const useSimulateGroupPool = /*#__PURE__*/ createUseSimulateContract({
  abi: groupPoolAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"addMember"`
 */
export const useSimulateGroupPoolAddMember =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'addMember',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"claimAndDistributeWinnings"`
 */
export const useSimulateGroupPoolClaimAndDistributeWinnings =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'claimAndDistributeWinnings',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"closePool"`
 */
export const useSimulateGroupPoolClosePool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'closePool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"createPool"`
 */
export const useSimulateGroupPoolCreatePool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'createPool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"depositETH"`
 */
export const useSimulateGroupPoolDepositEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'depositETH',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"depositToken"`
 */
export const useSimulateGroupPoolDepositToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'depositToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"distributeMemberPayout"`
 */
export const useSimulateGroupPoolDistributeMemberPayout =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'distributeMemberPayout',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"requestWithdrawal"`
 */
export const useSimulateGroupPoolRequestWithdrawal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'requestWithdrawal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link groupPoolAbi}__ and `functionName` set to `"stakePoolOnMarket"`
 */
export const useSimulateGroupPoolStakePoolOnMarket =
  /*#__PURE__*/ createUseSimulateContract({
    abi: groupPoolAbi,
    functionName: 'stakePoolOnMarket',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__
 */
export const useWatchGroupPoolEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: groupPoolAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"DepositMade"`
 */
export const useWatchGroupPoolDepositMadeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'DepositMade',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"MemberAdded"`
 */
export const useWatchGroupPoolMemberAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'MemberAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"MemberPaidOut"`
 */
export const useWatchGroupPoolMemberPaidOutEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'MemberPaidOut',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"PoolClosed"`
 */
export const useWatchGroupPoolPoolClosedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'PoolClosed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"PoolCreated"`
 */
export const useWatchGroupPoolPoolCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'PoolCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"StakePlacedOnMarket"`
 */
export const useWatchGroupPoolStakePlacedOnMarketEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'StakePlacedOnMarket',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"WinningsDistributed"`
 */
export const useWatchGroupPoolWinningsDistributedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'WinningsDistributed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link groupPoolAbi}__ and `eventName` set to `"WithdrawalRequested"`
 */
export const useWatchGroupPoolWithdrawalRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: groupPoolAbi,
    eventName: 'WithdrawalRequested',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__
 */
export const useReadMultiSigWallet = /*#__PURE__*/ createUseReadContract({
  abi: multiSigWalletAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"confirmations"`
 */
export const useReadMultiSigWalletConfirmations =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'confirmations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getActiveOwnerCount"`
 */
export const useReadMultiSigWalletGetActiveOwnerCount =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getActiveOwnerCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getBalance"`
 */
export const useReadMultiSigWalletGetBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getConfirmationStatus"`
 */
export const useReadMultiSigWalletGetConfirmationStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getConfirmationStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getOwners"`
 */
export const useReadMultiSigWalletGetOwners =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getOwners',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getTransaction"`
 */
export const useReadMultiSigWalletGetTransaction =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getTransaction',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getTransactionConfirmers"`
 */
export const useReadMultiSigWalletGetTransactionConfirmers =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getTransactionConfirmers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getTransactionCount"`
 */
export const useReadMultiSigWalletGetTransactionCount =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getTransactionCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"getWalletDetails"`
 */
export const useReadMultiSigWalletGetWalletDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'getWalletDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"hasConfirmed"`
 */
export const useReadMultiSigWalletHasConfirmed =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'hasConfirmed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"isOwner"`
 */
export const useReadMultiSigWalletIsOwner = /*#__PURE__*/ createUseReadContract(
  { abi: multiSigWalletAbi, functionName: 'isOwner' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"ownerList"`
 */
export const useReadMultiSigWalletOwnerList =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'ownerList',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"requiredConfirmations"`
 */
export const useReadMultiSigWalletRequiredConfirmations =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'requiredConfirmations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"transactionConfirmers"`
 */
export const useReadMultiSigWalletTransactionConfirmers =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'transactionConfirmers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"transactionCount"`
 */
export const useReadMultiSigWalletTransactionCount =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'transactionCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"transactions"`
 */
export const useReadMultiSigWalletTransactions =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSigWalletAbi,
    functionName: 'transactions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__
 */
export const useWriteMultiSigWallet = /*#__PURE__*/ createUseWriteContract({
  abi: multiSigWalletAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"addOwner"`
 */
export const useWriteMultiSigWalletAddOwner =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'addOwner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"cancelTransaction"`
 */
export const useWriteMultiSigWalletCancelTransaction =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'cancelTransaction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"confirmTransaction"`
 */
export const useWriteMultiSigWalletConfirmTransaction =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'confirmTransaction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"executeTransaction"`
 */
export const useWriteMultiSigWalletExecuteTransaction =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'executeTransaction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"removeOwner"`
 */
export const useWriteMultiSigWalletRemoveOwner =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'removeOwner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"revokeConfirmation"`
 */
export const useWriteMultiSigWalletRevokeConfirmation =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'revokeConfirmation',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"submitTransaction"`
 */
export const useWriteMultiSigWalletSubmitTransaction =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'submitTransaction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"updateRequiredConfirmations"`
 */
export const useWriteMultiSigWalletUpdateRequiredConfirmations =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSigWalletAbi,
    functionName: 'updateRequiredConfirmations',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__
 */
export const useSimulateMultiSigWallet =
  /*#__PURE__*/ createUseSimulateContract({ abi: multiSigWalletAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"addOwner"`
 */
export const useSimulateMultiSigWalletAddOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'addOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"cancelTransaction"`
 */
export const useSimulateMultiSigWalletCancelTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'cancelTransaction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"confirmTransaction"`
 */
export const useSimulateMultiSigWalletConfirmTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'confirmTransaction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"executeTransaction"`
 */
export const useSimulateMultiSigWalletExecuteTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'executeTransaction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"removeOwner"`
 */
export const useSimulateMultiSigWalletRemoveOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'removeOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"revokeConfirmation"`
 */
export const useSimulateMultiSigWalletRevokeConfirmation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'revokeConfirmation',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"submitTransaction"`
 */
export const useSimulateMultiSigWalletSubmitTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'submitTransaction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSigWalletAbi}__ and `functionName` set to `"updateRequiredConfirmations"`
 */
export const useSimulateMultiSigWalletUpdateRequiredConfirmations =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSigWalletAbi,
    functionName: 'updateRequiredConfirmations',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__
 */
export const useWatchMultiSigWalletEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: multiSigWalletAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"ConfirmationRevoked"`
 */
export const useWatchMultiSigWalletConfirmationRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'ConfirmationRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"Deposit"`
 */
export const useWatchMultiSigWalletDepositEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'Deposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"OwnerAddition"`
 */
export const useWatchMultiSigWalletOwnerAdditionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'OwnerAddition',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"OwnerRemoval"`
 */
export const useWatchMultiSigWalletOwnerRemovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'OwnerRemoval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"RequiredConfirmationsChanged"`
 */
export const useWatchMultiSigWalletRequiredConfirmationsChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'RequiredConfirmationsChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"TransactionCancelled"`
 */
export const useWatchMultiSigWalletTransactionCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'TransactionCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"TransactionConfirmed"`
 */
export const useWatchMultiSigWalletTransactionConfirmedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'TransactionConfirmed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"TransactionExecuted"`
 */
export const useWatchMultiSigWalletTransactionExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'TransactionExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSigWalletAbi}__ and `eventName` set to `"TransactionSubmitted"`
 */
export const useWatchMultiSigWalletTransactionSubmittedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSigWalletAbi,
    eventName: 'TransactionSubmitted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__
 */
export const useReadPredictionMarket = /*#__PURE__*/ createUseReadContract({
  abi: predictionMarketAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"getMarket"`
 */
export const useReadPredictionMarketGetMarket =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'getMarket',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"getMarketCount"`
 */
export const useReadPredictionMarketGetMarketCount =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'getMarketCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"getMarketStakes"`
 */
export const useReadPredictionMarketGetMarketStakes =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'getMarketStakes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"getUserStake"`
 */
export const useReadPredictionMarketGetUserStake =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'getUserStake',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"marketCounter"`
 */
export const useReadPredictionMarketMarketCounter =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'marketCounter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"marketStakes"`
 */
export const useReadPredictionMarketMarketStakes =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'marketStakes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"markets"`
 */
export const useReadPredictionMarketMarkets =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'markets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"owner"`
 */
export const useReadPredictionMarketOwner = /*#__PURE__*/ createUseReadContract(
  { abi: predictionMarketAbi, functionName: 'owner' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"userStakeAmount"`
 */
export const useReadPredictionMarketUserStakeAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'userStakeAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"userStakeOutcome"`
 */
export const useReadPredictionMarketUserStakeOutcome =
  /*#__PURE__*/ createUseReadContract({
    abi: predictionMarketAbi,
    functionName: 'userStakeOutcome',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__
 */
export const useWritePredictionMarket = /*#__PURE__*/ createUseWriteContract({
  abi: predictionMarketAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"adminResolveMarket"`
 */
export const useWritePredictionMarketAdminResolveMarket =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'adminResolveMarket',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"autoResolveMarket"`
 */
export const useWritePredictionMarketAutoResolveMarket =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'autoResolveMarket',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"cancelMarket"`
 */
export const useWritePredictionMarketCancelMarket =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'cancelMarket',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"createMarket"`
 */
export const useWritePredictionMarketCreateMarket =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'createMarket',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"placeStake"`
 */
export const useWritePredictionMarketPlaceStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'placeStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWritePredictionMarketRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWritePredictionMarketTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"withdrawWinnings"`
 */
export const useWritePredictionMarketWithdrawWinnings =
  /*#__PURE__*/ createUseWriteContract({
    abi: predictionMarketAbi,
    functionName: 'withdrawWinnings',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__
 */
export const useSimulatePredictionMarket =
  /*#__PURE__*/ createUseSimulateContract({ abi: predictionMarketAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"adminResolveMarket"`
 */
export const useSimulatePredictionMarketAdminResolveMarket =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'adminResolveMarket',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"autoResolveMarket"`
 */
export const useSimulatePredictionMarketAutoResolveMarket =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'autoResolveMarket',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"cancelMarket"`
 */
export const useSimulatePredictionMarketCancelMarket =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'cancelMarket',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"createMarket"`
 */
export const useSimulatePredictionMarketCreateMarket =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'createMarket',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"placeStake"`
 */
export const useSimulatePredictionMarketPlaceStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'placeStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulatePredictionMarketRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulatePredictionMarketTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link predictionMarketAbi}__ and `functionName` set to `"withdrawWinnings"`
 */
export const useSimulatePredictionMarketWithdrawWinnings =
  /*#__PURE__*/ createUseSimulateContract({
    abi: predictionMarketAbi,
    functionName: 'withdrawWinnings',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link predictionMarketAbi}__
 */
export const useWatchPredictionMarketEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: predictionMarketAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link predictionMarketAbi}__ and `eventName` set to `"MarketCancelled"`
 */
export const useWatchPredictionMarketMarketCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: predictionMarketAbi,
    eventName: 'MarketCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link predictionMarketAbi}__ and `eventName` set to `"MarketCreated"`
 */
export const useWatchPredictionMarketMarketCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: predictionMarketAbi,
    eventName: 'MarketCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link predictionMarketAbi}__ and `eventName` set to `"MarketResolved"`
 */
export const useWatchPredictionMarketMarketResolvedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: predictionMarketAbi,
    eventName: 'MarketResolved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link predictionMarketAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchPredictionMarketOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: predictionMarketAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link predictionMarketAbi}__ and `eventName` set to `"StakePlaced"`
 */
export const useWatchPredictionMarketStakePlacedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: predictionMarketAbi,
    eventName: 'StakePlaced',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link predictionMarketAbi}__ and `eventName` set to `"WinningsWithdrawn"`
 */
export const useWatchPredictionMarketWinningsWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: predictionMarketAbi,
    eventName: 'WinningsWithdrawn',
  })
