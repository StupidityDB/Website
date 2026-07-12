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
      <div className='flex-1 flex flex-col justify-center items-center gap-3 text-center py-12'>
        <h1 className='text-4xl gg-bold text-transparent bg-clip-text bg-gradient-to-r from-blurple via-sky-400 to-blurple'>ReviewDB</h1>
        <h2 className='gg-semibold text-slate-300'>Redirecting to our Discord…</h2>
      </div>
    </>
  )
}

export default Home
