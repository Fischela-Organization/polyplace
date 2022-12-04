// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from "nft.storage";

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_WEB_3_STORAGE_ACCESS_TOKEN || "";
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
    return nftstorage.store<{image: any, name: any, description: any, docFile: any}>({
      image,
      name,
      description,
      docFile
    });
  } catch (err) {
    return err
  }
}


