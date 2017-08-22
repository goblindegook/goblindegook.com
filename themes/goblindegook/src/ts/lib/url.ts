type QueryVars = {
  [variable: string]: string
}

function parseSearch (): QueryVars {
  const queryString = window.location.search.substring(1)
  return queryString
    .split('&')
    .reduce((vars: QueryVars, pair: string) => {
      const [rawName, rawValue] = pair.split('=')
      const name = decodeURIComponent(rawName)
      const value = decodeURIComponent(rawValue)

      return {
        ...vars,
        [name]: value
      }
    }, {})
}

export function getSearchValue (name: string): string | undefined {
  const search = parseSearch()
  return search[name]
}
