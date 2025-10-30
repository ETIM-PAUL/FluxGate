import { btcTokenAbi } from "../utils/btcTokenAbi";
import { BTC_ADDR, FACTORY_ADDR, MUSD_ADDR, ROUTER_ADDR } from "../utils/cn"
import { routerAbi } from "../utils/routerAbi"
import { ethers } from "ethers";

export async function provideLiquidity(amountBTC, amountMUSD, account) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const contract = new ethers.Contract(ROUTER_ADDR, routerAbi, signer)
    const mUSDtoken = new ethers.Contract(MUSD_ADDR, btcTokenAbi, signer)
    const bTCtoken = new ethers.Contract(BTC_ADDR, btcTokenAbi, signer)

    console.log('Approving MUSD token...')
    const tx1 = await mUSDtoken.approve(ROUTER_ADDR, amountMUSD)
    await tx1.wait()
    console.log('✅ Approved router')

    console.log('Approving BTC token...')
    const tx2 = await bTCtoken.approve(ROUTER_ADDR, amountBTC)
    await tx2.wait()
    console.log('✅ Approved router')

    // Execute the deposit
    const tx3 = await contract.addLiquidity(
        MUSD_ADDR,
        BTC_ADDR,
        false,
        amountMUSD,
        amountBTC,
        0,
        0,
        account,
        Math.floor(Date.now() / 1000) + 60 * 5, // 5-min deadline
    )
    console.log('Deposit TX sent:', tx.hash)
    await tx3.wait()
    console.log('✅ Deposit confirmed:', tx.hash)
    return tx3
  } catch (err) {
    console.error('Swap failed:', err)
  }
}

  