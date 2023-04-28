import { setLocalStorageItem } from '@global/functions/localStorage'
import { getRdbUser, isAdmin } from '@global/functions/RDBAPI'

import React from 'react'
import { BsKey } from 'react-icons/bs'
import { MdLogin } from 'react-icons/md'

const LoginFields: React.FC = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  const handleClick = async (): Promise<void> => {
    const token = inputValue as string | null

    if (token) {
      getRdbUser({ token: token }).then((res) => {
        if (res) {
          setLocalStorageItem({ key: 'rdbToken', value: token })
          isAdmin({ currentDiscordID: res?.discordID }).then((adminRes) => {
            setLocalStorageItem({
              key: 'rdbUserInfo', value: JSON.stringify({
                ...res,
                admin: adminRes === true ? true : false
              })
            })
          }).then(() => {
            location.reload()
          }).catch((err: Error) => {
            console.log(err)
          })
        } else {
          alert('Invalid token!')
        }
      }).catch((err: Error) => {
        console.log(err)
      })
    }
  }

  return (
    <div className='flex flex-col justify-center items-center gap-4 h-screen'>
      <h1 className='headerText !text-4xl'>ReviewDB</h1>
      <div className='flex flex-col items-center gap-4'>
        <input className='input' onChange={handleChange} type='password' placeholder='ReviewDB Token' />
        <div className='flex w-full justify-center items-center gap-2'>
          <a href='https://discord.com/api/v9/oauth2/authorize?client_id=915703782174752809&response_type=code&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&scope=identify' target='_blank' className='loginButton px-3'><BsKey /> Get Token</a>
          <button className='loginButton px-5' onClick={handleClick}><MdLogin /> Login</button>
        </div>
      </div>
    </div>
  )
}

export default LoginFields
