import DownloadCard from '@global/components/DownloadCard'

const platforms = [
  { title: 'Twitter', description: 'ReviewDB for the social media platform X, formally known as Twitter', downloadLink: 'https://chrome.google.com/webstore/detail/reviewdb-twitter/kmgbgncbggoffjbefmnknffpofcajohj', icon_url: '/logo.png' },
  { title: 'Vencord', description: 'Vencord is a desktop client mod with ReviewDB and many other plugins', downloadLink: 'https://vencord.dev/download/', icon_url: '/platforms/vencord.png' },
  { title: 'Aliucord', description: 'Aliucord is a Discord client mod for Android and is based on the old java version', downloadLink: 'https://raw.githubusercontent.com/mantikafasi/AliucordPlugins/builds/ReviewDB.zip', websiteLink: 'https://aliucord.com', icon_url: '/platforms/aliucord.png' },
  { title: 'Vendetta', description: 'Vendetta is a Discord client mod which supports both Android and iOS, and is based on the new app versions', websiteLink: 'https://github.com/vendetta-mod/Vendetta', downloadLink: 'https://janisslsm.github.io/vdplugins/ReviewDB/', icon_url: '/platforms/vendetta.png' },
  { title: 'Enmity', description: 'Enmity is an iOS Discord client mod, with Android support coming soon', downloadLink: 'https://github.com/StupidityDB/EnmityPlugin', websiteLink: 'https://github.com/enmity-mod', icon_url: '/platforms/enmity.png' },
  { title: 'BetterDiscord', description: 'It\'s not DevilBro plugin', downloadLink: 'https://github.com/mantikafasi/BetterDiscordPlugins/blob/main/Plugins/ReviewDB/ReviewDB.plugin.js', websiteLink: 'https://betterdiscord.app', icon_url: '/platforms/betterdiscord.png' },
]

const Download = (): JSX.Element => {
  return (
    <div className='flex flex-col gap-6 w-full'>
      <div className='flex flex-col gap-1.5'>
        <h1 className='text-2xl sm:text-3xl gg-bold text-white'>Download ReviewDB</h1>
        <p className='text-sm sm:text-base text-slate-400 gg-normal'>ReviewDB is available as a plugin for most Discord client mods.</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-2'>
        {platforms.map((platform) => (
          <DownloadCard key={platform.title} {...platform} />
        ))}
      </div>
    </div>
  )
}

export default Download
