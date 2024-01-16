import DownloadCard from '@global/components/DownloadCard'

const Download = (): JSX.Element => {
  return (
    <div className='flex flex-col gap-4 h-screen w-full'>
      <div className='flex flex-col'>
        <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[69vh] max-h-[80vh] flex-wrap scrollbarStyle justify-center'>
          <DownloadCard title='Twitter' description='ReviewDB for the social media platform X, formally known as Twitter' downloadLink='https://chrome.google.com/webstore/detail/reviewdb-twitter/kmgbgncbggoffjbefmnknffpofcajohj' icon_url='/logo.png' />
          <DownloadCard title='Vencord' description='Vencord is a desktop client mod with ReviewDB and many other plugins' downloadLink='https://github.com/StupidityDB/VencordPlusInstaller/releases/latest' icon_url='/platforms/vencord.png' />
          <DownloadCard title='Aliucord' description='Aliucord is a Discord client mod for Android and is based on the old java version' downloadLink='https://raw.githubusercontent.com/mantikafasi/AliucordPlugins/builds/ReviewDB.zip' websiteLink='https://aliucord.com' icon_url='/platforms/aliucord.png' />
          <DownloadCard title='Vendetta' description='Vendetta is a Discord client mod which supports both Android and iOS, and is based on the new app versions' websiteLink='https://github.com/vendetta-mod/Vendetta' downloadLink='https://beefers.github.io/strife/ReviewDB' icon_url='/platforms/vendetta.png' />
          <DownloadCard title='Enmity' description='Enmity is an iOS Discord client mod, with Android support coming soon' downloadLink='https://github.com/StupidityDB/EnmityPlugin' websiteLink='https://github.com/enmity-mod' icon_url='/platforms/enmity.png' />
          <DownloadCard title='BetterDiscord' description='It&apos;s not DevilBro plugin' downloadLink='https://github.com/mantikafasi/BetterDiscordPlugins/blob/main/Plugins/ReviewDB/ReviewDB.plugin.js' websiteLink='https://betterdiscord.app' icon_url='/platforms/betterdiscord.png' />
        </div>
      </div>
    </div>
  )
}

export default Download
