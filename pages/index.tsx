import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';


import { Banner, CreatorCard, Loader, NFTCard, SearchBar, withTransition } from '../components';

import images from '../assets';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';

const Home = () => {
  let fetchNFTs: any 
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([{
    image: "/creator9.png",
    i: 1,
    name: "cool do",
    price: "2 ETH",
    owner: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a",
    seller: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a"
  }]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const { theme } = useTheme();
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const [isLoading, setIsLoading] = useState(false);

  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  // useEffect(() => {
  //   fetchNFTs()
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
  //       setNfts(sortedNfts.sort((a:any, b:any) => a.price - b.price));
  //       break;
  //     case 'Price (high to low)':
  //       setNfts(sortedNfts.sort((a:any, b:any) => b.price - a.price));
  //       break;
  //     case 'Recently Added':
  //       setNfts(sortedNfts.sort((a:any, b:any) => b.tokenId - a.tokenId));
  //       break;
  //     default:
  //       setNfts(nfts);
  //       break;
  //   }
  // }, [activeSelect]);

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

  const handleScroll = (direction: any) => {
    const { current }: {current: any} = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current }: {current: any} = scrollRef;
    // const { current: parent } = parentRef;
    let parent:any

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  // let nfts: any = [{
  //   image: "/creator9.png",
  //   i: 1,
  //   name: "cool do",
  //   price: "2 ETH",
  //   owner: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a",
  //   seller: "0x929a9c9b9d9e9f9a9c9d9a9e9b9a9d9c9b9e9a9d9c9b9e9a"
  // }]

  useEffect(() => {
    isScrollable();

    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  const topCreators = getCreators(nftsCopy);
  let nftImages: any = images 

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name="Own NFT's that generates true income, purchase wonderful artworks tied to passive or active income producing digital assets."
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-center"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Looks like the Marketplace is empty.</h1>
        ) : isLoading ? <Loader /> : (
          <>
            <div>
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                ⭐ Top Creators
              </h1>
              <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
                <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
                  {topCreators.map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImage={nftImages[`creator${i + 1}`]}
                      creatorName={shortenAddress(creator.seller)}
                      creatorEths={creator.sum}
                    />
                  ))}
                  {!hideButtons && (
                  <>
                    <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0">
                      <Image
                        src={images.left}
                        layout="fill"
                        objectFit="contain"
                        alt="left_arrow"
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                    <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0">
                      <Image
                        src={images.right}
                        layout="fill"
                        objectFit="contain"
                        alt="right_arrow"
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                  </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">🔥 Hot NFTs</h1>
                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                {nfts.map((nft: any) => <NFTCard key={nft.tokenId} nft={nft} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withTransition(Home);

