import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Grades from "../../Components/HomeGrades/Grades";
import { request } from "../../Services/ApiClient";
import styles from "./Home.module.css";

function Home() {

  const [grades, setGrades] = useState([])
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadGrades() {
      try {
        const data = await request("/Grades");
        setGrades(data);

      } catch (err) {
        console.error(err);
      }
    }

    loadGrades();
  }, []);

  async function createGrade() {
    try {
      setIsCreating(true);

      const novaGrade = await request("/Grades", {
        method: "POST",
        body: JSON.stringify({
          name: "Nova Grade"
        })
      });

      setGrades(prev => [novaGrade, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  }

  return (
  <div className={styles.home}>
    <header className={styles.homeHeader}>
      <div>
        <span className={styles.homeEyebrow}>
          Easy Grade
        </span>

        <h1 className={styles.h1}>
          Suas grades
        </h1>

        <p className={styles.homeDescription}>
          Organize grades acadêmicas, cursos, eixos e horários
          em uma interface moderna e intuitiva.
        </p>
      </div>

      <div className={styles.headerActions}>
        <button className={styles.primaryButton}
          onClick={createGrade}
          disabled={isCreating}
        >
          Nova grade
        </button>

        <Link
          className={styles.dataLink}
          to="/datas"
        >
          Gerenciar dados
        </Link>
      </div>
    </header>

    <section className={styles.statsSection}>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>
          Grades
        </span>

        <strong className={styles.statValue}>
          12
        </strong>
      </div>

      <div className={styles.statCard}>
        <span className={styles.statLabel}>
          Cursos
        </span>

        <strong className={styles.statValue}>
          8
        </strong>
      </div>

      <div className={styles.statCard}>
        <span className={styles.statLabel}>
          Professores
        </span>

        <strong className={styles.statValue}>
          24
        </strong>
      </div>

      <div className={styles.statCard}>
        <span className={styles.statLabel}>
          Salas
        </span>

        <strong className={styles.statValue}>
          15
        </strong>
      </div>
    </section>

    <section className={styles.toolbar}>
      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar grade..."
        />
      </div>

      <div className={styles.toolbarActions}>
        <button className={styles.filterButton}>
          Recentes
        </button>

        <button className={styles.filterButton}>
          Favoritas
        </button>
      </div>
    </section>

    <section className={styles.gradesSection}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionEyebrow}>
            Dashboard
          </span>

          <h2 className={styles.sectionTitle}>
            Grades recentes
          </h2>
        </div>
      </div>

      <Grades
        grades={grades}
      />
    </section>

    <section className={styles.activitySection}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionEyebrow}>
            Histórico
          </span>

          <h2 className={styles.sectionTitle}>
            Atividade recente
          </h2>
        </div>
      </div>

      <div className={styles.activityList}>
        <div className={styles.activityItem}>
          <div className={styles.activityDot} />

          <div>
            <strong>
              Grade ADS atualizada
            </strong>

            <p>
              Alterações feitas há 2 horas.
            </p>
          </div>
        </div>

        <div className={styles.activityItem}>
          <div className={styles.activityDot} />

          <div>
            <strong>
              Novo curso criado
            </strong>

            <p>
              Engenharia de Computação adicionada.
            </p>
          </div>
        </div>

        <div className={styles.activityItem}>
          <div className={styles.activityDot} />

          <div>
            <strong>
              Professor vinculado
            </strong>

            <p>
              Novo vínculo realizado na grade 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
}

export default Home;
