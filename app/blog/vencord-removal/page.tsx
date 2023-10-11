'use client';

import Link from 'next/link';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Home = () => {

  return (
    <>
      <div className='flex flex-col gap-4 h-screen'>
        <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[69vh] max-h-[80vh] flex-wrap scrollbarStyle'> { /* this line and the line above allow the overflow content to be scrollable instead of just spilling out. i didn't make this easily reusable sorry. */}
          <h1>
            If you guys realized ReviewDB has been removed from Vencord, the reason for this is I had some discussion with Ven about adding own profile review deletion to ReviewDB,
            Ven wanted to add this feature to ReviewDB but I thought it would completely ruin the point of it and make it half meaningless.
            <span className='my-4 block'>
              As a result, Ven removed ReviewDB from Vencord with the reason &ldquo;harassment has gotten pretty bad&ldquo;
              (<a className='link' target='_blank' href='https://github.com/Vendicated/Vencord/commit/390987e4a9d58c4c0eb9d4f6b4101ecf1203ccba'>full commit description here</a>)
              <br />
              <br />
              For the record, we have <Link className='link' href='/dashbord/settings'>an opting out feature</Link> on ReviewDB which will disable reviews on your profile. Adding to that, I told Ven that if I were to add (I still don't support it) I would put a deleted indicator on reviews that were deleted by the profile owner just like WhatsApp, but he straight refused it.
              <br />
            </span>
            {
              // TODO: add markdown support
            }
            I am not writing this to cause some sort of drama or something, I just don't want people to think we let harassment on ReviewDB, for that we have a report system which we check regularly adding to that we let people opt out completely.
            <br />
            <br />

            If you still want to use ReviewDB you can use our version of Vencord called <a className='link' href='https://github.com/StupidityDB/VencordPlus'>Vencord+</a> which you can download <a className='link' href='https://github.com/StupidityDB/VencordPlusInstaller/releases/latest'>here</a>
            Or you can try <Link className='link' href='/download'>other client mods</Link>
          </h1>
        </div>
      </div>
    </>
  )
}

export default Home;
