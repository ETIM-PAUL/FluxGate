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