'use client'

import React from 'react'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Home = () => {

  return (
    <>
      <h1>
       If you guys realized reviewdb has been removed from vencord, The reason for that is I had some discussion with ven about adding own profile review deletion to reviewdb,
       ven wanted to add this feature to reviewdb but I thought it would completely ruin the point of it and make it half meaningless.
        <span className='my-4 block'>
          As a result ven removed reviewdb from Vencord with reason &ldquo;harrasment gotten pretty bad&ldquo;
          (<a className='italic text-blue-500' target='_blank' href='https://github.com/Vendicated/Vencord/commit/390987e4a9d58c4c0eb9d4f6b4101ecf1203ccba'>full commit description here</a>)
          <br/>
          <br/>
            For record we have opting out feature on reviewdb which will disable reviews on your profile, and adding to that I told to ven if I add (I still dont support it) I would put a deleted indicator to reviews that deleted by profile owner. Just like whatsap, But he straight refused it.
          <br/>
        </span>

        I am not writing this to cause some sort of drama or something, I just dont want people to think we let harrasment on reviewdb, for that we have a report system which we check regularly adding to that we let people opt out completely.
        <br/>
        <br/>
        {
          // TODO ADD A STUPID MARKDOWN THING
        }
        If you still want to use reviewdb on vencord you can get the plugin from our discord but that will require you to build vencord from source.
        Or you can use reviewdb in <a className='italic text-blue-500' target='_blank' href='/download'>other client mods</a>

      </h1>
    </>
  )
}

export default Home
