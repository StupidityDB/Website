'use client'

import Link from 'next/link'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Home = () => {

  return (
    <article className='flex flex-col gap-5 w-full max-w-2xl mx-auto pb-4'>
      <h1 className='text-2xl sm:text-3xl gg-bold text-white'>Why ReviewDB was removed from Vencord</h1>

      <div className='flex flex-col gap-4 text-slate-300 gg-normal leading-relaxed'>
        <p>
          If you guys realized ReviewDB has been removed from Vencord, the reason for this is I had some discussion with Ven about adding own profile review deletion to ReviewDB.
          Ven wanted to add this feature to ReviewDB but I thought it would completely ruin the point of it and make it half meaningless.
        </p>

        <p>
          As a result, Ven removed ReviewDB from Vencord with the reason &ldquo;harassment has gotten pretty bad&ldquo;
          (<a className='link' target='_blank' href='https://github.com/Vendicated/Vencord/commit/390987e4a9d58c4c0eb9d4f6b4101ecf1203ccba'>full commit description here</a>).
        </p>

        <p>
          For the record, we have <Link className='link' href='/dashboard/settings'>an opting out feature</Link> on ReviewDB which will disable reviews on your profile.
          Adding to that, I told Ven that if I were to add it (I still don&apos;t support it) I would put a deleted indicator on reviews that were deleted by the profile owner just like WhatsApp, but he straight refused it.
        </p>

        <p>
          I am not writing this to cause some sort of drama or something, I just don&apos;t want people to think we let harassment on ReviewDB.
          For that we have a report system which we check regularly, adding to that we let people opt out completely.
        </p>

        <p>
          If you still want to use ReviewDB you can use our version of Vencord called <a className='link' href='https://github.com/StupidityDB/VencordPlus'>Vencord+</a> which
          you can download <a className='link' href='https://github.com/StupidityDB/VencordPlusInstaller/releases/latest'>here</a>,
          or you can try <Link className='link' href='/download'>other client mods</Link>.
        </p>
      </div>
    </article>
  )
}

export default Home
