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
import { fetchSingleDigi } from "../../graphql/schema";
import { useQuery } from "@apollo/client";
import { auctionAbi } from "../../Artifacts/abi/abiManager";
import { auctionAddress } from "../../Artifacts/contractAddress/contractManager";
import { convertFromWei, convertToWei } from "../../utils/web3conversions";
import { ethers } from "ethers";
import { StatusReader } from "../../components/AuctionCard";
import { fetchDocument, fetchImage } from "../../utils/fetchMetaData";
import { AiFillWarning, AiOutlineFilePdf } from "react-icons/ai";
import { toast } from "react-toastify";

interface PaymentBodyCmpAuction {
  nft: any;
  nftCurrency: any;
  nftImage: any;
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
  digi: any;
  nftCurrency: string;
  setPaymentModal: any;
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
  modalStatus,
  setModalStatus,
  digi,
  nftCurrency,
  setPaymentModal,
}: ButtonOptions) => {

  if (digi && digi.isOnSale && digi.ownerAddress.id.toLowerCase() == account) {
    return (
      <div className="flex flex-col gap-5 sm:flex-col mt-10">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
          You own this Digital Asset
        </p>
        {digi.isOnSale && <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
          Listed and on Auction
        </p>}
      </div>
    );
  } else if (digi.ownerAddress.id.toLowerCase() == account && !digi.isOnSale) {
    return (
      <div
        style={{ justifyContent: "center", alignItems: "center" }}
        className="flex flex-row justify-center align-center sm:flex-col mt-10"
      >
        <Button
          btnName="List on RealIncom"
          btnType="primary"
          classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
          handleClick={() =>
            setModalStatus(
              (old: { showBidModal: boolean; showAuction: boolean }) => ({
                ...old,
                showAuction: true,
              })
            )
          }
        />
      </div>
    );
  }

  return null
};

const PaymentBodyCmpAuction = ({
  nft,
  nftImage,
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
            <Image alt="" src={nftImage} layout="fill" objectFit="cover" />
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

  let vettedListingText = `Vetted Listing; This quality listing has been vetted by the
                  RealIncom team or an broker(Elder) to ensure accuracy of the
                  information provided. Our vetting team has reviewed this listing
                  and verified: Revenue`;

  let notVettedListingText = `This Listing hasn't been vetted yet: This quality listing hasn't been vetted by the
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
    data: digi,
    error,
  } = useQuery(fetchSingleDigi, { variables: { id: router.query.id } });

  useEffect(() => {
    // disable body scroll when navbar is open
    
    if (digi) {
      if (nftImageDoc.image == "") {
        fetchImage(digi.digi.metadataURI)
          .then((res) => {
            setNftImageDoc((old) => ({ ...old, image: res }));
          })
          .catch((err) => {
            setNftImageDoc((old) => ({ ...old, image: "" }));
          });

        fetchDocument(digi.digi.metadataURI)
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
  }, [paymentModal, successModal, digi, nftImageDoc]);

  const { runContractFunction, data } = useWeb3Contract({});
  const placeBidContract = useWeb3Contract({});

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

  
  const handleError = (message: string) => {
    toast.error(message)
  }

  const handleSuccess = (message: string) => {
    toast.success(message)
  }

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

      await runContractFunction({ params: options, onError: (e: any) => {handleError(e.data.message);},
      onSuccess: () => handleSuccess("Success: Auction started successfully") });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const placeBid = async () => {
    try {
      setIsLoading(true);
      const options = {
        abi: auctionAbi,
        contractAddress: auctionAddress,
        functionName: "placeBid",
        params: {
          auctionId: parseInt(String(router.query.auctionId), 16),
        },
        value: ethers.utils.parseUnits(String(bidDetails.bidAmount), "wei"),
      };

      await placeBidContract.runContractFunction({ params: options });
      setIsLoading(false);
    } catch (err) {
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
              digi && nftImageDoc.image != ""
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
          <h2 style={{color: "#1498D5"}}>{digi? digi.title: null} {" "} Blue Paper</h2>

            <AiOutlineFilePdf style={{ fontSize: "12rem" }} />
            <a style={{ color: "#1498D5", textDecoration: "underline" }}>
              <Link
                target="_blank"
                href={digi && nftImageDoc.doc != "" ? nftImageDoc.doc : "#"}
              >
                Click to view
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
                digi && nftImageDoc.image != ""
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
            {digi && digi.digi.title}
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
              {shortenAddress(digi ? digi.digi.ownerAddress.id : "0x...00")}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="flex flex-col gap-2 w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 font-medium text-base mb-2">
              Details
            </p>
            <p className="font-poppins font-bold dark:text-white text-nft-black-1 font-normal text-base mt-3">
              Listing Price: {digi ? convertFromWei(digi.digi.worth) : 0} MATIC
            </p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base">
              {digi ? digi.digi.description : "Loading... description"}

              <Link href={"#"} legacyBehavior>
                <span className="checkout-link text-sm">
                  Checkout the Product
                </span>
              </Link>
            </p>

            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base mt-3">
              App or Product Age:{" "}
              {isNaN(new Date(Number(digi.digi.productAge)).getFullYear())
                ? "Not Provided"
                : "Since " +
                  String(new Date(Number(digi.digi.productAge)).getFullYear())}
            </p>

            <div className="font-poppins rounded dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-4 dark:bg-nft-black-3 rounded-xl">
              {digi
                ? digi.digi.intergrityConfirmed
                  ? vettedListingText
                  : notVettedListingText
                : notVettedListingText}
              <ol className="mt-7  flex flex-col">
                <li className="mt-7 gap-20 flex">
                  Monthly Revenue{" "}
                  <span>
                    ${digi ? digi.digi.monthlyRevenue : "revenue Loading..."}
                  </span>
                </li>
                <li className="mt-7 gap-20 flex">
                  Intergrity{" "}
                  <span>
                    {digi ? (
                      digi.digi.intergrityConfirmed ? (
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
                    ${digi ? digi.digi.monthlyExpenses : "expenses Loading..."}
                  </span>
                </li>
                <li className="mt-7 gap-20 flex">
                  Monthly Traffic{" "}
                  <span>
                    {digi
                      ? digi.digi.monthlyTraffic + " visitors"
                      : "Traffic Loading..."}
                  </span>
                </li>
              </ol>
            </div>

            <div className="font-poppins dark:text-white text-nft-black-1 font-italic text-sm mt-3 p-3 dark:bg-nft-black-3 rounded-xl">
              Location: {digi ? digi.digi.location : "Location Loading..."}
            </div>

            <ButtonOptions
              modalStatus={modalStatus}
              setModalStatus={setModalStatus}
              account={account}
              digi={digi ? digi.digi : null}
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
              bidDetails={bidDetails}
              setBidDetails={setBidDetails}
              nft={nft}
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
                handleClick={() => placeBid()}
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
          nftImage={nftImageDoc.image}
          body={
            <PaymentBodyCmpAuction
              auctionDetails={auctionDetails}
              setAuctionDetails={setAuctionDetails}
              nft={digi}
              nftImage={nftImageDoc.image}
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
