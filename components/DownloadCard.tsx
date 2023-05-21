import React from 'react'
import Image from 'next/image'

interface DownloadCardProps {
  title: string
  description: string
  downloadLink: string
  websiteLink?: string
  icon_url: string
}

export default function DownloadCard({ title, description, downloadLink, websiteLink, icon_url }: DownloadCardProps): JSX.Element {
  return (
    <div className='w-full max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700 p-4 flex flex-col'>
      <div className='flex-grow flex flex-col items-center'>
        <Image className='w-24 h-24 mb-3 rounded-full shadow-lg' src={icon_url} width={200} height={200} alt={title + ' image'} />
        <h5 className='mb-1 text-xl font-medium text-white'>{title}</h5>
        <span className='text-sm text-gray-400 text-center'>{description}</span>
      </div>
      <div className='flex justify-center mt-4 space-x-3 md:mt-6'>
        {
          websiteLink && <a href={websiteLink} className='inline-flex items-center px-4 py-2 text-sm font-medium text-center border rounded-lg focus:ring-4 focus:outline-none bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700 focus:ring-gray-700'>{title} Website</a>
        }
        <a href={downloadLink} className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'>Download ReviewDB</a>
      </div>
    </div>
  )
}
