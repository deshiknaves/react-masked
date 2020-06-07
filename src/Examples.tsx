import React, { useState } from 'react'
import { MaskedInput } from './components/MaskedInput/index'
import { Input } from './components/Input/index'
import { Check } from './Check'

import './Examples.css'
import { matchDate } from './custom'

const placeholderColor = '#c1c1c1'

const dateMatcher = matchDate('dd/mm/yyyy')

const yearFour = /^\d{1,2}\/\d{1,2}\/\d{4}$/
const yearTwo = /^\d{1,2}\/\d{1,2}\/\d{2}$/
const yearTwoPlaceholder = 'dd/mm/yy'
const yearFourPlaceholder = 'dd/mm/yyyy'
const yearTwoExample = '01/01/20'
const yearFourExample = '01/01/2002'

function App() {
  const [basicComplete, setBasicComplete] = useState(false)
  const [americanComplete, setAmericanComplete] = useState(false)
  const [britishComplete, setBritishComplete] = useState(false)
  const [britishVariableComplete, setBritishVariableComplete] = useState(false)
  const [britishVariable, setBritishVariable] = useState({
    mask: yearTwo,
    placeholder: yearTwoPlaceholder,
    example: yearTwoExample,
    length: 2,
  })

  return (
    <main className="app">
      <h1>ReactMasked Eamples</h1>
      <section>
        <h2>Basic</h2>
        <p>Just a basic regular expressions</p>
        <div className="field">
          <MaskedInput
            autoCharacters={['-']}
            mask={/^[a-zA-Z]{2}-\d{3}$/}
            validExample="AA-000"
            placeholder="AA-DDD"
            placeholderColor={placeholderColor}
            onChange={(_, complete) => setBasicComplete(complete)}
          >
            {maskedProps => <Input {...maskedProps} />}
          </MaskedInput>
          {basicComplete && <Check />}
        </div>
      </section>

      <section>
        <h2>Date American</h2>
        <p>
          Custom matcher to match a date <strong>mm/dd/yyyy</strong>
        </p>
        <div className="field">
          <MaskedInput
            autoCharacters={['/']}
            mask={/^\d{1,2}\/\d{1,2}\/\d{4}$/}
            validExample="01/01/2000"
            placeholder="mm/dd/yyyy"
            placeholderColor={placeholderColor}
            onMatch={matchDate('mm/dd/yyyy')}
            onChange={(_, complete) => setAmericanComplete(complete)}
          >
            {maskedProps => <Input {...maskedProps} />}
          </MaskedInput>
          {americanComplete && <Check />}
        </div>
      </section>

      <section>
        <h2>Date Everywhere else</h2>
        <p>
          Custom matcher to match a date <strong>dd/mm/yyyy</strong>
        </p>
        <div className="field">
          <MaskedInput
            autoCharacters={['/']}
            mask={/^\d{1,2}\/\d{1,2}\/\d{4}$/}
            validExample="01/01/2000"
            placeholder="dd/mm/yyyy"
            placeholderColor={placeholderColor}
            onMatch={dateMatcher}
            onChange={(_, complete) => setBritishComplete(complete)}
          >
            {maskedProps => <Input {...maskedProps} />}
          </MaskedInput>
          {britishComplete && <Check />}
        </div>
      </section>

      <section>
        <h2>2 or 4 digit year</h2>
        <p>
          Custom matcher to match a date with <strong>dd/mm/(yy|yyyy)</strong>
        </p>
        <div className="field">
          <MaskedInput
            autoCharacters={['/']}
            mask={britishVariable.mask}
            validExample={britishVariable.example}
            placeholder={britishVariable.placeholder}
            placeholderColor={placeholderColor}
            onMatch={values => {
              const length = values.value.length > 8 ? 4 : 2
              if (length === britishVariable.length) return dateMatcher(values)

              const four = length === 4
              const remaining = four
                ? yearFourExample.substring(values.value.length)
                : yearTwoExample.substring(values.value.length)
              const mask = four ? yearFour : yearTwo
              const match = dateMatcher({ ...values, mask, remaining })

              setBritishVariable({
                mask,
                placeholder: four ? yearFourPlaceholder : yearTwoPlaceholder,
                example: four ? yearFourExample : yearTwoExample,
                length,
              })

              return match
            }}
            onChange={(_, complete) => setBritishVariableComplete(complete)}
          >
            {maskedProps => <Input {...maskedProps} />}
          </MaskedInput>
          {britishVariableComplete && <Check />}
        </div>
      </section>
    </main>
  )
}

export default App
