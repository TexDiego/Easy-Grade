import React from 'react'
import { Link } from "react-router-dom";
import "./Grades.css"

function Grades({ grades }) {
  return (
    <div>
      {grades.map(grade => (
        <Link
          key={grade.id}
          to={`/grade/${grade.id}`}
          state={{ grade }}
        >
          {grade.name}
        </Link>
      ))}
    </div>
  );
}

export default Grades