import Image from "next/image";
import Link from "next/link";

import images from "../assets";
import { shortenAddress } from "../utils/shortenAddress";
import { shortenPrice } from "../utils/shortenPrice";
import { shortenName } from "../utils/shortenName";
import { BsFillCartCheckFill } from "react-icons/bs";
import { ethers } from "ethers";
import {convertFromWei} from '../utils/web3conversions'
import { useEffect, useState } from "react";
import { fetchImage } from "../utils/fetchMetaData";
interface NftCardInterface {
  nft?: any;
  onProfilePage?: any;
}

let nftImages = images;

export const StatusReader = ({type = "gold"}) => {
  switch (type) {
    case "silver":
      return (
        <div className="status-container">
          <BsFillCartCheckFill className="cart-on-sale" />
          <h6 className="status-text">SILVER</h6>
        </div>
      );

    case "gold":
      return (
        <div style={{color: "gold"}} className="status-container">
          <BsFillCartCheckFill style={{color: "gold"}} className="cart-on-sale" />
          <h6 className="status-text">GOLD</h6>
        </div>
      );

    default:
      return (
        <div className="status-container">
          <BsFillCartCheckFill className="cart-on-sale" />
          <h6 className="status-text">GOLD</h6>
        </div>
      );
  }
};

const AuctionCard = ({ nft, onProfilePage }: NftCardInterface) => {
  const nftCurrency = "MATIC";
  const [nftImage, setNftImage] = useState({image: ""})

  useEffect(() => {
    if (nft) {
      if (nftImage.image == "") {
        fetchImage(nft.digi.metadataURI)
          .then((res) => {
            setNftImage((old) => ({ ...old, image: res }));
          })
          .catch((err) => {
            console.log(err);
            setNftImage((old) => ({ ...old, image: "" }));
          });
    }
  }
  }, [nft])

  return (
    <Link href={{ pathname: `/auction-details/${nft.id}`}}>
      <div className="nft-card flex-1 min-w-327 max-w-max xs:max-w-none sm:w-full sm:min-w-256 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md hover:shadow-lg duration-500">
        <div className="relative w-full h-52 sm:h-36 minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
          <Image
            className="flex justify-center items-center hover:scale-110 transition-all duration-500"
            src={
              nftImage.image
            }
            layout="fill"
            objectFit="cover"
            alt={`nft${nft.i}`}
          />
        </div>
        <div className="mt-3 flex flex-col">
          {nft.intergrityConfirmed && <StatusReader type={"gold"} />}
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
            {shortenName(nft.title)}
          </p>
          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">
              {convertFromWei(nft.amount).toString()} {" "}
              <span className="normal">{nftCurrency}</span>
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-lg">
              {shortenAddress(onProfilePage ? nft.digi.owner : nft.seller)}
            </p>
          </div>

          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">
              {" "}
              <span className="normal">Title</span>
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-lg">
              {nft.digi.title}
            </p>
          </div>

          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">
              {" "}
              <span className="normal">Description</span>
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-lg">
              {shortenAddress(nft.digi.description)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
