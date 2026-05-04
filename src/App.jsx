import { useState, useEffect } from 'react'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/index";
import { DataProvider } from './Context/DataContext';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  )
}

export default App