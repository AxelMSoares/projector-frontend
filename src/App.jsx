import { useState } from 'react'
import HomeContent from './components/homePage/homeContent'
import PublicHeader from './components/publicHeader/publicHeader'
import './assets/css/main.css'

function App() {
  
  const [isLogged, setIsLogged] = useState(false);

  return (
    <>
      <PublicHeader />
      <HomeContent />
    </>
  )
}

export default App
