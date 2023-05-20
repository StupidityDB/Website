'use client'

import ConfirmationModal from '@global/app/modals/ConfirmationModal'
import { Dialog, useDialog } from '@global/components/Dialog'
import DownloadCard from '@global/components/DownloadCard'
import LabelledInput from '@global/components/LabelledInput'
import { getCookieItem } from '@global/functions/cookieUtils'
import { GetUser } from '@global/functions/interface'
import { submitRDBAppeal } from '@global/functions/RDBAPI'
import { notify } from '@global/functions/showToast'
import React from 'react'
import { ToastContainer } from 'react-toastify'

const Download = (): JSX.Element => {
  const { isOpen, content, openDialog, closeDialog } = useDialog()
  return (
    <>
      <Dialog content={content} isOpen={isOpen} onClose={closeDialog} />

      <div className='flex flex-col gap-4 h-screen items-center'>

        <h1 className='text-center block font-bold text-xl mb-3'>
          ReviewDB Downloads
        </h1>

        <div className='grid lg:grid-cols-3 lg:grid-rows-3 gap-4 md:grid-cols-1 md:grid-rows-1' >
          <DownloadCard title='Vencord' description='Vencord is desktop client mod with ReviewDB integrated to it' downloadLink='https://vencord.dev/download/' websiteLink='https://vencord.dev' icon_url='https://avatars.githubusercontent.com/u/113042587?s=200&v=4'/>
          <DownloadCard title='Aliucord' description='Aliucord is discord android client mod which is based on old java version' downloadLink='https://raw.githubusercontent.com/mantikafasi/AliucordPlugins/builds/ReviewDB.zip' websiteLink='https://aliucord.com' icon_url='https://avatars.githubusercontent.com/u/78881422?s=200&v=4'/>
          <DownloadCard title='Vendetta' description='Vendetta is mobile discord client mod which can work on both android and IOS,and its based on new discord app' websiteLink='https://github.com/vendetta-mod/Vendetta' downloadLink='https://beefers.github.io/strife/ReviewDB' icon_url='https://avatars.githubusercontent.com/u/112445065?s=200&v=4'/>
          <DownloadCard title='Enmity' description='Enmity is IOS discord client mod with lots of plugins' downloadLink='https://github.com/StupidityDB/EnmityPlugin' websiteLink='https://github.com/enmity-mod' icon_url='https://avatars.githubusercontent.com/u/101209876?s=200&v=4'/>
          <DownloadCard title='Betterdiscord' description='Its not devilbro plugin' downloadLink='https://github.com/mantikafasi/BetterDiscordPlugins/blob/main/Plugins/ReviewDB/ReviewDB.plugin.js' websiteLink='https://betterdiscord.app' icon_url='https://avatars.githubusercontent.com/u/72631062?s=200&v=4'/>
        </div>


        <div>
          <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[63vh] max-h-[65vh] flex-wrap scrollbarStyle'>
          </div>
        </div>
        <ToastContainer />
      </div>

    </>
  )
}

export default Download
