import React from 'react'

interface LabelledInputProps {
  label: string
  placeholder?: string
  inputValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function LabelledInput({ label, placeholder, onChange, inputValue = '' }: LabelledInputProps) {
  return (
    <div className='block'>
      <div className="">
        <label className="block mb-1" >
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <input className="input md:w-[20em] w-full"
          id="inline-full-name"
          type="text"
          placeholder={placeholder}
          value={inputValue ?? ''}
          disabled={!!inputValue}
          required={true}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
