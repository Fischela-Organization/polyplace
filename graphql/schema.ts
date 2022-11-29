import {gql} from '@apollo/client'


export const fetchMyNft = gql`
{
    podcasts(first: 15, where: { ownerAddress_: { id: "${account}" },metadataURI_not:null }) {
        id
        metadataURI
        baseURI
        ownerAddress {
            id
        }
        created
    }
}
`;