import React from 'react'

interface LabelledInputProps {
  label: string
  placeholder?: string
  inputValue?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function LabelledInput({ label, placeholder, onChange, inputValue }: LabelledInputProps): JSX.Element {
  return (
    <div className='block'>
      <div>
        <label className='block mb-1' >
          {label}
        </label>
      </div>
      <div className='md:w-2/3'>
        <input className='input w-[20em]'
          id='inline-full-name'
          type='text'
          placeholder={placeholder}
          disabled={!!inputValue}
          value={inputValue}
          required={true}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
