import { countryCodes } from '@/constants/shodan'
import { findObject } from '@/lib/deepSearch'
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import { AxiosRequestConfig, AxiosError } from 'axios'
import { transformCase } from '../lib/cortexTransform'
import MockCase from '@/mock/thehiveCase.json'
import MockQuery1 from '@/mock/theHiveQuery1.json'
import MockQuery2 from '@/mock/theHiveQuery2.json'

interface AxiosBaseQueryInput {
  url: string
  method: AxiosRequestConfig['method'] // GET, POST
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
}

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<AxiosBaseQueryInput, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    // if demo mode is on, simply return the saved responses.
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      const urlEnding = url.split('/').pop()
      let resData = []
      if (urlEnding === 'case') {
        // TODO: fix the mock data
        resData = MockCase
      } else if (urlEnding === 'query') {
        const queryId = data.idOrName
        if (queryId === '1') {
          resData = MockQuery1
        } else if (queryId === '2') {
          resData = MockQuery2
        }
      }
      return { data: resData }
    }
  }

/* Api to interact with the Cortex server on localhost:9000
 */
export const cortexApi = createApi({
  reducerPath: 'cortexApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/thehive',
    // baseUrl: 'http:///127.0.0.1:9000',
  }),
  endpoints: (builder) => ({
    /* This endpoint gets all available cases from the Hive.
     */
    getCases: builder.query({
      query: (): AxiosBaseQueryInput => {
        return {
          url: '/api/case',
          method: 'get',
        }
      },
      transformResponse(data, meta, arg) {
        return data
      },
    }),
    /* This endpoint gets all observables for a cases in the Hive.
     */
    getObservables: builder.query({
      query: ({ caseId }): AxiosBaseQueryInput => {
        return {
          url: '/api/query',
          method: 'post',
          data: { idOrName: `${caseId}` },
        }
      },
      transformResponse(baseQueryReturnValue: Array<any>, meta, arg) {
        const userId = 111
        // sort descending for creation date and parse the location tag
        let data = transformCase(baseQueryReturnValue, arg.caseId, userId)
        return data
      },
    }),
  }),
})

export const { useGetCasesQuery, useGetObservablesQuery } = cortexApi
