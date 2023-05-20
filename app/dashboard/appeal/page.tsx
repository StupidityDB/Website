'use client'

import ConfirmationModal from '@global/app/modals/ConfirmationModal'
import { Dialog, useDialog } from '@global/components/Dialog'
import LabelledInput from '@global/components/LabelledInput'
import { getCookieItem } from '@global/functions/cookieUtils'
import { GetUser } from '@global/functions/interface'
import { submitRDBAppeal } from '@global/functions/RDBAPI'
import { notify } from '@global/functions/showToast'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import LoginFields from '../LoginFields'

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

            <h1 className='text-center block font-bold text-xl mb-3'>
              ReviewDB Appeal Form
            </h1>

            <LabelledInput label='Why do you think you should be unbanned?' placeholder='Write a reason' onChange={(e) => setAppealText(e.target.textContent ?? '')} />
            <LabelledInput label='What is your discord username?' inputValue={user?.username} />
            <LabelledInput label='What is your Discord ID?' inputValue={user?.discordID} />


            <button className='flex button justify-center items-center mt-auto w-1/3'
              title='Submit appeal'
              disabled={!user?.banInfo && user?.type !== -1}
              onClick={() => {
                openDialog(<ConfirmationModal title='Warning' message={(
                  <>
                    <h3>To get response to your appeal you need to join our support discord server</h3>
                    <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="https://discord.gg/eWPBSbvznt" target="_blank">You can join here</a>
                  </>
                )} onConfirm={submitAppeal} onCancel={closeDialog} />)
              }}>
              Submit
            </button>

            {
              !user?.banInfo && user?.type !== -1 && (
                <h1 className='text-center block font-bold text-l  text-red-500'>
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
