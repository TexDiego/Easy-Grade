import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Grades from "../../Components/HomeGrades/Grades";
import DataService from "../../Services/DataService";
import "./Home.css";

function Home() {

  const [grades, setGrades] = useState([])

  useEffect(() => {
    async function loadGrades() {
      try {
        const res = await fetch("http://localhost:3000/grades");
        const data = await res.json();

        setGrades(data);

      } catch (err) {
        console.error(err);
      }
    }

    loadGrades();
  }, []);

  async function createGrade() {
    const res = await fetch("http://localhost:3000/grades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Nova Grade"
      })
    });

    const novaGrade = await res.json();

    setGrades(prev => [...prev, novaGrade]);
  }

  return (
    <div className="home">

      <button onClick={createGrade}>
        Nova Grade
      </button>

      <Grades grades={grades} />

      <div>
        <Link to="/datas">Gerenciar dados</Link>
      </div>
    </div>
  );
}

export default Home;