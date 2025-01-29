// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract Util {
    // The real endpoint ids will vary per chain, and can be found under "Supported Chains"
    uint32 aEid = 1;
    uint32 bEid = 2;

    // MyOFT aOFT;
    // MyOFT bOFT;

    function addressToBytes32(address _addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    // Call on both sides per pathway
    // aOFT.setPeer(bEid, addressToBytes32(address(bOFT)));
    // bOFT.setPeer(aEid, addressToBytes32(address(aOFT)));
}