import React, { useState } from 'react'
import { MaskedInput } from './components/MaskedInput/index'
import { Input } from './components/Input/index'
import { Check } from './Check'

import './Examples.css'
import { matchDate } from './custom'

function App() {
  const [basicComplete, setBasicComplete] = useState(false)
  const [americanComplete, setAmericanComplete] = useState(false)
  const [britishComplete, setBritishComplete] = useState(false)

  return (
    <main className="app">
      <section>
        <h2>Basic</h2>
        <p>Just a basic regular expressions</p>
        <div className="field">
          <MaskedInput
            autoCharacters={['-']}
            mask={/^[a-zA-Z]{2}-\d{3}$/}
            validExample="AA-000"
            placeholder="AA-DDD"
            placeholderColor="#c1c1c1"
            onChange={(_, complete) => setBasicComplete(complete)}
          >
            {maskedProps => <Input {...maskedProps} />}
          </MaskedInput>
          {basicComplete && <Check />}
        </div>
      </section>

      <section>
        <h2>Date American</h2>
        <p>Custom matcher to match a date (mm/dd/yyyy)</p>
        <div className="field">
          <MaskedInput
            autoCharacters={['/']}
            mask={/^\d{1,2}\/\d{1,2}\/\d{4}$/}
            validExample="01/01/2000"
            placeholder="mm/dd/yyyy"
            placeholderColor="#c1c1c1"
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
        <p>Custom matcher to match a date (dd/mm/yyyy)</p>
        <div className="field">
          <MaskedInput
            autoCharacters={['/']}
            mask={/^\d{1,2}\/\d{1,2}\/\d{4}$/}
            validExample="01/01/2000"
            placeholder="dd/mm/yyyy"
            placeholderColor="#c1c1c1"
            onMatch={matchDate('dd/mm/yyyy')}
            onChange={(_, complete) => setBritishComplete(complete)}
          >
            {maskedProps => <Input {...maskedProps} />}
          </MaskedInput>
          {britishComplete && <Check />}
        </div>
      </section>
    </main>
  )
}

export default App
