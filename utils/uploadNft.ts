// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from "nft.storage";

// The 'fs' builtin module on Node.js provides access to the file system
import fs from "fs";

// The 'path' module provides helpers for manipulating filesystem paths
import path from "path";
import { TokenInput } from "nft.storage/dist/src/token";

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUyNmY2RTI5QWEzYjMwMTFlNUU4Nzc2NGY4YWVDMmQ3MjA2ZjU4NTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2OTY0MTcyNzc4NywibmFtZSI6InJlYWxpbmNvbSJ9.9bZRPP81A9UEAgomP-B55UdmjJQsDeLm-MBm3eFYcpU";
/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
export async function storeNFT(image: Blob | globalThis.File |undefined, docFile: Blob | globalThis.File |undefined, name: string | undefined, description: string | undefined) {
  try {
    // load the file from disk
    // const image = await fileFromPath(imagePath);
    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

    // call client.store, passing in the image & metadata
    return nftstorage.store({
      image,
      name,
      description,
      docFile
    });
  } catch (err) {
    console.log(err, "THIS IS ERROR");
  }
}


