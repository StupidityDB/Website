import Cookies from 'js-cookie'
import { SetCookieItemParams, GetCookieItemParams } from '@global/functions/interface'

export function setCookieItem({ key, value }: SetCookieItemParams): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      Cookies.set(key, value, { secure: true, sameSite: 'strict', expires: 3 }) // expires in 3 days
      resolve('Item set successfully')
    } catch (error) {
      reject(new Error(`Error setting cookie item: ${error}`))
    }
  })
}

export function getCookieItem({ key, defaultValue = '' }: GetCookieItemParams): string {
  try {
    const storedValue = Cookies.get(key)
    return storedValue !== undefined ? storedValue : defaultValue
  } catch (error) {
    console.log(`Error getting cookie item: ${error}`)
    return defaultValue
  }
}

export function clearCookies(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      Cookies.remove('rdbToken')
      Cookies.remove('rdbUserInfo')
      resolve(true)
    } catch (error) {
      console.log(`Error clearing cookie: ${error}`)
      reject(false)
    }
  })
}
