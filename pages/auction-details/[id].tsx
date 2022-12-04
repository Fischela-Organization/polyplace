import {
  useState,
  useEffect,
  useContext,
  SetStateAction,
  Dispatch,
} from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import withTransition from "../../components/withTransition";

import { shortenAddress } from "../../utils/shortenAddress";
import { Button, Loader, Modal } from "../../components";
import images from "../../assets";
import Link from "next/link";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { fetchSingleDigiSale } from "../../graphql/schema";
import { useQuery } from "@apollo/client";
import { auctionAbi } from "../../Artifacts/abi/abiManager";
import { auctionAddress } from "../../Artifacts/contractAddress/contractManager";
import { convertFromWei, convertToWei } from "../../utils/web3conversions";
import { ethers } from "ethers";
import { StatusReader } from "../../components/AuctionCard";
import { fetchDocument, fetchImage } from "../../utils/fetchMetaData";
import { AiFillWarning, AiOutlineFilePdf } from "react-icons/ai";
import Countdown from "react-countdown";

import { AnyMxRecord } from "dns";
import { toast, ToastContainer } from "react-toastify";

interface PaymentBodyCmpAuction {
  nft: any;
  nftCurrency: any;
  setAuctionDetails: Dispatch<
    SetStateAction<{
      tokenId: number;
      endTime: string;
      startTime: string;
      reservedPrice: number;
    }>
  >;
  auctionDetails: {
    tokenId: number;
    endTime: string;
    startTime: string;
    reservedPrice: number;
  };
}

interface PaymentBodyCmp {
  nft: any;
  nftCurrency: any;
  nftImage: any;
  setBidDetails: Dispatch<
    SetStateAction<{
      bidAmount: number;
    }>
  >;
  bidDetails: {
    bidAmount: number;
  };
}

interface ButtonOptions {
  account: string | null;
  digiSal: any;
  nftCurrency: string;
  setPaymentModal: any;
  cancelAuction: (digiSale: any) => Promise<void>;
  resultAuction: (digiSale: any) => Promise<void>;
  releaseFunds: (digiSale: any) => Promise<void>;
  modalStatus: {
    showBidModal: boolean;
    showAuction: boolean;
  };
  setModalStatus: Dispatch<
    SetStateAction<{
      showBidModal: boolean;
      showAuction: boolean;
    }>
  >;
}

const ButtonOptions = ({
  account,
  cancelAuction,
  releaseFunds,
  resultAuction,
  modalStatus,
  setModalStatus,
  digiSal,
  nftCurrency,
  setPaymentModal,
}: ButtonOptions) => {
  if (digiSal) {
    return (
      <div className="flex flex-row justify-center gap-5 sm:flex-col mt-10">
        {digiSal.isOnSale && digiSal.digi.ownerAddress.id == account ? (
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            You own this Digital Asset
          </p>
        ) : null}

        {digiSal.isOnSale && digiSal.digi.ownerAddress.id == account ? (
          <Button
            btnName={`Cancel Auction`}
            btnType="primary"
            classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
            handleClick={() => cancelAuction(digiSal)}
          />
        ) : null}
        {!digiSal.isOnSale && digiSal.auctionResulted && (
          <Button
            btnName={`Release Funds`}
            btnType="primary"
            classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
            handleClick={() => releaseFunds(digiSal)}
          />
        )}

        {digiSal.isOnSale &&
          !digiSal.auctionResulted &&
          digiSal.digi.ownerAddress.id == account && (
            <Button
              btnName={`Result Auction`}
              btnType="primary"
              classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
              handleClick={() => resultAuction(digiSal)}
            />
          )}

        {digiSal.isOnSale && digiSal.digi.ownerAddress.id != account && (
          <Button
            btnName={`Place Bid ${
              digiSal ? convertFromWei(digiSal.amount) : ""
            } ${nftCurrency}`}
            btnType="primary"
            classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
            handleClick={() =>
              setModalStatus(
                (old: { showBidModal: boolean; showAuction: boolean }) => ({
                  ...old,
                  showBidModal: true,
                })
              )
            }
          />
        )}
      </div>
    );
  }
  return null;
};

const PaymentBodyCmpAuction = ({
  nft,
  nftCurrency,
  auctionDetails,
  setAuctionDetails,
}: PaymentBodyCmpAuction) => {
  let nftImages: any = images;
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="flexBetween">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Item
        </p>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Listing
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

        {/* <div>
            <div className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">
              {nft.price} <span className="font-semibold">{nftCurrency}</span>
            </div>
          </div> */}
      </div>

      <div className="flexBetween flex-col mt-10">
        <div className="ml-2 mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            when do you want Auction to End?
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
            <input
              type="date"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Reserved Price"}
              onChange={(e) =>
                setAuctionDetails((old) => ({
                  ...old,
                  endTime: e.target.value,
                }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>
        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            How much is your Digital Asset worth?
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
            <input
              value={auctionDetails.reservedPrice}
              type="number"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Reserved Price"}
              onChange={(e) =>
                setAuctionDetails((old) => ({
                  ...old,
                  reservedPrice: Number(e.target.value),
                }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentBodyCmp = ({
  nftImage,
  nft,
  nftCurrency,
  bidDetails,
  setBidDetails,
}: PaymentBodyCmp) => {
  let nftImages: any = images;

  return (
    <div className="flex flex-col">
      <div className="flexBetween">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Item
        </p>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Digital Asset Value
        </p>
      </div>

      <div className="flexBetweenStart my-5">
        <div className="flex-1 flexStartCenter">
          <div className="relative w-28 h-28">
            <Image alt="" src={nftImage} layout="fill" objectFit="cover" />
          </div>
          <div className="flexCenterStart flex-col ml-5">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
              {shortenAddress(nft.seller)}
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">
              {nft.title}
            </p>
          </div>
        </div>

        <div>
          <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">
            {convertFromWei(nft.amount)}{" "}
            <span className="font-semibold">{nftCurrency}</span>
          </p>
        </div>
      </div>

      <div className="flexBetween mt-10">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Bid
        </p>
        <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-xl font-normal">
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
            <input
              value={bidDetails.bidAmount}
              type="number"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Reserved Price"}
              onChange={(e) =>
                setBidDetails((old) => ({
                  ...old,
                  bidAmount: Number(e.target.value),
                }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </p>
      </div>
    </div>
  );
};

const AssetDetails = () => {
  let nftImages: any = images;
  let { account } = useMoralis();
  let [nftImageDoc, setNftImageDoc] = useState({ image: "", doc: "" });

  const [modalStatus, setModalStatus] = useState({
    showBidModal: false,
    showAuction: false,
  });
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

  let vettedListingText = `Vetted Listing [GOLD]; This quality listing has been vetted by the
                RealIncom team or an broker(Elder) to ensure accuracy of the
                information provided. Our vetting team has reviewed this listing
                and verified: Revenue`;

  let notVettedListingText = `This Listing hasn't been vetted yet [SILVER]: This quality listing hasn't been vetted by the
                RealIncom team or an broker(Elder) to ensure accuracy of the
                information provided. Our vetting team has not reviewed this listing
                and verified: Revenue`;

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
  const {
    loading,
    data: digiSale,
    error,
  } = useQuery(fetchSingleDigiSale, { variables: { id: router.query.id } });

  useEffect(() => {
    // disable body scroll when navbar is open
    if (digiSale) {
      if (nftImageDoc.image == "") {
        fetchImage(digiSale.digiSale.digi.metadataURI)
          .then((res) => {
            setNftImageDoc((old) => ({ ...old, image: res }));
          })
          .catch((err) => {
            setNftImageDoc((old) => ({ ...old, image: "" }));
          });

        fetchDocument(digiSale.digiSale.digi.metadataURI)
          .then((res) => {
            setNftImageDoc((old) => ({ ...old, doc: res }));
          })
          .catch((err) => {
            setNftImageDoc((old) => ({ ...old, doc: "" }));
          });
      }
    }

    if (paymentModal || successModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [paymentModal, successModal, digiSale, nftImageDoc]);

  const { runContractFunction, data } = useWeb3Contract({});
  const { runContractFunction: confirmResults } = useWeb3Contract({});
  const { runContractFunction: resultAuctions } = useWeb3Contract({});
  const { runContractFunction: placeBidAction } = useWeb3Contract({});
  const { runContractFunction: cancelAuctions } = useWeb3Contract({});

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady, data, isLoading]);

  const [auctionDetails, setAuctionDetails] = useState({
    tokenId: parseInt(String(router.query.id)),
    endTime: "",
    startTime: "",
    reservedPrice: 0,
  });

  const [bidDetails, setBidDetails] = useState({
    bidAmount: 0,
  });

  const startAuction = async () => {
    try {
      setIsLoading(true);
      const options = {
        abi: auctionAbi,
        contractAddress: auctionAddress,
        functionName: "startAuction",
        params: {
          tokenId: auctionDetails.tokenId,
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(
            new Date(auctionDetails.endTime).getTime() / 1000
          ),
          reservedPrice: convertToWei(auctionDetails.reservedPrice),
        },
      };

      await runContractFunction({
        params: options,
        onError: (e: any) => {
          handleError(e.data.message);
        },
        onSuccess: () => handleSuccess("Success: Auction Started successfully"),
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const placeBid = async (digiSale: any) => {
    try {
      setIsLoading(true);

      const options = {
        abi: auctionAbi,
        contractAddress: auctionAddress,
        functionName: "placeBid",
        params: {
          _auctionId: digiSale.auctionId,
        },
        msgValue: ethers.utils
          .parseEther(bidDetails.bidAmount.toString())
          .toString(),
      };

      await placeBidAction({
        params: options,
        onError: (e: any) => {
          handleError(e.data.message);
        },
        onSuccess: () => handleSuccess("Success: Bid was placed successfuly"),
      });
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err);

      setIsLoading(false);
    }
  };

  const resultAuction = async (digiSale: any) => {
    try {
      setIsLoading(true);

      const options = {
        abi: auctionAbi,
        contractAddress: auctionAddress,
        functionName: "resultAuction",
        params: {
          _auctionId: digiSale.auctionId,
        },
      };

      await resultAuctions({
        params: options,
        onError: (e: any) => {
          handleError(e.data.message);
        },
        onSuccess: () =>
          handleSuccess("Success: Auction was resulted successfully"),
      });
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err);

      setIsLoading(false);
    }
  };

  const handleError = (message: string) => {
    toast.error(message);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };
  const releaseFunds = async (digiSale: any) => {
    try {
      setIsLoading(true);

      const options = {
        abi: auctionAbi,
        contractAddress: auctionAddress,
        functionName: "confirmResults",
        params: {
          _auctionId: digiSale.auctionId,
        },
      };

      await confirmResults({
        params: options,
        onError: (e: any) => {
          handleError(e.data.message);
        },
        onSuccess: () =>
          handleSuccess("Success: funds were released successfully"),
      });
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err);

      setIsLoading(false);
    }
  };

  const cancelAuction = async (digiSale: any) => {
    try {
      setIsLoading(true);

      const options = {
        abi: auctionAbi,
        contractAddress: auctionAddress,
        functionName: "cancelAuction",
        params: {
          _auctionId: digiSale.auctionId,
        },
      };

      await cancelAuctions({
        params: options,
        onError: (e: any) => {
          handleError(e.data.message);
        },
        onSuccess: () =>
          handleSuccess("Success: Auction was cancelled successfully"),
      });
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err);

      setIsLoading(false);
    }
  };

  if (loading) return <Loader />;
  // let nftImages: any = images;

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flex flex-col gap-10 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 ">
          <Image
            alt=""
            src={
              digiSale && nftImageDoc.image != ""
                ? nftImageDoc.image
                : nftImages[`creator${4}`]
            }
            //   src={nftImages[`creator${4}`]}
            objectFit="cover"
            className=" rounded-xl shadow-lg"
            layout="fill"
          />
        </div>

        <div className="doc-side font-poppins rounded dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-4 dark:bg-nft-black-3 rounded-xl relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 ">
          <div>
            <h2 style={{ color: "#1498D5" }}>
              {digiSale ? digiSale.digiSale.title : null} Blue Paper
            </h2>
            <AiOutlineFilePdf style={{ fontSize: "12rem" }} />
            <a style={{ color: "#1498D5", textDecoration: "underline" }}>
              <Link
                target="_blank"
                href={digiSale && nftImageDoc.doc != "" ? nftImageDoc.doc : "#"}
              >
                Click to view Blue Paper
              </Link>
            </a>
            <iframe src={nftImageDoc.doc} title="description"></iframe>
          </div>
          <ul className="font-poppins flex flex-col gap-10 rounded dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-4 dark:bg-nft-black-3 rounded-xl">
            <li style={{ display: "flex", fontSize: "1.2rem" }}>
              <AiFillWarning style={{ color: "red", fontSize: "2rem" }} />
              Please Do not release funds unless proper ownership has been
              transferred and confirmed by you or a third party
            </li>

            <li>
              The Document above contains all the information need to transfer
              ownership
            </li>
            <li>
              The Document contains a break down of what this product is about
              and every detail necessary and required
            </li>

            <li>
              The sellers Contact Details, Emails, phone numbers are inside the
              document
            </li>
          </ul>
          {/* <Image
            alt=""
            src={
              digiSale && nftImageDoc.image != ""
                ? nftImageDoc.image
                : nftImages[`creator${4}`]
            }
            //   src={nftImages[`creator${4}`]}
            objectFit="cover"
            className=" rounded-xl shadow-lg"
            layout="fill"
          /> */}
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
            {digiSale && digiSale.digiSale.digi.title}
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
              {shortenAddress(
                digiSale ? digiSale.digiSale.digi.ownerAddress.id : "0x...00"
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="flex flex-col gap-2 w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
            <div className="font-poppins dark:text-white text-nft-black-1 font-medium text-base mb-2">
              <Countdown
                date={
                  digiSale
                    ? Number(digiSale.digiSale.endTime) * 1000
                    : Date.now()
                }
              />{" "}
              ON AUCTION
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 font-medium text-base mb-2">
              Details
            </p>
            <div className="font-poppins font-bold dark:text-white text-nft-black-1 font-normal text-base mt-3">
              Listing Price:{" "}
              {digiSale ? convertFromWei(digiSale.digiSale.amount) : 0} MATIC
            </div>
          </div>
          <div className="mt-3">
            <div className="font-poppins dark:text-white text-nft-black-1 font-normal text-base">
              {digiSale
                ? digiSale.digiSale.digi.description
                : "Loading... description"}

              <Link
                href={
                  digiSale
                    ? "https://" + digiSale.digiSale.digi.productLink
                    : "#"
                }
                legacyBehavior
              >
                <span className="checkout-link text-sm">
                  Checkout the Product
                </span>
              </Link>
            </div>

            <div className="font-poppins dark:text-white text-nft-black-1 font-normal text-base mt-3">
              App or Product Age:{" "}
              {isNaN(
                new Date(
                  Number(
                    digiSale ? digiSale.digiSale.digi.productAge : Date.now()
                  )
                ).getFullYear()
              )
                ? "Not Provided"
                : "Since " +
                  String(
                    new Date(
                      Number(
                        digiSale
                          ? digiSale.digiSale.digi.productAge
                          : Date.now()
                      )
                    ).getFullYear()
                  )}
            </div>

            <div className="font-poppins rounded dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-4 dark:bg-nft-black-3 rounded-xl">
              {digiSale
                ? digiSale.digiSale.digi.intergrityConfirmed
                  ? vettedListingText
                  : notVettedListingText
                : notVettedListingText}
              <ol className="mt-7  flex flex-col">
                <li className="mt-7 gap-20 flex">
                  Monthly Revenue{" "}
                  <span>
                    $
                    {digiSale
                      ? digiSale.digiSale.digi.monthlyRevenue
                      : "revenue Loading..."}
                  </span>
                </li>
                <li className="mt-7 gap-20 flex">
                  Intergrity{" "}
                  <span>
                    {digiSale ? (
                      digiSale.digiSale.digi.intergrityConfirmed ? (
                        <StatusReader type={"gold"} />
                      ) : (
                        <StatusReader type={"silver"} />
                      )
                    ) : (
                      "intergrity Loading..."
                    )}
                  </span>
                </li>
                <li className="mt-7 gap-20 flex">
                  Monthly Expenses{" "}
                  <span>
                    $
                    {digiSale
                      ? digiSale.digiSale.digi.monthlyExpenses
                      : "expenses Loading..."}
                  </span>
                </li>
                <li className="mt-7 gap-20 flex">
                  Monthly Traffic{" "}
                  <span>
                    {digiSale
                      ? digiSale.digiSale.digi.monthlyTraffic + " visitors"
                      : "Traffic Loading..."}
                  </span>
                </li>
              </ol>
            </div>

            <div className="font-poppins dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-3 dark:bg-nft-black-3 rounded-xl">
              Location:{" "}
              {digiSale
                ? digiSale.digiSale.digi.location
                : "Location Loading..."}
            </div>

            <ButtonOptions
              cancelAuction={cancelAuction}
              resultAuction={resultAuction}
              releaseFunds={releaseFunds}
              modalStatus={modalStatus}
              setModalStatus={setModalStatus}
              account={account}
              digiSal={digiSale ? digiSale.digiSale : null}
              nftCurrency={nftCurrency}
              setPaymentModal={setPaymentModal}
            />
          </div>
        </div>
      </div>

      {modalStatus.showBidModal && (
        <Modal
          header="Place a Bid"
          body={
            <PaymentBodyCmp
              nftImage={nftImageDoc.image}
              bidDetails={bidDetails}
              setBidDetails={setBidDetails}
              nft={digiSale ? digiSale.digiSale : null}
              nftCurrency={nftCurrency}
            />
          }
          footer={
            <div className="flex flex-row sm:flex-col">
              <Button
                isLoading={isLoading}
                btnName="Place Bid"
                btnType="primary"
                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={() =>
                  placeBid(digiSale ? digiSale.digiSale : null)
                }
              />
              <Button
                btnName="Cancel"
                btnType="outline"
                classStyles="rounded-xl"
                handleClick={() => setPaymentModal(false)}
              />
            </div>
          }
          handleClose={() =>
            setModalStatus((old) => ({ ...old, showBidModal: false }))
          }
        />
      )}

      {modalStatus.showAuction && (
        <Modal
          header="Start Auction"
          body={
            <PaymentBodyCmpAuction
              auctionDetails={auctionDetails}
              setAuctionDetails={setAuctionDetails}
              nft={nft}
              nftCurrency={nftCurrency}
            />
          }
          footer={
            <div className="flex flex-row sm:flex-col">
              <Button
                btnName={"Start Auction"}
                isLoading={isLoading}
                btnType="primary"
                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={() => {
                  startAuction();
                }}
              />
              <Button
                btnName="Cancel"
                btnType="outline"
                classStyles="rounded-xl"
                handleClick={() => setPaymentModal(false)}
              />
            </div>
          }
          handleClose={() =>
            setModalStatus((old) => ({ ...old, showAuction: false }))
          }
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
