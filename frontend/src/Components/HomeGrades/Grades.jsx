import { Link } from "react-router-dom";
import "./Grades.css"

function Grades({ grades, onCreateGrade, isCreating }) {
  return (
    <section className="grades-section">
      <button
        className="grade-card create-card"
        type="button"
        onClick={onCreateGrade}
        disabled={isCreating}
      >
        <span className="create-icon" aria-hidden="true"></span>
        <span className="grade-title">
          {isCreating ? "Criando..." : "Nova grade"}
        </span>
        <span className="grade-meta">Comece uma coleção de horários</span>
      </button>

      {grades.map(grade => (
        <Link
          className="grade-card"
          key={grade.id}
          to={`/grade/${grade.id}`}
          state={{ grade }}
        >
          <span className="grade-title">{grade.name}</span>
          <span className="grade-meta">Grade acadêmica</span>
        </Link>
      ))}
    </section>
  );
}

export default Grades
