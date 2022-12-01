import { createSlice } from "@reduxjs/toolkit"

let initialState = {
    isOnsale: false,
    isNftOwner: false,
    nftPrice: 0
}

const nftReducer = createSlice({
    name: 'nft',
    initialState,
    reducers: {
      setIsOnSale(state, action) {
        state.isNftOwner = action.payload.isNftOwner
      },
      setNftPrice(state, action) {
        state.isNftOwner = action.payload.isNftOwner
      },

      setNFtOwner(state, action) {
        state.isNftOwner = action.payload.isNftOwner
      },
    },
  })

  export default nftReducer.reducer
  export const {setIsOnSale, } = nftReducer.actions