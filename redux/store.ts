import { configureStore } from '@reduxjs/toolkit'
import nftReducer from './reducers/nftReducer'

export const store = configureStore({
  reducer: {
    nft: nftReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch