import React from 'react'
import { Link } from 'react-router-dom'
import "./DatasHeader.css";

function DatasHeader() {
  return (
    <div className="header">
        <Link to={"/"}>
            <button className='header_btn'>Voltar</button>
        </Link>
            <h1 className='header_title'>Dados</h1>
    </div>
  )
}

export default DatasHeader