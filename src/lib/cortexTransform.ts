import { countryCodes } from '@/constants/shodan'
import { findObject } from '@/lib/deepSearch'
import { Obj } from 'reselect/es/types'
// --resolveJsonModule
import * as analyzerNameMap from '@/constants/analyzerNameMap.json'

// Transform the response from the Hive to our data structure.
export function transformCase(
  data: Array<any>,
  caseId: number,
  userId: number
): Array<any> {
  let strucData = data
    // Filter for ips only.
    .filter((obs) => {
      return obs.dataType === 'ip'
    })
    .map((obs) => {
      const { hiveId, type, data } = getBaseInfo(obs)
      const location = getLocation(obs)
      const countryCode = getCountryCode(location)
      const cti = getCti(obs)
      return { hiveId, caseId, type, data, cti }
    })

  return strucData
}

// Compose the CTI field for the observable.
function getCti(obs: Obj<any>): any {
  const analyzers = getAnalyzer(obs.reports)
  const location = getLocation(obs)
  const countryCode = getCountryCode(location)
  return { analyzers, countryCode }
}

// Extract information per analyzer in unified format.
function getAnalyzer(reports: Obj<any>): any[] {
  let analyzers: any[] = []

  for (const [key, value] of Object.entries(reports)) {
    if (Object.keys(analyzerNameMap).includes(key)) {
      const reportData = value.taxonomies[0]
      const analyzer = {
        analyzer: analyzerNameMap[key],
        label: reportData.level,
        value: Number.parseInt(reportData.value),
        malicious: isMalicious(reportData),
      }
      analyzers.push(analyzer)
    }
  }
  return analyzers
}

// Checks if the report data indicates malicious behaviour.
function isMalicious(reportData: Obj<any>): boolean {
  const safeList = ['safe', 'info']
  const { level, value } = reportData
  if (safeList.includes(level)) {
    return false
  } else {
    return true
  }
}

// extract the id, creation date, type and data per observable.
function getBaseInfo(obs: Obj<any>): Obj<any> {
  const { _id: hiveId, startDate, dataType: type, data } = obs
  return { hiveId, startDate, type, data }
}

function getLocation(obs: any) {
  let geoTax = findObject(obs, 'predicate', 'Location')
  const location = geoTax
    .filter((geo) => {
      if (geo.namespace === 'Shodan') {
        return geo
      }
    })
    .map((geo) => geo.value)[0]
  return location
}

function getCountryCode(location: string) {
  const countryCode = location
    ? countryCodes[location.split(' ').join('')]?.toLowerCase()
    : null
  return countryCode
}
