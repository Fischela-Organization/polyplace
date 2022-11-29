import { useState, useMemo, useCallback, useContext } from "react";

import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useTheme } from "next-themes";

import withTransition from "../components/withTransition";

import { Button, Input, Loader } from "../components";

import images from "../assets";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { nftAbi } from "../Artifacts/abi/abiManager";
import { nftAddress } from "../Artifacts/contractAddress/contractManager";
import { storeNFT } from "../utils/uploadNft";

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [nftDetails, setNftDetails] = useState<{
    imageFile: Blob | globalThis.File;
    docFile: Blob | globalThis.File;
    name: string;
    description: string;
    price: string;
  }>({
    imageFile: new Blob(),
    docFile: new Blob(),
    name: "",
    description: "",
    price: "",
  });
  const { theme } = useTheme();
  const { signup, isAuthenticated, user, account } = useMoralis();
  const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract({
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "mintNFT",
      params: {
        _title: "0x2Cdb125180A315afd2926850b56616AdADBa840B",
        _description: "Hello",
        _digiURI: "ipfs://",
      },
    });
  const { isLoadingNFT } = { isLoadingNFT: "" };
  const mintNft = async (
    image: Blob | globalThis.File,
    docFile: Blob | globalThis.File,
    name: string,
    description: string
  ) => {
    try {
      setIsLoad(true);
      const nftResource = await storeNFT(image, docFile, name, description);
      console.log(nftResource, "HOLE");

      const params = {
        _title: nftDetails.name,
        _description: nftDetails.description,
        _digiURI: nftResource?.url,
      };

      runContractFunction({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "mintNFT",
        params,
      }).then
      console.log(data, account, "DATA");
      setIsLoad(false);
    } catch (err) {
      setIsLoad(false);
    }
  };
  const router = useRouter();

  // const onDropImage = useCallback(async (acceptedFile: any) => {
  //   const url = await uploadToIPFS(acceptedFile[0]);

  //   setFileUrl(url);
  // }, []);

  const onDrop = useCallback(async (acceptedFile: any) => {
    let mainFile = acceptedFile[0];
    if (mainFile) {
      if (mainFile.type.split("/")[0] == "image") {
        console.log("CALLED");
        setNftDetails((old) => ({ ...old, imageFile: mainFile }));
      } else if (mainFile.type.split("/")[1] == "pdf") {
        setNftDetails((old) => ({ ...old, docFile: mainFile }));
      }
    }

    console.log(acceptedFile, nftDetails, "FILE");
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

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
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
              value={nftDetails.name}
              type="text"
              className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
              placeholder={"Nft Name"}
              onChange={(e) =>
                setNftDetails((old) => ({ ...old, name: e.target.value }))
              }
            />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Name
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
                console.log(nftDetails, "HIPI");
              }}
            ></textarea>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl"></p>
          </div>
        </div>
        {/* <Input
          inputValue={formInput.name}
          inputType="input"
          title="Name"
          placeholder="NFT name"
          handleChange={(e: any) =>
            setFormInput({ ...formInput, name: e.target.value })
          }
        /> */}
        {/* <Input
          inputType="textarea"
          inputValue={formInput.name}
          title="Description"
          placeholder="NFT Description"
          handleChange={(e: any) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        /> */}
        {/* <Input
          inputType="number"
          title="Price"
          inputValue={formInput.name}
          placeholder="NFT Price"
          handleChange={(e: any) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        /> */}
        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create NFT"
            isLoading={isLoad}
            classStyles="rounded-xl"
            handleClick={() =>
              mintNft(
                nftDetails.imageFile,
                nftDetails.docFile,
                nftDetails.name,
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
