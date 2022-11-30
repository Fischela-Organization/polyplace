import { gql } from "@apollo/client";

export const fetchMyNft = gql`
  query getDigis {
    digis {
      id
      metadataURI
    }
  }
`;
