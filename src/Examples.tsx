import React from 'react'
import { MaskedInput } from './components/MaskedInput/index'
import { Input } from './components/Input/index'

import './Examples.css'
import { matchDate } from './custom'

function App() {
  return (
    <main className="app">
      <section>
        <h2>Basic</h2>
        <p>Just a basic regular expressions</p>
        <MaskedInput
          autoCharacters={['-']}
          mask={/^[a-zA-Z]{2}-\d{3}$/}
          validExample="AA-000"
          placeholder="AA-DDD"
          placeholderColor="#c1c1c1"
        >
          {maskedProps => <Input {...maskedProps} />}
        </MaskedInput>
      </section>

      <section>
        <h2>Date</h2>
        <p>Custom matcher to match a date</p>
        <MaskedInput
          autoCharacters={['/']}
          mask={/^\d{1,2}\/\d{1,2}\/\d{2,4}$/}
          validExample="01/01/2000"
          placeholder="mm/dd/yyyy"
          placeholderColor="#c1c1c1"
          onMatch={matchDate('mm/dd/yyyy')}
        >
          {maskedProps => <Input {...maskedProps} />}
        </MaskedInput>
      </section>
    </main>
  )
}

export default App
