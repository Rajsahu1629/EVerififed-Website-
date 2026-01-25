import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import BasicCardComponent from './BasicCardComponent';
import CustomizedCardComponent from './CustomizedCardComponent';
import ResponsiveCardComponent from './ResponsiveCardComponent';

function App() {
  

  return (
    <ChakraProvider>
      <div>
      <BasicCardComponent />
      <CustomizedCardComponent />
      <ResponsiveCardComponent />
    </div>
    </ChakraProvider>
  )
}

export default App
