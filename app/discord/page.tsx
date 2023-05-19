import Script from 'next/script'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Home = () => {
  return (
    <>
      <Script id="redirect-script" dangerouslySetInnerHTML={{
        __html: `
        window.location.href = "https://discord.com/invite/S5VTuhTgtp/";
      `
      }} />
      <div className='flex flex-col justify-center items-center gap-4 h-screen'>
        <h1 className='headerText !text-4xl'>ReviewDB</h1>
        <div className='flex flex-col items-center gap-4'>
          <h2 className='gg-semibold'>Redirecting to our Discord...</h2>
        </div>
      </div>
    </>
  )
}

export default Home
