import { btcTokenAbi } from "../utils/btcTokenAbi";
import { BTC_ADDR, FACTORY_ADDR, MUSD_ADDR, ROUTER_ADDR } from "../utils/cn"
import { routerAbi } from "../utils/routerAbi"
import { ethers } from "ethers";

export async function swapMUSDToBTC(amount, account) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const contract = new ethers.Contract(ROUTER_ADDR, routerAbi, signer)
    const token = new ethers.Contract(MUSD_ADDR, btcTokenAbi, signer)

    console.log('Approving token...')

    const tx1 = await token.approve(ROUTER_ADDR, amount)
    await tx1.wait()
    console.log('✅ Approved router')

    // Execute the swap
    const tx = await contract.swapExactTokensForTokens(
        amount,
        0,
        [{ from: MUSD_ADDR, to: BTC_ADDR, stable: false, factory: FACTORY_ADDR }],
        account,
        Math.floor(Date.now() / 1000) + 60 * 5, // 5-min deadline
    )
    console.log('Swap TX sent:', tx.hash)
    await tx.wait()
    console.log('✅ Swap confirmed:', tx.hash)
    return tx
  } catch (err) {
    console.error('Swap failed:', err)
  }
}

  