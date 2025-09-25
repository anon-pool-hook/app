// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ZkVerifyBridge} from "../src/ZkVerifyBridge.sol";

contract DeployZkVerifyBridge is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console2.log("Deploying ZkVerifyBridge...");
        console2.log("Deployer:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy zkVerify Bridge
        ZkVerifyBridge zkVerifyBridge = new ZkVerifyBridge();
        
        vm.stopBroadcast();
        
        console2.log("ZkVerifyBridge deployed to:", address(zkVerifyBridge));
        console2.log("Bridge Owner:", zkVerifyBridge.owner());
        console2.log("zkVerify RPC:", zkVerifyBridge.zkVerifyRPC());
        
        // Save deployment info to JSON
        string memory deploymentJson = string(abi.encodePacked(
            '{\n',
            '  "zkVerifyBridge": "', vm.toString(address(zkVerifyBridge)), '",\n',
            '  "owner": "', vm.toString(zkVerifyBridge.owner()), '",\n',
            '  "zkVerifyRPC": "', zkVerifyBridge.zkVerifyRPC(), '",\n',
            '  "deployer": "', vm.toString(deployer), '",\n',
            '  "chainId": ', vm.toString(block.chainid), ',\n',
            '  "blockNumber": ', vm.toString(block.number), '\n',
            '}'
        ));
        
        vm.writeFile("deployments/zkverify-bridge.json", deploymentJson);
        console2.log("Deployment info saved to deployments/zkverify-bridge.json");
    }
}
