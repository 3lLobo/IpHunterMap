import { createSlice } from '@reduxjs/toolkit'
// import { AppState } from './store'
import { HYDRATE } from 'next-redux-wrapper'
import avatarImage from '@/images/avatar.jpg'
import { StaticImageData } from 'next/image'

// Type for our state
export interface AuthState {
  authState: boolean
  userId: number | null
  avatar: StaticImageData | null
  jwt: string
}

// Initial state
const initialState: AuthState = {
  authState: false,
  userId: null,
  avatar: null,
  jwt: '',
}

// Actual Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      state.authState = state.authState ? false : true

      if (state.authState) {
        state.userId = 111
        // state.userId = action.payload.userId
        state.avatar = avatarImage
        state.jwt = process.env.NEXT_PUBLIC_AUTH_TOKEN
      }
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    // extraReducers: {
    //   [HYDRATE]: (state, action) => {
    //     return {
    //       ...state,
    //       ...action.payload.auth,
    //     }
    //   },
    // },
  },
})

export const { setAuthState } = authSlice.actions

// export const selectAuthState = (state: AppState) => state.auth.authState

export default authSlice.reducer
