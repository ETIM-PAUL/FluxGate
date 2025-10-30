import { createPublicClient, http, parseUnits } from "viem";
import { mainnet } from "viem/chains";
import { routerAbi } from "../utils/routerAbi";
import { BTC_ADDR, FACTORY_ADDR, MUSD_ADDR, ROUTER_ADDR } from "../utils/cn"
import { ethers } from "ethers"

export async function quoteAddLiquidity({
  amountMUSD,
  amountBTC
}) {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const router = new ethers.Contract(ROUTER_ADDR, routerAbi, provider)

  try {
    const [amountA, amountB, liquidity] = await router.quoteAddLiquidity(
      MUSD_ADDR,
      BTC_ADDR,
      true,
      FACTORY_ADDR,
      amountMUSD,
      amountBTC
    )

    return { amountA, amountB, liquidity }
  } catch (err) {
    console.error('quoteAddLiquidity failed:', err)
    throw err
  }
}
