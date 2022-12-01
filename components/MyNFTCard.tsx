
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';
import { shortenPrice } from '../utils/shortenPrice';
import { shortenName } from '../utils/shortenName';

interface NftCardInterface{
  nft?:any, onProfilePage?: any
}

let nftImages = images
const NFTCard = ({ nft, onProfilePage }: NftCardInterface) => {
  const nftCurrency  = 'MATIC'

  return (
    <Link href={{ pathname: '/nft-details', query: nft.id }}>
      <div className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md hover:shadow-lg duration-500">
        <div className="relative w-full h-52 sm:h-36 minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
          <Image
            className="flex justify-center items-center hover:scale-110 transition-all duration-500"
            src={"https://ipfs.io/ipfs/bafybeif4sapffkfskpzcbdcy23m3dssof6q745kqroiyavkna67t4i6ofq/smokez.jpg"}
            layout="fill"
            objectFit="cover"
            alt={`nft${nft.i}`}
          />
        </div>
        <div className="mt-3 flex flex-col">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
            {shortenName(nft.title)}
          </p>
          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">{nft.worth > 100000 ? shortenPrice(nft.worth) : nft.worth} <span className="normal">{nftCurrency}</span></p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-lg">{shortenAddress(onProfilePage ? nft.owner : nft.seller)}</p>
          </div>

          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg"> <span className="normal">Net Profit</span></p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-lg">$3000/mo</p>
          </div>

          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg"> <span className="normal">Product Age</span></p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-lg">5 years</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;
