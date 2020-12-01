import React, {useEffect, useState, useRef} from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import {matchSorter} from 'match-sorter'

function SearchableDropdown({options, setResult, placeholder = 'Select...'}) {
  const [term, setTerm] = useState('')
  const containerRef = useRef(null)
  const [list, setList] = useState(options)

  const onKeyDown = event => {
    if (!event.isDefaultPrevented()) {
      const container = containerRef.current
      if (!container) return

      window.requestAnimationFrame(() => {
        const element = container.querySelector('[aria-selected=true]')

        if (element) {
          const top = element.offsetTop - container.scrollTop
          const bottom = (container.scrollTop + container.clientHeight) - (element.offsetTop + element.clientHeight)

          if (bottom < 0) container.scrollTop -= bottom
          if (top < 0) container.scrollTop += top
        }
      })
    }
  }

  const handleChange = event => {
    setTerm(event.target.value)
  }

  const onSelect = selection => {
    for(const option of options) {
      if(option.name === selection) {
        setResult(option.id)
        setTerm(null)
        break
      }
    }
  }

  useEffect(() => {
    if(term === '') {
      setList(options)
    }
    else {
      setList(matchSorter(options, term, {keys: ['name']}))
    }
  }, [term, options])

  return (
    <Combobox aria-labelledby='demo' openOnFocus onSelect={onSelect}>
      <ComboboxInput onKeyDown={onKeyDown} onChange={handleChange} placeholder={placeholder} selectOnClick />
      <ComboboxPopover>
        <ComboboxList ref={containerRef} style={{maxHeight: '400px', overflow: 'auto'}}>
          {list.map(option => <ComboboxOption value={option.name} key={option.id} />)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}

export default SearchableDropdown
