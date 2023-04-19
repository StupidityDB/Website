// localStorage.ts

interface SetLocalStorageItemParams {
  key: string;
  value: string;
}

interface GetLocalStorageItemParams {
  key: string;
  defaultValue?: any;
}

export function setLocalStorageItem({ key, value }: SetLocalStorageItemParams): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error(`Error setting localStorage item: ${error}`)
  }
}

export function getLocalStorageItem({ key, defaultValue = '' }: GetLocalStorageItemParams): any {
  try {
    // localStorage.removeItem(key)
    const storedValue = localStorage.getItem(key)
    return storedValue !== null ? storedValue : defaultValue
  } catch (error) {
    console.error(`Error getting localStorage item: ${error}`)
    return defaultValue
  }
}

export function clearLocalStorage({ fallback = '' }: { fallback: string }): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      localStorage.clear()
      if (localStorage.length === 0) {
        resolve(true)
      } else {
        localStorage.removeItem(fallback)
        console.log('Error clearing localStorage, cleared fallback instead')
        resolve(false)
      }
    } catch (error) {
      localStorage.removeItem(fallback)
      console.error(`Error clearing localStorage: ${error}`)
      reject(false)
    }
  });
}
