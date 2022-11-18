import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGetObservablesQuery } from '@/api/cortexApi'
import { v4 } from 'uuid'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/* This hook sync the incoming data from the Hive with the backend and updates as the user interacts with the table.
The incoming data is fetched and transformed by the redux api.
This hook checks with the backend if there is already an entry for each observable and creates one or syncs it.
The backend then returns the same data augmented with the analystData.
This data together with a set hook for updating the analystData is returned.
@param: caseId
@param: userId
 */

export const useSyncData = (activeCase: any) => {
  const demoMode = process.env.NEXT_PUBLIC_FRONT_ONLY === 'true'
  const authStore = useSelector((state: any) => state.auth)
  const {
    data: observables,
    isLoading,
    isError,
  } = useGetObservablesQuery(
    activeCase
      ? {
        caseId: activeCase.caseId,
      }
      : skipToken
  )

  const [tableData, setTableData] = useState<any>([])

  // Trigger Sync once the observables are fetched.
  useEffect(() => {
    if (observables && !isError && !demoMode) {
      console.log('Send Batch!!!')
    } else {
      console.log('Demo Mode')
    }
  }, [observables, isError, authStore.jwt, demoMode])

  // UseEffect to extract the hunterIds from the post response.
  useEffect(() => {
    if (!demoMode) {
      setTableData(() => { }
      )
    } else if (observables && demoMode) {
      setTableData(observables.map((o: any) => {
        return { ...o, ...tableTransform(o) }
      }))
    }
  }, [observables, demoMode])

  return { tableData, isError }
}

// Transform an observable to a table row format with the cols IP, rDNS, AbuseIp, VT, RisqIq and MISp.
function tableTransform(observable: any): TableData {
  return {
    ip: observable?.cti?.countryCode || '',
  }
}

type TableData = any
