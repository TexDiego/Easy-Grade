import React from 'react'
import { Link } from 'react-router-dom'
import "./GradeHeader.css"

function GradeHeader({ grade, isEdit, SwitchIsEdit }) {
  return (
    <div className="header">
      <div className="left">
        <Link to={"/"}>
          <button className='button'>Voltar</button>
        </Link>
      </div>

      <h1>{grade.name}</h1>

      <div className="right">
        <button
          className={`button ${isEdit ? "active" : ""}`}
          onClick={SwitchIsEdit}>
          {isEdit ? "Visualizar" : "Editar"}
        </button>
      </div>
    </div>
  )
}

export default GradeHeader