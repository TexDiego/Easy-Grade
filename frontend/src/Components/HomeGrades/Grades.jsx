import { Link } from "react-router-dom";
import styles from "./Grades.module.css"

function Grades({ grades }) {
  return (
    <section className={styles.gradesSection}>
      {grades.map(grade => (
        <Link
          className={styles.gradeCard}
          key={grade.id}
          to={`/grade/${grade.id}`}
          state={{ grade }}
        >
          <span className={styles.gradeTitle}>{grade.name}</span>
          <span className={styles.gradeMeta}>Grade acadêmica</span>
        </Link>
      ))}
    </section>
  );
}

export default Grades
