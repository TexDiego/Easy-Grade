import React from 'react'
import { Link } from "react-router-dom";
import "./Grades.css"

function Grades({ grades }) {

  function newGrade(){
    let lastId = parseInt(grades[grades.length - 1].id);
    let newGrade = {
      id: (lastId + 1).toString(),
      nome: `Grade ${lastId + 1}`,
      grades: [{
          id: "eng",
          nome: "Engenharias",
          cursos: [
            {
              id: "eng_comp",
              nome: "Engenharia de Computação",
              semestres: [
                { id: "s1", numero: 1, aulas: [] },
                { id: "s2", numero: 2, aulas: [] }
              ]
            }
          ]
        }
      ]
    }
    grades.push(newGrade);
  }

  return (
    <div className='grades'>
      <h1>Grades</h1>

      <div className='items'>
        {grades?.map((grade) => (
          <Link
            className='link'
            to={`/grade/${grade.id}`}
            state={{ grade }}>
              <label className='item' key={grade.id}>
                {grade.nome}
              </label>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Grades