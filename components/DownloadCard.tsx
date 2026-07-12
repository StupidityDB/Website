import React from 'react'
import Image from 'next/image'
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa'

interface DownloadCardProps {
  title: string
  description: string
  downloadLink: string
  websiteLink?: string
  icon_url: string
}

export default function DownloadCard({ title, description, downloadLink, websiteLink, icon_url }: DownloadCardProps): JSX.Element {
  return (
    <div className='card flex flex-col p-5 hover:border-blurple/40 transition-colors'>
      <div className='flex items-center gap-4'>
        <Image className='w-14 h-14 rounded-xl shadow-lg flex-shrink-0' src={icon_url} width={112} height={112} alt={title + ' icon'} />
        <div className='flex flex-col min-w-0'>
          <h2 className='text-lg gg-semibold text-white truncate'>{title}</h2>
          {websiteLink && (
            <a href={websiteLink} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors gg-normal'>
              Visit website
              <FaExternalLinkAlt size={9} />
            </a>
          )}
        </div>
      </div>

      <p className='text-sm text-slate-400 gg-normal leading-relaxed mt-3 flex-grow'>{description}</p>

      <a href={downloadLink} target='_blank' rel='noopener noreferrer' className='button text-sm mt-4 w-full'>
        <FaDownload size={12} />
        Download ReviewDB
      </a>
    </div>
  )
}
