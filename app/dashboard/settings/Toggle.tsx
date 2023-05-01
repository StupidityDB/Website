import React from 'react'
import { ToggleProps } from '@global/functions/interface'

const Toggle: React.FC<ToggleProps> = ({ checked = false, onChange, label, className }): JSX.Element => {
  const [isChecked, setIsChecked] = React.useState(checked)

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target?.checked ?? false
    setIsChecked(checked)
    if (onChange) {
      onChange(checked)
    }
  }

  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type='checkbox'
        className='sr-only'
        checked={isChecked}
        onChange={handleToggle}
      />
      <div
        className={`w-11 h-6 rounded-full transition-all duration-200 ease-in-out ${isChecked ? 'bg-green-500' : 'bg-red-500'}`}
      >
        <span
          className={`absolute top-0.5 left-[2px] bg-white border-gray-600 border rounded-full h-5 w-5 transition-all duration-200 ease-in-out transform ${isChecked ? 'translate-x-full' : 'translate-x-0'}`}
        ></span>
      </div>
      {label && (
        <span className='ml-3 text-sm gg-normal text-slate-100'>
          {label}
        </span>
      )}
    </label>
  )
}

export default Toggle
