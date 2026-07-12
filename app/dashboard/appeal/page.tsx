'use client'

import LoginFields from '@global/app/dashboard/LoginFields'
import ConfirmationModal from '@global/app/modals/ConfirmationModal'
import { Dialog, useDialog } from '@global/components/Dialog'
import LabelledInput from '@global/components/LabelledInput'
import { submitRDBAppeal } from '@global/functions/RDBAPI'
import { getCookieItem } from '@global/functions/cookieUtils'
import { GetUser } from '@global/functions/interface'
import { notify } from '@global/functions/showToast'
import React from 'react'
import { ToastContainer } from 'react-toastify'

const Home = (): JSX.Element => {
  const user = JSON.parse(getCookieItem({ key: 'rdbUserInfo', defaultValue: null })) as GetUser | null
  const { isOpen, content, openDialog, closeDialog } = useDialog()
  const token = getCookieItem({ key: 'rdbToken', defaultValue: null }) as string | null
  const [appealText, setAppealText] = React.useState('')

  const isBanned = !!user?.banInfo || user?.type === -1

  const submitAppeal = (): void => {
    if (!token) {
      notify({ type: 'error', message: 'You need to be logged in to submit an appeal' })
    } else {
      submitRDBAppeal({ token: token, appealText: appealText }).then((res) => {
        if (res.status === 200) {
          notify({ type: 'success', message: 'Appeal submitted successfully' })
        } else {
          notify({ type: 'error', message: 'Error submitting appeal' })
        }
      })
      closeDialog()
    }
  }

  if (!user) {
    return <LoginFields />
  }

  return (
    <>
      <Dialog content={content} isOpen={isOpen} onClose={closeDialog} />

      <div className='flex flex-col gap-6 w-full max-w-2xl mx-auto'>
        <div className='flex flex-col gap-1.5'>
          <h1 className='text-2xl sm:text-3xl gg-bold text-white'>Appeal Ban</h1>
          <p className='text-sm sm:text-base text-slate-400 gg-normal'>Banned from ReviewDB? Tell us why we should reconsider.</p>
        </div>

        {!isBanned && (
          <div className='flex items-center gap-3 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 px-4 py-3 text-sm gg-normal'>
            To submit an appeal you need to be banned — your account is in good standing.
          </div>
        )}

        <div className='card flex flex-col gap-5 p-5 sm:p-6'>
          <LabelledInput multiline label='Why do you think you should be unbanned?' placeholder='Write a reason' onChange={(e) => setAppealText(e.target.value)} />
          <LabelledInput label='Your Discord username' inputValue={user?.username} />
          <LabelledInput label='Your Discord ID' inputValue={user?.discordID} />

          <button className='button self-end'
            title='Submit appeal'
            disabled={!isBanned}
            onClick={() => {
              openDialog(<ConfirmationModal title='Warning' message={(
                <>
                  <p>If you would like us to respond to your appeal, you must join our Discord server.</p>
                  <a className='link' href='/discord' target='_blank'>You can join here</a>
                </>
              )} onConfirm={submitAppeal} onCancel={closeDialog} />)
            }}>
            Submit Appeal
          </button>
        </div>

        <ToastContainer />
      </div>
    </>
  )
}

export default Home
