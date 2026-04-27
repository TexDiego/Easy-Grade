import React from 'react'
import { Link } from 'react-router-dom'
import "./GradeHeader.css"

function GradeHeader({ grade, SwitchIsEdit }) {
  return (
    <div className="header">
        <Link to={"/"}>
            <button>Voltar</button>
        </Link>
            <h1>{grade.nome}</h1>
            <button onClick={SwitchIsEdit}>Editar</button>
    </div>
  )
}

export default GradeHeader