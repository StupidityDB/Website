import React from 'react'

interface LabelledInputProps {
  label: string
  placeholder?: string
  inputValue?: string
  multiline?: boolean
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function LabelledInput({ label, placeholder, onChange, inputValue, multiline }: LabelledInputProps): JSX.Element {
  return (
    <div className='flex flex-col gap-1.5 w-full'>
      <label className='text-sm gg-semibold text-slate-300'>
        {label}
      </label>
      {multiline ? (
        <textarea
          className='input resize-none min-h-[110px] scrollbarStyle'
          placeholder={placeholder}
          disabled={!!inputValue}
          value={inputValue}
          required={true}
          onChange={onChange}
        />
      ) : (
        <input
          className='input'
          type='text'
          placeholder={placeholder}
          disabled={!!inputValue}
          value={inputValue}
          required={true}
          onChange={onChange}
        />
      )}
    </div>
  )
}
