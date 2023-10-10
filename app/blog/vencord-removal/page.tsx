'use client'

import Link from 'next/link'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Home = () => {

  return (
    <>

      <div className='flex flex-col gap-4 h-screen'>
        <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[69vh] max-h-[80vh] flex-wrap scrollbarStyle'> { /* this line and the line above allow the overflow content to be scrollable instead of just spilling out. i didn't make this easily reusable sorry. */}
          <h1>
            If you guys realized reviewdb has been removed from vencord, The reason for that is I had some discussion with ven about adding own profile review deletion to reviewdb,
            ven wanted to add this feature to reviewdb but I thought it would completely ruin the point of it and make it half meaningless.
            <span className='my-4 block'>
              As a result ven removed reviewdb from Vencord with reason &ldquo;harrasment gotten pretty bad&ldquo;
              (<a className='link' target='_blank' href='https://github.com/Vendicated/Vencord/commit/390987e4a9d58c4c0eb9d4f6b4101ecf1203ccba'>full commit description here</a>)
              <br />
              <br />
              For record we have opting out feature on reviewdb which will disable reviews on your profile, and adding to that I told to ven if I add (I still dont support it) I would put a deleted indicator to reviews that deleted by profile owner. Just like whatsap, But he straight refused it.
              <br />
            </span>
            {
              // TODO: add markdown support
            }
            I am not writing this to cause some sort of drama or something, I just dont want people to think we let harrasment on reviewdb, for that we have a report system which we check regularly adding to that we let people opt out completely.
            <br />
            <br />
            {
              // TODO ADD A STUPID MARKDOWN THING
            }
            If you still want to use reviewdb you can use our version of Vencord called <Link className='link' href='https://github.com/StupidityDB/VencordPlus'>Vencord+</Link> which you can download from <Link className='link' href='https://github.com/StupidityDB/VencordPlusInstaller/releases/latest'>here</Link>
            Or you can try <Link className='link' href='/download'>other client mods</Link>

          </h1>
        </div>
      </div>
    </>
  )
}

export default Home
