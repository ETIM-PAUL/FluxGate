import { createPublicClient, http, parseUnits } from "viem";
import { mainnet } from "viem/chains";
import { AssetType, CREDITVAULT_ADDR } from "../utils/cn";
import { CreditVaultABI } from "../utils/creditVaultAbi";

export async function getCreditVaultInfo({
  chain = mainnet,
  rpcUrl,
}) {
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const musdInfo = await client.readContract({
    address: CREDITVAULT_ADDR,
    abi: CreditVaultABI,
    functionName: "getPoolInfo",
    args: [AssetType.MUSD]
  });
  const btcInfo = await client.readContract({
    address: CREDITVAULT_ADDR,
    abi: CreditVaultABI,
    functionName: "getPoolInfo",
    args: [AssetType.BTC]
  });

  return {
    musdInfo,
    btcInfo,
  };
}
