import { useState, useEffect } from 'react'
import { getCookieItem } from '@global/functions/cookieUtils'

const useAdminState = (): number | undefined => {
  const [admin, setAdmin] = useState(undefined)

  useEffect(() => {
    setAdmin(JSON.parse(getCookieItem({ key: 'rdbUserInfo', defaultValue: '{}' })).type) as unknown as number
  }, [])

  return admin
}

export default useAdminState
