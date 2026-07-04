// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {PayPortSettlement} from "../src/PayPortSettlement.sol";

interface Vm {
    function envUint(string calldata name) external returns (uint256);
    function envOr(string calldata name, address defaultValue) external returns (address);
    function addr(uint256 privateKey) external returns (address);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

contract DeployPayPortSettlement {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    event PayPortSettlementDeployed(
        address indexed contractAddress,
        uint256 indexed chainId,
        address indexed owner,
        address recorder
    );

    function run() external returns (PayPortSettlement settlement) {
        uint256 deployerPrivateKey = _readPrivateKeyForChain();
        address deployer = vm.addr(deployerPrivateKey);
        address recorder = vm.envOr("SETTLEMENT_RECORDER_ADDRESS", deployer);

        vm.startBroadcast(deployerPrivateKey);
        settlement = new PayPortSettlement(deployer);
        if (recorder != deployer) {
            settlement.setRecorder(recorder, true);
        }
        vm.stopBroadcast();

        emit PayPortSettlementDeployed(address(settlement), block.chainid, deployer, recorder);
    }

    function _readPrivateKeyForChain() internal returns (uint256) {
        if (block.chainid == 421614) {
            return vm.envUint("ARBITRUM_SEPOLIA_PRIVATE_KEY");
        }

        if (block.chainid == 42161) {
            return vm.envUint("ARBITRUM_ONE_PRIVATE_KEY");
        }

        revert("Unsupported chain. Use Arbitrum Sepolia or Arbitrum One.");
    }
}
