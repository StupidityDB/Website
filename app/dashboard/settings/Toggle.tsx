import React from 'react'
import { ToggleProps } from '@global/functions/interface'

const Toggle: React.FC<ToggleProps> = ({ checked = false, onChange, label, className }): JSX.Element => {
  const [isChecked, setIsChecked] = React.useState(checked)

  React.useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target?.checked ?? false
    setIsChecked(checked)
    if (onChange) {
      onChange(checked)
    }
  }

  return (
    <label className={`relative inline-flex items-center cursor-pointer group ${className ?? ''}`}>
      <input
        type='checkbox'
        className='sr-only peer'
        checked={isChecked}
        onChange={handleToggle}
      />
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out peer-focus-visible:ring-2 peer-focus-visible:ring-blurple/60 ${isChecked ? 'bg-blurple' : 'bg-surface-5'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 shadow transition-transform duration-200 ease-in-out ${isChecked ? 'translate-x-5' : 'translate-x-0'}`}
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
