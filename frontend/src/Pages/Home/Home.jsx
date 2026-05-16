import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Grades from "../../Components/HomeGrades/Grades";
import { request } from "../../Services/ApiClient";
import styles from "./Home.module.css";

function Home() {

  const [grades, setGrades] = useState([])
  const [isCreating, setIsCreating] = useState(false);
  const [newGradeName, setNewGradeName] = useState("");

  const [summary, setSummary] = useState({
    grades: 0,
    cursos: 0,
    professores: 0,
    salas: 0,
    materias: 0,
    eixos: 0,
  });

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await request("/dashboard/summary");

        setSummary(response);
      } catch (err) {
        console.error(err);
      }
    }

    fetchSummary();
  }, []);

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
          name: newGradeName
        })
      });

      setGrades(prev => [novaGrade, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
      setNewGradeName("");
    }
  }

  return (
    <div className={styles.home}>
      <header className={styles.homeHeader}>
        <div>
          <p className={styles.homeTitle}>
            Easy Grade
          </p>

          <p className={styles.homeDescription}>
            Organize grades acadêmicas em uma interface moderna e intuitiva.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.primaryButton}
            onClick={() => setIsCreating(true)}
          >
            Nova grade
          </button>

          {
            isCreating && (
              <div className={styles.createGradeBox}>
                <input
                  className={styles.createInput}
                  type="text"
                  value={newGradeName}
                  onChange={(e) => setNewGradeName(e.target.value)}
                  placeholder="Nome da grade"
                  autoFocus
                />

                <div className={styles.createActions}>
                  <button
                    className={styles.createBtn}
                    onClick={() => createGrade()}
                    disabled={!newGradeName.trim()}>
                    Criar
                  </button>

                  <button
                    className={styles.cancelCreationBtn}
                    onClick={() => {
                      setIsCreating(false);
                      setNewGradeName("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )
          }

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
            {summary?.grades ?? 0}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Cursos
          </span>

          <strong className={styles.statValue}>
            {summary?.cursos ?? 0}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Professores
          </span>

          <strong className={styles.statValue}>
            {summary?.professores ?? 0}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Salas
          </span>

          <strong className={styles.statValue}>
            {summary?.salas ?? 0}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Eixos
          </span>

          <strong className={styles.statValue}>
            {summary?.eixos ?? 0}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Matérias
          </span>

          <strong className={styles.statValue}>
            {summary?.materias ?? 0}
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
