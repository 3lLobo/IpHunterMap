import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  AnyAction,
  Store,
} from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { Context, createWrapper, HYDRATE } from 'next-redux-wrapper'
import { cortexApi } from './cortexApi'
import { geoApi } from './geoApi'

export interface State {
  tick: string
}

// create your reducer
const reducer = (state: State = { tick: 'init' }, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // Attention! This will overwrite client state! Real apps should use proper reconciliation.
      return { ...state, ...action.payload }
    case 'TICK':
      return { ...state, tick: action.payload }
    default:
      return state
  }
}

const combinedReducer = combineReducers({
  reducer,
  [authSlice.name]: authSlice.reducer,
  [cortexApi.reducerPath]: cortexApi.reducer,
  [geoApi.reducerPath]: geoApi.reducer,
})

export const makeStore = (context: Context) =>
  configureStore({
    reducer: combinedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([cortexApi.middleware, geoApi.middleware]),
    devTools: true,
  })

export type AppDispatch = Store['dispatch']
export type RootState = ReturnType<Store['getState']>
export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// export an assembled wrapper
export const wrapper = createWrapper<AppStore>(makeStore, { debug: true })
