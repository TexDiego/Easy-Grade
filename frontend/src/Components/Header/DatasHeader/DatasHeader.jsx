import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./DatasHeader.module.css";

function DatasHeader() {
  return (
    <div className={styles.header}>
        <Link to={"/"}>
            <button className={styles.header_btn}>Voltar</button>
        </Link>
            <h1 className={styles.header_title}>Dados</h1>
    </div>
  )
}

export default DatasHeader