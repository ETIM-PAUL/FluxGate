import { createPublicClient, http, parseUnits } from "viem";
import { mainnet } from "viem/chains";
import { AssetType, CREDITVAULT_ADDR } from "../utils/cn";
import { CreditVaultABI } from "../utils/creditVaultAbi";

export async function getUserCreditInterest({
  chain = mainnet,
  account
}) {
  const client = createPublicClient({
    chain,
    transport: http("https://rpc.test.mezo.org"),
  });

  const lenderInfo = await client.readContract({
    address: CREDITVAULT_ADDR,
    abi: CreditVaultABI,
    functionName: "getLenderInfo",
    args: [account]
  });

  return lenderInfo;
}
