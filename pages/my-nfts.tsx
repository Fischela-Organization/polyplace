import { useState, useEffect, useContext } from 'react';

import Image from 'next/image';

import withTransition from '../components/withTransition';

import { Loader, NFTCard, Banner, SearchBar } from '../components';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const MyNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount }: {fetchMyNFTsOrListedNFTs: any, currentAccount: any} = {fetchMyNFTsOrListedNFTs: "", currentAccount: ""}
  const [nfts, setNfts] = useState([{
    image: "/creator9.png",
    i: 1,
    name: "cool do",
    price: "2 ETH",
    owner: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a",
    seller: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a"
  }]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  // useEffect(() => {
  //   fetchMyNFTsOrListedNFTs()
  //     .then((items: any) => {
  //       setNfts(items);
  //       setNftsCopy(items);
  //       setIsLoading(false);
  //     });
  // }, []);

  // useEffect(() => {
  //   const sortedNfts = [...nfts];

  //   switch (activeSelect) {
  //     case 'Price (low to high)':
  //       setNfts(sortedNfts.sort((a:{price: number}, b:{price: number}) => a.price - b.price));
  //       break;
  //     case 'Price (high to low)':
  //       setNfts(sortedNfts.sort((a:{price: number}, b:{price: number}) => b.price - a.price));
  //       break;
  //     case 'Recently Added':
  //       setNfts(sortedNfts.sort((a:{tokenId: number}, b:{tokenId: number}) => b.tokenId - a.tokenId));
  //       break;
  //     default:
  //       setNfts(nfts);
  //       break;
  //   }
  // }, [activeSelect]);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  const onHandleSearch = (value: any) => {
    const filteredNfts = nfts.filter(({ name }: {name: any}) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name="Your Digi's section."
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"

        />

        <div className="flexCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 dark:bg-nft-black-4 bg-white rounded-full">
            <Image
              alt=''
              src={images.creator1}
              className="rounded-full object-cover"
              objectFit="cover"
            />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">{shortenAddress(currentAccount)}</p>
        </div>
      </div>

      {!isLoading && !nfts.length && !nftsCopy.length ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl">No Digi&apos;s Owned!</h1>
        </div>
      ) : (
        <div className="sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            <SearchBar
              activeSelect={activeSelect}
              setActiveSelect={setActiveSelect}
              handleSearch={onHandleSearch}
              clearSearch={onClearSearch}
            />
          </div>
          <div className="mt-3 w-full flex flex-wrap">
            {nfts.map((nft: any) => (
              <NFTCard
                key={nft.token}
                nft={nft}
                onProfilePage
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default withTransition(MyNFTs);
