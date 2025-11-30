// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Telopay.sol";

contract DeployTelopay is Script {
    function setUp() public {}
    
    function run() public {
        uint256 deployerPrivateKey;
        
        // Determine which network we're deploying to and set up environment
        if (block.chainid == 8453) {
            // Base Mainnet
            deployerPrivateKey = vm.envUint("PRIVATE_KEY_BASE_MAINNET");
            console.log("Deploying to Base Mainnet (Chain ID: 8453)");
        } else if (block.chainid == 84532) {
            // Base Sepolia Testnet
            deployerPrivateKey = vm.envUint("PRIVATE_KEY_BASE_SEPOLIA");
            console.log("Deploying to Base Sepolia (Chain ID: 84532)");
        } else {
            // Local/Anvil
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
            console.log("Deploying to local network (Chain ID:", block.chainid, ")");
        }
        
        require(deployerPrivateKey != 0, "Private key not set");
        
        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer address:", deployer);
        
        // USDC token addresses
        address usdcToken;
        if (block.chainid == 8453) {
            // Base Mainnet USDC
            usdcToken = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        } else if (block.chainid == 84532) {
            // Base Sepolia USDC (mock/test)
            usdcToken = 0x036CbD53842c5426634e7929541cC2318f0aD41e;
        } else {
            // Local - will need to deploy mock
            usdcToken = vm.envAddress("USDC_TOKEN_ADDRESS");
            if (usdcToken == address(0)) {
                console.log("USDC_TOKEN_ADDRESS not set, please deploy USDC mock first");
                return;
            }
        }
        
        console.log("USDC Token address:", usdcToken);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Telopay contract
        Telopay telopay = new Telopay(usdcToken);
        
        console.log("Telopay deployed to:", address(telopay));
        console.log("Owner:", telopay.owner());
        console.log("USDC Token:", address(telopay.usdcToken()));
        
        vm.stopBroadcast();
        
        // Log deployment info for verification
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Contract Address:", address(telopay));
        console.log("Network Chain ID:", block.chainid);
        console.log("Deployment Time:", block.timestamp);
        console.log("Deployer:", deployer);
        console.log("============================");
    }
}