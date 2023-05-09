export function getQueryParameterValue({ param }: { param: string; }): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param) || ''
}

export function setQueryParameterValue({ param, value }: { param: string; value: string }): void {
  if (typeof window === 'undefined') {
    return
  }

  const url = new URL(window.location.href)
  url.searchParams.set(param, value)
  window.history.pushState({}, '', url.toString())
}
