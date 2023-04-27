import { SetLocalStorageItemParams, GetLocalStorageItemParams } from '@global/functions/interface'

export function setLocalStorageItem({ key, value }: SetLocalStorageItemParams): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, value)
    } catch (error) {
      console.error(`Error setting localStorage item: ${error}`)
    }
  }
}

export function getLocalStorageItem({ key, defaultValue = '' }: GetLocalStorageItemParams): string {
  if (typeof window !== 'undefined') {
    try {
      const storedValue = window.localStorage.getItem(key) as string
      return storedValue !== null ? storedValue : defaultValue
    } catch (error) {
      console.error(`Error getting localStorage item: ${error}`)
      return defaultValue
    }
  } else {
    return defaultValue
  }
}

export function clearLocalStorage({ fallback = '' }: { fallback: string }): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.clear()
        if (window.localStorage.length === 0) {
          resolve(true)
        } else {
          window.localStorage.removeItem(fallback)
          console.log('Error clearing localStorage, cleared fallback instead')
          resolve(false)
        }
      } catch (error) {
        window.localStorage.removeItem(fallback)
        console.error(`Error clearing localStorage: ${error}`)
        reject(false)
      }
    } else {
      reject(false)
    }
  })
}
