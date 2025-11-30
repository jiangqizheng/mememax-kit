import "dotenv/config";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const memecore = {
	id: 4352,
	name: "MemeCore",
	nativeCurrency: {
		name: "M",
		symbol: "M",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.memecore.net"],
		},
	},
};

const SENDER_PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY; // 发送的钱包私钥
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS; // 接收的钱包地址
const TRANSFER_AMOUNT_ETHER = "0.001"; //每次转账金额
const MAX_INDEX = 100; // 最大转账次数

const account = privateKeyToAccount(`${SENDER_PRIVATE_KEY}` as `0x${string}`);
const walletClient = createWalletClient({
	account,
	chain: memecore,
	transport: http(memecore.rpcUrls.default.http[0]),
});

/**
 * 主函数
 */
(async function main() {
	let index = 0;
	while (index < MAX_INDEX) {
		const hash = await sendTransfer();
		console.log(`\n--- Transaction #${index} ---`);
		console.log(
			`${account.address} -> ${RECIPIENT_ADDRESS} : ${TRANSFER_AMOUNT_ETHER} M`,
		);
		console.log(
			`💰 Transaction successful! URL: https://memecorescan.io/tx/${hash}`,
		);
		index++;
		const randomTime = Math.floor(Math.random() * 1000) + 500;
		await new Promise((resolve) => setTimeout(resolve, randomTime));
		console.log(`Waiting for ${randomTime}ms...`);
	}
})();

/**
 * 转账
 * @returns
 */
async function sendTransfer() {
	const amountBigInt = parseEther(TRANSFER_AMOUNT_ETHER);
	const hash = await walletClient.sendTransaction({
		to: RECIPIENT_ADDRESS as `0x${string}`,
		value: amountBigInt,
	});
	return hash;
}
