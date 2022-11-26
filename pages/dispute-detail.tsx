import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import withTransition from "../components/withTransition";

import { shortenAddress } from "../utils/shortenAddress";
import { Banner, Button, Loader, Modal } from "../components";
import images from "../assets";
import Link from "next/link";

const DisputeDetails = () => {
  return (
    <div className="relative flex flex-col justify-center md:flex-col min-h-screen">
        <Banner
          name="Your Dispute"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"

        />
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 ">
          <Image
            alt=""
            src={""}
            objectFit="cover"
            className=" rounded-xl shadow-lg"
            layout="fill"
          />
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
            uhuk
          </h2>
        </div>

        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
            Owner
          </p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image
                alt=""
                src={images.creator1}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-lg font-semibold">
              {shortenAddress("0x")}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 font-medium text-base mb-2">
              Details
            </p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base">
              Humans from the netherlands
              <Link href={"#"} legacyBehavior>
                <span className="checkout-link text-sm">
                  Checkout the Product
                </span>
              </Link>
            </p>

            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base mt-3">
              App or Product Age: 34
            </p>

            <div className="font-poppins dark:text-white rounded-xl text-nft-black-1 font-italic text-sm mt-3 p-4 dark:bg-nft-black-3">
              Vetted Listing This quality listing has been vetted by the
              RealIncom team or an broker(Elder) to ensure accuracy of the
              information provided. Our vetting team has reviewed this listing
              and verified: Revenue
              <ol className="mt-7">
                <li>Revenue</li>
                <li>Primary</li>
                <li>Expenses</li>
                <li>Traffic</li>
              </ol>
            </div>

            <div className="font-poppins dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-4 rounded dark:bg-nft-black-3">
              Location: South Africa
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10"></div>
      </div>
    </div>
  );
};

export default withTransition(DisputeDetails);
