import { gql } from "@apollo/client";

export const fetchMyNft = gql`
  query getDigis($account: ID!) {
    digis(where: { ownerAddress: $account }) {
      id
      metadataURI
      title
      description
      worth
      ownerAddress {
        id
      }
    }
  }
`;

export const fetchDigiSales = gql`
  query getDigiSales {
    digiSales(where:{isOnSale: true}) {
      id
      isOnSale
      auctionId
      amount
      intergrityConfirmed
      digi {
        id
        title
        metadataURI
        isOnSale
        description
        worth
        ownerAddress {
          id
        }
        productAge
        monthlyExpenses
        monthlyRevenue
        monthlyTraffic
        location
        productLink
      }
    }
  }
`;

export const fetchMyDigiSales = gql`
  query getDigiSales($id: ID!) {
    digiSales(where: {isOnSale: true, digi_: { ownerAddress: $id } }) {
      id
      isOnSale
      auctionId
      digi {
        id
        title
        metadataURI
        isOnSale
        description
        worth
        ownerAddress {
          id
        }
      }
    }
  }
`;

export const fetchSingleDigi = gql`
  query digi($id: ID!) {
    digi(id: $id) {
      id
      title
      metadataURI
      isOnSale
      description
      worth
      ownerAddress {
        id
      }
      productAge
      monthlyExpenses
      monthlyRevenue
      monthlyTraffic
      location
      productLink
    }
  }
`;

export const fetchSingleDigiSale = gql`
  query digi($id: ID!) {
    digiSale(id: $id) {
      id
      isOnSale
      auctionId
      amount
      startTime
      endTime
      auctionResulted
      intergrityConfirmed
      digi {
        id
        title
        metadataURI
        isOnSale
        description
        worth
        ownerAddress {
          id
        }
        productAge
        monthlyExpenses
        monthlyRevenue
        monthlyTraffic
        location
        productLink
      }
    }
  }
`;
