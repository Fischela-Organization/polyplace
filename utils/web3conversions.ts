import {ethers} from 'ethers'

export const convertFromWei = (num: number | string) => {
    return ethers.utils.parseEther(String(num))
}

export const convertToWei = (num: number | string) => {
    return ethers.utils.parseUnits(String(num))
}