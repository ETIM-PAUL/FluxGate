import { createPublicClient, http, parseUnits } from "viem";
import { mainnet } from "viem/chains";
import { routerAbi } from "../utils/routerAbi";

export async function getAmountsOut({
  router,
  amountIn,
  routes,
  chain = mainnet,
  rpcUrl,
}) {
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const result = await client.readContract({
    address: router,
    abi: routerAbi,
    functionName: "getAmountsOut",
    args: [amountIn, routes],
  });

  return result; // array of uint256 (amounts)
}
