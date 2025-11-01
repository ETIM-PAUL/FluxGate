import { createPublicClient, formatUnits, http, parseUnits } from "viem";
import { MUSDBTC_ADDR } from "../utils/cn"
import { ethers } from "ethers"
import { btcTokenAbi } from "../utils/btcTokenAbi";

export async function getLiquidityBal(account) {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const pool = new ethers.Contract(MUSDBTC_ADDR, btcTokenAbi, provider)

  try {
    const bal = await pool.balanceOf(account)

    return Number(formatUnits(bal, 18)).toFixed(3)
  } catch (err) {
    console.error('getting pool liquidity balance failed:', err)
    throw err
  }
}
