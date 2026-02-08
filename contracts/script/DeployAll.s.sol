// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {GroupPool} from "../src/GroupPool.sol";
import {MultiSigWallet} from "../src/MultiSigWallet.sol";
import {PredictionMarket} from "../src/PredictionMarket.sol";
import {MockToken} from "../src/MockToken.sol";

contract DeployAll is Script {
    GroupPool public groupPool;
    MultiSigWallet public multiSigWallet;
    PredictionMarket public predictionMarket;
    MockToken public mockToken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy MockToken for testing
        mockToken = new MockToken();
        console.log("MockToken deployed at:", address(mockToken));

        // Deploy PredictionMarket (no dependencies)
        predictionMarket = new PredictionMarket();
        console.log("PredictionMarket deployed at:", address(predictionMarket));

        // Deploy MultiSigWallet with initial owners
        address[] memory owners = new address[](1);
        owners[0] = msg.sender;
        multiSigWallet = new MultiSigWallet(owners, 1);
        console.log("MultiSigWallet deployed at:", address(multiSigWallet));

        // Deploy GroupPool (requires PredictionMarket address)
        groupPool = new GroupPool(address(predictionMarket));
        console.log("GroupPool deployed at:", address(groupPool));

        vm.stopBroadcast();

        console.log("\n=== All contracts deployed successfully ===");
        console.log("MockToken:", address(mockToken));
        console.log("PredictionMarket:", address(predictionMarket));
        console.log("MultiSigWallet:", address(multiSigWallet));
        console.log("GroupPool:", address(groupPool));
    }
}
