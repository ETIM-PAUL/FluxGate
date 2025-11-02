import { btcTokenAbi } from "../utils/btcTokenAbi";
import { AssetType, BTC_ADDR, CREDITVAULT_ADDR, FACTORY_ADDR, MUSD_ADDR, ROUTER_ADDR } from "../utils/cn"
import { CreditVaultABI } from "../utils/creditVaultAbi";
import { routerAbi } from "../utils/routerAbi"
import { ethers } from "ethers";

export async function processLendingInterest(amount, type) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const contract = new ethers.Contract(CREDITVAULT_ADDR, CreditVaultABI, signer)
    const tokenContract = new ethers.Contract((type === AssetType?.BTC ? BTC_ADDR : MUSD_ADDR), btcTokenAbi, signer)

    console.log('Approving MUSD token...')
    const tx1 = await tokenContract.approve(CREDITVAULT_ADDR, amount)
    await tx1.wait()
    console.log('✅ Approved credit vault')

    // Execute the deposit
    const tx2 = await contract.deposit(type, amount)
    console.log('Deposit TX sent:', tx2.hash)
    await tx2.wait()
    console.log('✅ Deposit confirmed:', tx2.hash)
    return tx2
  } catch (err) {
    console.error('Deposit failed:', err)
  }
}

  