interface QueryVars {
  [variable: string]: string
}

export function parseQueryString(): QueryVars {
  const queryString = window.location.search.substring(1)
  return queryString.split('&').reduce((vars: QueryVars, pair: string) => {
    const [rawName, rawValue] = pair.split('=')
    const name = decodeURIComponent(rawName)
    const value = decodeURIComponent(rawValue)

    return {
      ...vars,
      [name]: value
    }
  }, {})
}
