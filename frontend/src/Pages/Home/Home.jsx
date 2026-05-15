import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Grades from "../../Components/HomeGrades/Grades";
import { request } from "../../Services/ApiClient";
import "./Home.css";

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
    <div className="home">
      <header className="home-header">
        <div>
          <span className="home-eyebrow">Easy Grade</span>
          <h1>Suas grades</h1>
        </div>

        <Link className="data-link" to="/datas">
          Gerenciar dados
        </Link>
      </header>

      <Grades
        grades={grades}
        onCreateGrade={createGrade}
        isCreating={isCreating}
      />
    </div>
  );
}

export default Home;
