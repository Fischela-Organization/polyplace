import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import withTransition from "../components/withTransition";

import { shortenAddress } from "../utils/shortenAddress";
import { Button, Loader, Modal } from "../components";
import images from "../assets";
import Link from "next/link";

interface PaymentBodyCmp {
  nft: any;
  nftCurrency: any;
}

const PaymentBodyCmp = ({ nft, nftCurrency }: PaymentBodyCmp) => {
  let nftImages: any = images;

  return (
    <div className="flex flex-col">
      <div className="flexBetween">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Item
        </p>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Subtotal
        </p>
      </div>

      <div className="flexBetweenStart my-5">
        <div className="flex-1 flexStartCenter">
          <div className="relative w-28 h-28">
            <Image
              alt=""
              src={nft.image || nftImages[`creator${7}`]}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flexCenterStart flex-col ml-5">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
              {shortenAddress(nft.seller)}
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">
              {nft.name}
            </p>
          </div>
        </div>

        <div>
          <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">
            {nft.price} <span className="font-semibold">{nftCurrency}</span>
          </p>
        </div>
      </div>

      <div className="flexBetween mt-10">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Total
        </p>
        <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-xl font-normal">
          {nft.price} <span className="font-semibold">{nftCurrency}</span>
        </p>
      </div>
    </div>
  );
};

const AssetDetails = () => {
  let nftImages: any = images;

  const {
    nftCurrency,
    buyNft,
    currentAccount,
    isLoadingNFT,
  }: {
    nftCurrency: any;
    buyNft: any;
    currentAccount: any;
    isLoadingNFT: boolean;
  } = {
    nftCurrency: "MATIC",
    buyNft: true,
    currentAccount: true,
    isLoadingNFT: false,
  };

  const [nft, setNft] = useState({
    image: nftImages[`nft${1}`],
    itemId: "2",
    name: "Candy Crush",
    netProfit: "$3000",
    age: "5 years",
    owner: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a",
    price: "350000",
    seller: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a",
    description:
      "A Mobile Hyper-Casual game platform with proven concept, great potential and established ASO with yearly 1M organic installs.",
    tokenId: "4",
    tokenURI: nftImages[`nft${1}`],
  });
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // disable body scroll when navbar is open
    if (paymentModal || successModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [paymentModal, successModal]);

  useEffect(() => {
    if (!router.isReady) return;

    // setNft({
    //   image: nftImages[`creator${8}`],
    //   itemId: "2",
    //   name: "Candy Crush",
    //   owner: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a",
    //   netProfit: "$3000",
    //   age: "5 years",
    //   price: "20ETH",
    //   seller: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a",
    //   description: "A Mobile Hyper-Casual game platform with proven concept, great potential and established ASO with yearly 1M organic installs.",
    //   tokenId: "4",
    //   tokenURI: nftImages[`nft${1}`],
    // });

    setIsLoading(false);
  }, [router.isReady]);

  const checkout = async () => {
    // await buyNft(nft);

    setPaymentModal(false);
    setSuccessModal(true);
  };

  if (isLoading) return <Loader />;
  // let nftImages: any = images;

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 ">
          <Image
            alt=""
            src={nftImages[`creator${4}`]}
            objectFit="cover"
            className=" rounded-xl shadow-lg"
            layout="fill"
          />
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
            {nft.name}
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
              {shortenAddress(nft.seller)}
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
              {nft.description}

                <Link href={"#"} legacyBehavior>
                  <span className="checkout-link text-sm">Checkout the Product</span>
                  
                </Link>
            </p>

            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base mt-3">
              App or Product Age: {nft.age}
            </p>

            <div className="font-poppins dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-3 border border-sky-500">
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

            <div className="font-poppins dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-3 border border-sky-500">
              Location: South Africa
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === nft.seller.toLowerCase() ? (
            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base border border-gray p-2">
              You cannot buy your own NFT
            </p>
          ) : currentAccount === nft.owner.toLowerCase() ? (
            <Button
              btnName="List on Polyplace"
              btnType="primary"
              classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
              handleClick={() =>
                router.push(
                  `/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`
                )
              }
            />
          ) : (
            <Button
              btnName={`Buy for ${nft.price} ${nftCurrency}`}
              btnType="primary"
              classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
              handleClick={() => setPaymentModal(true)}
            />
          )}
        </div>
      </div>

      {paymentModal && (
        <Modal
          header="Check Out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={
            <div className="flex flex-row sm:flex-col">
              <Button
                btnName="Checkout"
                btnType="primary"
                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={checkout}
              />
              <Button
                btnName="Cancel"
                btnType="outline"
                classStyles="rounded-xl"
                handleClick={() => setPaymentModal(false)}
              />
            </div>
          }
          handleClose={() => setPaymentModal(false)}
        />
      )}

      {isLoadingNFT && (
        <Modal
          header="Buying NFT..."
          body={
            <div className="flexCenter flex-col text-center">
              <div className="relative w-52 h-52">
                <Loader />
              </div>
            </div>
          }
          handleClose={() => setSuccessModal(false)}
        />
      )}

      {successModal && (
        <Modal
          header="Payment Successful"
          body={
            <div
              className="flexCenter flex-col text-center"
              onClick={() => setSuccessModal(false)}
            >
              <div className="relative w-52 h-52">
                <Image
                  alt=""
                  src={nft.image || nftImages[`creator${nft.itemId}`]}
                  objectFit="cover"
                  layout="fill"
                />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal mt-10">
                {" "}
                You successfully purchased{" "}
                <span className="font-semibold">{nft.name}</span> from{" "}
                <span className="font-semibold">
                  {shortenAddress(nft.seller)}
                </span>
                .
              </p>
            </div>
          }
          footer={
            <div className="flexCenter flex-col">
              <Button
                btnName="Check it out"
                btnType="primary"
                classStyles="sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={() => router.push("/my-nfts")}
              />
            </div>
          }
          handleClose={() => setSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default withTransition(AssetDetails);
