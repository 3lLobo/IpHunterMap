import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import { AxiosRequestConfig, AxiosError } from 'axios'

interface AxiosBaseQueryInput {
  url: string
  method: AxiosRequestConfig['method'] // GET, POST
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  jwt?: string
}

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<AxiosBaseQueryInput, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params: {
          ...params,
        },
        headers: {
          apikey: `${process.env.NEXT_PUBLIC_APILAYER_KEY}`,
        },
      })
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

/* Api to fetch geo data for IP addresses.
 */
export const geoApi = createApi({
  reducerPath: 'geoApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://api.apilayer.com',
  }),
  endpoints: (builder) => ({
    getGeo: builder.query({
      query: ({ ip }: { ip: string; jwt: string }) => {
        return {
          url: `/ip_to_location/${ip}`,
          method: 'get',
        }
      },
    }),
  }),
})

export const { useGetGeoQuery } = geoApi
