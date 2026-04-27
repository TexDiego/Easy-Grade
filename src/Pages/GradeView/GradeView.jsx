import { Link, useLocation } from "react-router-dom";
import ScheduleGrid from "../../Components/ScheduleGrid/ScheduleGrid";
import AsideEditor from "../../Components/AsideEditor/AsideEditor";
import GradeHeader from "../../Components/Header/GradeHeader/GradeHeader";
import DataService from "../../Services/DataService";
import { useState, useEffect } from "react";
import { useData } from "../../Context/DataContext";
import "./GradeView.css";
import materias from "../../Data/Materias";

function GradeView() {
  const location = useLocation();
  const grade = location.state?.grade;
  const [currentGrade, setCurrentGrade] = useState(grade);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const { professores, salas, materias } = useData();
  const isAsideOpen = selectedCell && isEdit;

  function AdicionarEixo() {
    setCurrentGrade(prev => {
      return {
        ...prev,
        grades: [
          ...prev.grades,
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
    })
  }

  function AdicionarCurso(eixo_id) {
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => {
        if (eixo.id === eixo_id) {
          return {
            ...eixo,
            cursos: [
              ...eixo.cursos,
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
          };
        }
        return eixo;
      })
    }));
  }

  function AdicionarSemestre(eixo_id, curso_id) {
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => {
        if (eixo.id === eixo_id) {
          return {
            ...eixo,
            cursos: eixo.cursos.map(curso => {
              if (curso.id === curso_id) {
                return {
                  ...curso,
                  semestres: [
                    ...curso.semestres,
                    {
                      id: crypto.randomUUID(),
                      numero: curso.semestres.length + 1,
                      aulas: []
                    }
                  ]
                };
              }
              return curso;
            })
          };
        }
        return eixo;
      })
    }));
  }

  function ExcluirEixo() {
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.slice(0, -1)
    }));
  }

  function ExcluirCurso(eixo_id) {
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => {
        if (eixo.id === eixo_id) {
          return {
            ...eixo,
            cursos: eixo.cursos.slice(0, -1)
          };
        }
        return eixo;
      })
    }));
  }

  function ExcluirSemestre(eixo_id, curso_id) {
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => {
        if (eixo.id === eixo_id) {
          return {
            ...eixo,
            cursos: eixo.cursos.map(curso => {
              if (curso.id === curso_id) {
                return {
                  ...curso,
                  semestres: curso.semestres.slice(0, -1)
                };
              }
              return curso;
            })
          };
        }
        return eixo;
      })
    }));
  }

  if (!grade) {
    return <p>Grade não encontrada</p>;
  }

  function SwitchIsEdit() {
    setIsEdit(!isEdit);
  }

  function updateAula(cell, data) {
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => {
        if (eixo.id !== cell.eixoId) return eixo;

        return {
          ...eixo,
          cursos: eixo.cursos.map(curso => {
            if (curso.id !== cell.cursoId) return curso;

            return {
              ...curso,
              semestres: curso.semestres.map(semestre => {
                if (semestre.id !== cell.semestreId) return semestre;

                const aulasFiltradas = semestre.aulas.filter(
                  a => !(a.dia === cell.dia && a.hora === cell.hora)
                );

                return {
                  ...semestre,
                  aulas: [
                    ...aulasFiltradas,
                    {
                      ...cell,
                      professorId: data.professorId,
                      materiaId: data.materiaId,
                      salaId: data.salaId
                    }
                  ]
                };
              })
            };
          })
        };
      })
    }));
  }

  function calculateConflicts(grade) {
    const conflitos = [];
    const mapa = {};

    grade.grades.forEach(eixo => {
      eixo.cursos.forEach(curso => {
        curso.semestres.forEach(semestre => {
          semestre.aulas.forEach(aula => {
            const key = `${aula.dia}-${aula.hora}`;

            if (!mapa[key]) mapa[key] = [];

            mapa[key].push({
              ...aula,
              eixoId: eixo.id,
              cursoId: curso.id,
              semestreId: semestre.id
            });
          });
        });
      });
    });

    Object.values(mapa).forEach(lista => {
      lista.forEach(aulaA => {
        lista.forEach(aulaB => {
          if (aulaA === aulaB) return;

          const mesmoProfessor = aulaA.professorId === aulaB.professorId;
          const mesmaSala = aulaA.salaId === aulaB.salaId;
          const mesmaMateria = aulaA.materiaId === aulaB.materiaId;

          if (
            mesmoProfessor &&
            (!mesmaSala || !mesmaMateria)
          ) {
            conflitos.push(aulaA);
          }

          if (
            mesmaSala &&
            (!mesmoProfessor || !mesmaMateria)
          ) {
            conflitos.push(aulaA);
          }
        });
      });
    });

    return conflitos;
  }

  useEffect(() => {
    if (!currentGrade) return;

    const novosConflitos = calculateConflicts(currentGrade);
    setConflicts(novosConflitos);

  }, [currentGrade]);

  const selectedAula = currentGrade.grades
    .flatMap(e => e.cursos)
    .flatMap(c => c.semestres)
    .find(s => s.id === selectedCell?.semestreId)
    ?.aulas.find(a =>
      a.dia === selectedCell?.dia &&
      a.hora === selectedCell?.hora
    );

  const selectedConflicts = conflicts.filter(c =>
    selectedAula &&
    c.dia === selectedCell.dia &&
    c.hora === selectedCell.hora &&
    c.professorId === selectedAula.professorId &&
    (
      c.eixoId !== selectedCell.eixoId ||
      c.cursoId !== selectedCell.cursoId ||
      c.semestreId !== selectedCell.semestreId
    )
  );

  function getInfoFromIds(grade, conflito) {
    const eixo = grade.grades.find(e => e.id === conflito.eixoId);
    const curso = eixo?.cursos.find(c => c.id === conflito.cursoId);
    const semestre = curso?.semestres.find(s => s.id === conflito.semestreId);

    return {
      eixo: eixo?.nome,
      curso: curso?.nome,
      semestre: semestre?.numero
    };
  }

  return (
    <div className={`layout ${isAsideOpen ? "with-aside" : ""}`}>
      <div className="main">
        <GradeHeader grade={currentGrade} SwitchIsEdit={SwitchIsEdit} />

        <div className="body">
          {currentGrade.grades.map((eixo) => (
            <div key={eixo.id} className="eixo">
              <input
                disabled={!isEdit}
                className="input_eixo"
                type="text"
                value={eixo.nome}
                onChange={(e) => {
                  setCurrentGrade(prev => ({
                    ...prev,
                    grades: prev.grades.map(item =>
                      item.id === eixo.id ? { ...item, nome: e.target.value } : item
                    )
                  }));
                }}
              />

              {eixo.cursos.map((curso) => (
                <div key={curso.id} className="curso">
                  <input
                    disabled={!isEdit}
                    className="input_curso"
                    type="text"
                    value={curso.nome}
                    onChange={(e) => {
                      setCurrentGrade(prev => ({
                        ...prev,
                        grades: prev.grades.map(item =>
                          item.id === eixo.id ? { ...item, cursos: item.cursos.map(c => c.id === curso.id ? { ...c, nome: e.target.value } : c) } : item
                        )
                      }));
                    }}
                  />

                  {curso.semestres.map((semestre) => (
                    <div key={semestre.id} className="semestre">
                      <h4>{semestre.numero}º Semestre</h4>

                      <ScheduleGrid
                        selectedCell={isEdit ? selectedCell : null}
                        onSelectCell={isEdit ? setSelectedCell : () => { }}
                        isEdit={isEdit}
                        contexto={{
                          eixoId: eixo.id,
                          cursoId: curso.id,
                          semestreId: semestre.id
                        }}
                        materias={materias}
                        professores={professores}
                        salas={salas}
                        aulas={semestre.aulas}
                        conflitos={conflicts.filter(c => c.semestreId === semestre.id)}
                      />
                    </div>
                  ))}
                  <div className="btns">
                    <button
                      style={{ opacity: isEdit ? 1 : 0 }}
                      onClick={() => AdicionarSemestre(eixo.id, curso.id)}>
                      Adicionar Semestre
                    </button>
                    <button
                      className="delete"
                      style={{ opacity: isEdit && currentGrade.grades.length > 0 ? 1 : 0 }}
                      onClick={() => ExcluirSemestre(eixo.id, curso.id)}>
                      Excluir Semestre
                    </button>
                  </div>
                </div>
              ))}
              <div className="btns">
                <button
                  style={{ opacity: isEdit ? 1 : 0 }}
                  onClick={() => AdicionarCurso(eixo.id)}>
                  Adicionar Curso
                </button>
                <button
                  className="delete"
                  style={{ opacity: isEdit ? 1 : 0 }}
                  onClick={() => ExcluirCurso(eixo.id)}>
                  Excluir Curso
                </button>
              </div>
            </div>
          ))}

          <div className="btns">
            <button
              style={{ opacity: isEdit ? 1 : 0 }}
              onClick={() => AdicionarEixo()}>
              Adicionar Eixo
            </button>
            <button
              className="delete"
              style={{ opacity: isEdit && currentGrade.grades.length > 0 ? 1 : 0 }}
              onClick={() => ExcluirEixo()}>
              Excluir Eixo
            </button>
          </div>
        </div>
      </div>

      {selectedCell && isEdit && (
        <AsideEditor
          grade={currentGrade}
          conflicts={selectedConflicts}
          selectedCell={selectedCell}
          onChange={setSelectedCell}
          onSave={(data) => updateAula(selectedCell, data)}
          onClose={() => setSelectedCell(null)} />
      )}
    </div>
  );
}

export default GradeView;