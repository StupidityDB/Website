import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { handleClick } from '@global/app/dashboard/dashboardUtils/handleClick'
import useAdminState from '@global/app/dashboard/dashboardUtils/useAdminState'
import { getCookieItem } from '@global/functions/cookieUtils'

const Dashboard: React.FC = (): JSX.Element => {
  const admin = useAdminState()
  const [reviews, setReviews] = React.useState<JSX.Element[]>([])
  const inputValue = JSON.parse(getCookieItem({ key: 'rdbUserInfo', defaultValue: '{}' })).discordID

  React.useEffect(() => {
    if (admin) {
      handleClick({
        admin,
        inputValue,
        setReviews
      })
    }
  }, [admin])

  return (
    <div className='flex flex-col gap-4 h-screen'>
      <div>
        <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[69vh] max-h-[80vh] flex-wrap scrollbarStyle'>
          {reviews}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Dashboard
