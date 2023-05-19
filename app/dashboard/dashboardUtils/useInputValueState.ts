import { InputValueState } from '@global/functions/interface'
import { getQueryParameterValue } from '@global/functions/paramUtils'
import { useEffect, useState } from 'react'

const useInputValueState = (isMounted: boolean): InputValueState => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!isMounted) return

    const query = getQueryParameterValue({ param: 'query' })
    if (query) {
      setInputValue(query)
    }
  }, [isMounted])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value.trim())
  }

  return { inputValue, handleChange }
}

export default useInputValueState
