import { useState, useMemo, useCallback, useContext } from "react";

import { useRouter } from "next/router";
import { FileWithPath, useDropzone } from "react-dropzone";
import Image from "next/image";
import { useTheme } from "next-themes";

import withTransition from "../components/withTransition";

import { Button, Loader, Modal } from "../components";

import images from "../assets";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { nftAbi } from "../Artifacts/abi/abiManager";
import { nftAddress } from "../Artifacts/contractAddress/contractManager";
import { storeNFT } from "../utils/uploadNft";
import { toast } from "react-toastify";

// let Blob: typeof globalThis extends {
//   onmessage: any;
//   Blob: infer T;
// }


const CreateNFT = () => {
  
  const [isLoad, setIsLoad] = useState(false);
  const [nftDetails, setNftDetails] = useState<{
    imageFile: any;
    docFile: any;
    title: string;
    description: string;
    productAge: string;
    revenue: string;
    expenses: string;
    traffic: string;
    location: string;
    productLink: string;
   
  }>({
    imageFile: '',
    docFile: '',
    title: "",
    description: "",
    productAge: '',
    revenue: "",
    expenses: "",
    traffic: "",
    location: "",
    productLink: ""
  });
  const handleError = (message: string) => {
    toast.error(message)
  }

  const handleSuccess = (message: string) => {
    toast.success(message)
  }
  const { theme } = useTheme();
  const { account } = useMoralis();
  const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract({});
  const mintNft = async (
    image: FileWithPath ,
    docFile: FileWithPath,
    title: string,
    description: string,

  ) => {
    try {
      setIsLoad(true);
      const nftResource: any = await storeNFT(image, docFile, title, description);

      const params = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "mintNFT",
        params: {
          _title: nftDetails.title,
          _description: nftDetails.description,
          _digiURI: nftResource?.url,
          productAge: new Date(nftDetails.productAge).getTime(),
          monthlyRevenue: nftDetails.revenue,
          monthlyExpenses:nftDetails.expenses,
          monthlyTraffic: nftDetails.traffic,
          location: nftDetails.location,
          productLink: nftDetails.productLink,
        },
      };



      await runContractFunction({
       params,
       onError: (e: any) => {handleError(e.data.message);},
        onSuccess: () => handleSuccess("Success: Bid was placed successfuly")
      });
      setIsLoad(false);
    } catch (err: any) {
      toast.error(err)
      setIsLoad(false);
    }
  };

  // const onDropImage = useCallback(async (acceptedFile: any) => {
  //   const url = await uploadToIPFS(acceptedFile[0]);

  //   setFileUrl(url);
  // }, []);

  const onDrop = useCallback(async (acceptedFile: any) => {
    let mainFile = acceptedFile[0];
    if (mainFile) {
      if (mainFile.type.split("/")[0] == "image") {
        setNftDetails((old) => ({ ...old, imageFile: mainFile }));
      } else if (mainFile.type.split("/")[1] == "pdf") {
        setNftDetails((old) => ({ ...old, docFile: mainFile }));
      }
    }

  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const fileDropZone = useDropzone({
    onDrop,
    accept: "application/pdf",
    maxSize: 50000000000000,
  });

  const fileStyle = useMemo(
    () =>
      `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && " border-file-active"}
    ${isDragAccept && " border-file-accept"}
    ${isDragReject && " border-file-reject"}
    `,
    [isDragActive, isDragAccept, isDragReject]
  );

  // if (isLoad) {
  //   return (
  //     <div className="flexStart min-h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      {isLoad && (
        <Modal
          header="Uploading & minting NFT..."
          body={
            <div className="flexCenter flex-col text-center">
              <div className="relative w-52 h-52">
                <Loader />
              </div>
            </div>
          }
          handleClose={() => setIsLoad(false)}
        />
      )}
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
          Create a new NFT
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload Image
          </p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBM Max 100mb.
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file upload"
                    className={theme === "light" ? "filter invert" : ""}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File,
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  or Browse media on your device.
                </p>
              </div>
            </div>
            {nftDetails.imageFile && (
              <aside>
                <div>
                  {nftDetails.imageFile.path
                    ? "Image saved successfully! " + nftDetails.imageFile.path
                    : null}
                </div>
              </aside>
            )}
          </div>
        </div>

        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload Doc
          </p>
          <div className="mt-4">
            <div {...fileDropZone.getRootProps()} className={fileStyle}>
              <input {...fileDropZone.getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  PDF, DOCX
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file upload"
                    className={theme === "light" ? "filter invert" : ""}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File,
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  or Browse file on your device.
                </p>
              </div>
            </div>
            {nftDetails.docFile && (
              <aside>
                <div>
                  {/* <img src={fileUrl} alt="asset_file" /> */}
                  {nftDetails.docFile.path
                    ? "Document saved successfully! " + nftDetails.docFile.path
                    : null}
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* nft name */}

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Name
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
            <input
              value={nftDetails.title}
              type="text"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Nft Name"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, title: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Description
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
            <textarea
              value={nftDetails.description}
              title="Description"
              rows={10}
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"NFT Description"}
              onChange={(e) => {
                setNftDetails((old) => ({
                  ...old,
                  description: e.target.value,
                }));
              }}
            ></textarea>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>


        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            What year did you start this product?
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
              type="date"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Product Age"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, productAge: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            $Monthly Revenue (Zero(0) if none)
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
              value={nftDetails.revenue}
              type="number"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Revenue"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, revenue: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            $Monthly Expenses (Zero(0) if none)
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
              value={nftDetails.expenses}
              type="number"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Expenses"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, expenses: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Traffic
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
              value={nftDetails.traffic}
              type="number"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Traffic"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, traffic: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Location
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
              value={nftDetails.location}
              type="text"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Location"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, location: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Product Link
          </p>
          <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
              value={nftDetails.productLink}
              type="text"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Product Link"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, productLink: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create NFT"
            isLoading={isLoad}
            classStyles="rounded-xl"
            handleClick={() =>
              mintNft(
                nftDetails.imageFile,
                nftDetails.docFile,
                nftDetails.title,
                nftDetails.description
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default withTransition(CreateNFT);
