export const getCreators = (nfts: any) => {
  const creators = nfts.reduce((creatorObject:any , nft: any) => {
    (creatorObject[nft.seller] = creatorObject[nft.seller] || []).push(nft);

    return creatorObject;
  }, {});

  return Object.entries(creators).map((creator: any) => {
    const seller: any = creator[0];
    const sum = creator[1].map((item: any) => Number(item.price)).reduce((prev: any, curr: any) => prev + curr, 0);

    return ({ seller, sum });
  });
};
