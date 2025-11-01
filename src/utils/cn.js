import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const uint256ToBigInt = (u256) => {
    // Handles shapes { low, high } or [low, high]
    const low = typeof u256.low !== 'undefined' ? u256.low : u256[0];
    const high = typeof u256.high !== 'undefined' ? u256.high : u256[1];
    return (BigInt(high) << 128n) + BigInt(low);
  };
  
export const formatUnits = (valueBigInt, decimals) => {
  const d = BigInt(decimals);
  const base = 10n ** d;
  const whole = valueBigInt / base;
  const frac = valueBigInt % base;
  // Trim trailing zeros in fractional part
  const fracStr = frac.toString().padStart(Number(d), '0').replace(/0+$/, '');
  return fracStr.length ? `${whole.toString()}.${fracStr}` : whole.toString();
};

export const MUSD_ADDR = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503"
export const ROUTER_ADDR = "0x9a1ff7FE3a0F69959A3fBa1F1e5ee18e1A9CD7E9";
export const FACTORY_ADDR = "0x4947243CC818b627A5D06d14C4eCe7398A23Ce1A";
export const BTC_ADDR = "0x7b7C000000000000000000000000000000000000";
export const MUSDBTC_ADDR = "0xd16A5Df82120ED8D626a1a15232bFcE2366d6AA9";
export const CREDITVAULT_ADDR = "0x8fC445A415BBc2B5D0851344F46B0CD8866C26Bc";