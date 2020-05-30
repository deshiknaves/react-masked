import React from 'react'
import { MaskedInput } from './components/MaskedInput/index'
import { Input } from './components/Input/index'

import './App.css'

function App() {
  return (
    <main className="app">
      <MaskedInput
        autoCharacters={['-']}
        mask={/^\w{2}-\d{3}$/}
        validExample="AA-000"
        placeholder="AA-DDD"
        placeholderColor="#c1c1c1"
      >
        {maskedProps => <Input {...maskedProps} />}
      </MaskedInput>
    </main>
  )
}

export default App
