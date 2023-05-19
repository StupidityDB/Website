import { GetUser } from '@global/functions/interface'
import { setCookieItem } from '@global/functions/cookieUtils'
import { getRdbUser } from '@global/functions/RDBAPI'
import { notify } from '@global/functions/showToast'

import React from 'react'
import { BsKey } from 'react-icons/bs'
import { MdLogin } from 'react-icons/md'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginFields: React.FC = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  const handleClick = async (): Promise<void> => {
    const token = inputValue as string | null

    if (token) {
      getRdbUser({ token: token }).then((res: GetUser) => {
        if (res) {
          notify({ message: 'Successfully logged in! Please wait...', type: 'success' })
          setCookieItem({ key: 'rdbToken', value: token })
          setCookieItem({ key: 'rdbUserInfo', value: JSON.stringify(res) }).then(() => {
            setTimeout(() => location.reload(), 1000)
          }).catch((err: Error) => {
            notify({ message: err.message, type: 'error' })
          })
        } else {
          notify({ message: 'Invalid token!', type: 'error' })
        }
      }).catch((err: Error) => {
        notify({ message: err.message, type: 'error' })
      })
    }
  }

  return (
    <div className='flex flex-col justify-center items-center gap-4 h-screen'>
      <h1 className='headerText !text-4xl'>ReviewDB</h1>
      <div className='flex flex-col items-center gap-4'>
        <input className='input' onChange={handleChange} type='password' placeholder='ReviewDB Token' />
        <div className='flex w-full justify-center items-center gap-2'>
          <a href='https://discord.com/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2Fapi%2Freviewdb%2Fauth&response_type=code&scope=identify' target='_blank' className='loginButton px-3'><BsKey /> Get Token</a>
          <button className='loginButton px-5' onClick={handleClick}><MdLogin /> Login</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default LoginFields
