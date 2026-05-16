import { Link } from 'react-router-dom'
import styles from "./GradeHeader.module.css"

function GradeHeader({ grade, isEdit, SwitchIsEdit }) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Link to={"/"}>
          <button className={styles.button}>Voltar</button>
        </Link>
      </div>

      <h1 className={styles.h1}>{grade.name}</h1>

      <div className={styles.right}>
        <button
          className={`button ${isEdit ? styles.active : styles.button}`}
          onClick={SwitchIsEdit}>
          {isEdit ? "Visualizar" : "Editar"}
        </button>
      </div>
    </div>
  )
}

export default GradeHeader
