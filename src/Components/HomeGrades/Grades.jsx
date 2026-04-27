import React from 'react'
import { Link } from "react-router-dom";
import "./Grades.css"

function Grades({grades}) {
  return (
    <div className='grades'>
        <h1>Grades</h1>

        {grades?.map((grade) => (
            <div className='item' key={grade.id}>
            <Link
                className='link'
                to={`/grade/${grade.id}`}
                state={{ grade }}>
                {grade.nome}
            </Link>
            </div>
        ))}
    </div>
  )
}

export default Grades