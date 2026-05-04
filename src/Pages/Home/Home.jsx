import { Link } from "react-router-dom";
import { useState } from "react";
import Grades from "../../Components/HomeGrades/Grades";
import DataService from "../../Services/DataService";
import "./Home.css";

function Home() {
  
  let dados = [
    {
      id: "0",
      nome: "Adicionar grade",
      grades: []
    },
    {
      id: "1",
      nome: "Grade 2026 - 01",
      grades: [
        {
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
    },
    {
      id: "2",
      nome: "Grade 2026 - 02",
      grades: [
        {
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
  ];

  const [grades, setGrades] = useState(dados)
  const [newGradeName, setNewGradeName] = useState("");
  const [professores, setProfessores] = useState(DataService.getProfessores());
  const [materias, setMaterias] = useState(DataService.getMaterias());
  const [cursos, setCursos] = useState(DataService.getCursos());
  const [salas, setSalas] = useState(DataService.getSalas());
  const [eixos, setEixos] = useState(DataService.getEixos());

  function CreateGrade(name) {
    if (String(name).trim() === "") return;

    setGrades(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nome: name,
        grades: [
          {
            id: crypto.randomUUID(),
            nome: "Novo Eixo",
            cursos: [
              {
                id: crypto.randomUUID(),
                nome: "Novo Curso",
                semestres: [
                  {
                    id: crypto.randomUUID(),
                    numero: 1,
                    aulas: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
  }

  return (
    <div className="home">
      <Grades grades={grades} />

      <div>
        <Link to="/datas">Gerenciar dados</Link>
      </div>
    </div>
  );
}

export default Home;