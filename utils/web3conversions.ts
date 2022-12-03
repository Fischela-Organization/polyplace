import { ethers } from "ethers";

export const convertFromWei = (num: number | string) => {
  if (num) {
    return ethers.utils.formatEther(String(num));
  }
  return ""
};

export const convertToWei = (num: number | string) => {
    if(num){
        return ethers.utils.parseUnits(String(num));
    }
    return ""
};
