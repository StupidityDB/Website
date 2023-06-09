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

  return (
    <>
      {
        (user) ? (<>
          <Dialog content={content} isOpen={isOpen} onClose={closeDialog} />

          <div className='flex flex-col gap-4 h-screen items-center'>
            <h1 className='headerText text-center mb-3'>
              ReviewDB Appeal Form
            </h1>

            <LabelledInput label='Why do you think you should be unbanned?' placeholder='Write a reason' onChange={(e) => setAppealText(e.target.value)} />
            <LabelledInput label='What is your Discord username?' inputValue={user?.username} />
            <LabelledInput label='What is your Discord ID?' inputValue={user?.discordID} />

            <button className='flex button justify-center items-center mt-auto w-1/3'
              title='Submit appeal'
              disabled={!user?.banInfo && user?.type !== -1}
              onClick={() => {
                openDialog(<ConfirmationModal title='Warning' message={(
                  <>
                    <h3>If you would like us to respond to your appeal, you must join our Discord server</h3>
                    <a className='link' href='/discord' target='_blank'>You can join here</a>
                  </>
                )} onConfirm={submitAppeal} onCancel={closeDialog} />)
              }}>
              Submit
            </button>

            {
              !user?.banInfo && user?.type !== -1 && (
                <h1 className='text-center block font-bold text-l text-red-500'>
                  To submit an appeal you need to be banned
                </h1>
              )
            }

            <div>
              <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[63vh] max-h-[65vh] flex-wrap scrollbarStyle'>
              </div>
            </div>
            <ToastContainer />
          </div>
        </>) : (
          <LoginFields />
        )
      }
    </>
  )
}

export default Home
