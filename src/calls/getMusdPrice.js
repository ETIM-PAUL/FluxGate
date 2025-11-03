import { createPublicClient, http, parseUnits } from "viem";
import { mainnet } from "viem/chains";
import { CREDITVAULT_ADDR } from "../utils/cn";
import { CreditVaultABI } from "../utils/creditVaultAbi";

export async function getMusdPrice({
  chain = mainnet,
  rpcUrl,
}) {
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const result = await client.readContract({
    address: CREDITVAULT_ADDR,
    abi: CreditVaultABI,
    functionName: "getMUSDPrice"
  });

  return result; // array of uint256 (amounts)
}
