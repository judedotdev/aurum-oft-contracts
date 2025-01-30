import { task } from 'hardhat/config';
import { getNetworkNameForEid, types } from '@layerzerolabs/devtools-evm-hardhat';
import { EndpointId } from '@layerzerolabs/lz-definitions';
import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities';
import { Options } from '@layerzerolabs/lz-v2-utilities';
import { BigNumber, BigNumberish, BytesLike } from 'ethers';

interface Args {
    amount: string;
    to: string;
    eid: EndpointId;
}

interface SendParam {
    dstEid: EndpointId; // Destination endpoint ID, represented as a number.
    to: BytesLike; // Recipient address, represented as bytes.
    amountLD: BigNumberish; // Amount to send in local decimals.
    minAmountLD: BigNumberish; // Minimum amount to send in local decimals.
    extraOptions: BytesLike; // Additional options supplied by the caller to be used in the LayerZero message.
    composeMsg: BytesLike; // The composed message for the send() operation.
    oftCmd: BytesLike; // The OFT command to be executed, unused in default OFT implementations.
}

// send tokens from a contract on one network to another
task('lz:oft:send', 'Sends tokens from either OFT or OFTAdapter')
    .addParam('to', 'contract address on network B', undefined, types.string)
    .addParam('eid', 'destination endpoint ID', undefined, types.eid)
    .addParam('amount', 'amount to transfer in token decimals', undefined, types.string)
    .setAction(async (taskArgs: Args, { ethers, deployments }) => {
        const toAddress = taskArgs.to;
        const eidB = taskArgs.eid;

        // Get the contract factories
        const oftAdapterDeployment = await deployments.get('MyOFTAdapter');

        const [signer] = await ethers.getSigners();

        // Create contract instances
        const oftAdapterContract = new ethers.Contract(oftAdapterDeployment.address, oftAdapterDeployment.abi, signer);

        // Get the inner token address
        const innerTokenAddress = await oftAdapterContract.token();

        // ERC-20 ABI (Only the necessary parts)
        const erc20Abi = [
            "function decimals() view returns (uint8)",
            "function approve(address spender, uint256 amount) external returns (bool)"
        ];

        // Create an instance of the ERC-20 contract
        const innerToken = await ethers.getContractAt(erc20Abi, innerTokenAddress);

        // Fetch the token decimals
        const decimals = await innerToken.decimals();
        const amount = ethers.utils.parseUnits(taskArgs.amount, decimals);
        let options = ethers.utils.hexlify(Options.newOptions().addExecutorLzReceiveOption(65000, 0).toBytes()); // Convert Uint8Array to hex -> ethers.utils.hexlify()

        const sendParam: SendParam = {
            dstEid: eidB,
            to: addressToBytes32(toAddress),
            amountLD: amount,
            minAmountLD: amount,
            extraOptions: options,
            composeMsg: ethers.utils.hexlify('0x'), // Assuming no composed message
            oftCmd: ethers.utils.hexlify('0x'), // Assuming no OFT command is needed
        };
        // Get the quote for the send operation
        // const feeQuote = await oftAdapterContract.quoteSend(sendParam, false); // Error: Please set your OApp's DVNs and/or Executor
        // const nativeFee = feeQuote.nativeFee;
        const nativeFee = ethers.utils.parseUnits("0.1", decimals);

        console.log(
            `sending ${taskArgs.amount} token(s) to network ${getNetworkNameForEid(eidB)} (${eidB})`,
        );

        // Approve the amount to be spent by the oftAdapter contract
        const approveTx = await innerToken.approve(oftAdapterDeployment.address, amount);
        await approveTx.wait();

        try {
            const gasLimit = BigNumber.from(500000); // Adjust based on network

            // @dev execution types to handle different enforcedOptions
            const SEND = 1; // a standard token transfer via send()
            const SEND_AND_CALL = 2; // a composed token transfer via send()

            const enforcedOptions = [eidB, SEND, options];
            console.log(enforcedOptions);

            // try {
            //     const setEnforcedOptionsTx = await oftAdapterContract.setEnforcedOptions(enforcedOptions);
            //     await setEnforcedOptionsTx.wait();
            //     console.log(`setEnforcedOptions Txn: https://testnet.sonicscan.org/tx/${setEnforcedOptionsTx.hash}`);
            // } catch (error) {
            //     console.error("SetEnforcedOptions Transaction Failed:", error);
            // }

            const r = await oftAdapterContract.send(sendParam, { nativeFee: nativeFee, lzTokenFee: 0 }, signer.address, {
                value: nativeFee,
                gasLimit: gasLimit,
            });
            console.log(`Send tx initiated. See: https://testnet.layerzeroscan.com/tx/${r.hash}`);
        } catch (error) {
            console.error("Send Transaction Failed:", error);
        }

    });