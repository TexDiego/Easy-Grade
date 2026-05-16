import { useParams, useNavigate } from "react-router-dom";
import ScheduleGrid from "../../Components/ScheduleGrid/ScheduleGrid";
import AsideEditor from "../../Components/AsideEditor/AsideEditor";
import GradeHeader from "../../Components/Header/GradeHeader/GradeHeader";
import DataService from "../../Services/DataService";
import { useState, useEffect } from "react";
import GradeService from "../../Services/GradeService";
import { UseGradeStructure } from "./Hooks/UseGradeStructure";
import { UseSchedule } from "./Hooks/UseSchedule";
import UseConflicts from "./Hooks/UseConflicts";
import "./GradeView.css";
import { request } from "../../Services/ApiClient";

function GradeView() {
  const [currentGrade, setCurrentGrade] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [salas, setSalas] = useState([]);
  const [eixos, setEixos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { updateAula } = UseSchedule(currentGrade, setCurrentGrade);
  const isAsideOpen = selectedCell && isEdit;
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    async function loadData() {
      try {
        const [professoresData, materiasData, salasData, eixosData, cursosData, gradeData] = await Promise.all([
          DataService.getProfessores(),
          DataService.getMaterias(),
          DataService.getSalas(),
          DataService.getEixos(),
          DataService.getCursos(),
          GradeService.getGrade(id)
        ]);

        setCurrentGrade(gradeData);
        setProfessores(professoresData);
        setMaterias(materiasData);
        setSalas(salasData);
        setEixos(eixosData);
        setCursos(cursosData);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [id]);

  async function deleteGrade() {
    const confirmed = window.confirm(
      "Deseja realmente excluir esta grade?"
    );

    if (!confirmed) return;

    try {
      await request(`/grades/${id}`, {
        method: "DELETE"
      });

      alert("Grade removida");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  const { AdicionarEixo, AdicionarCurso, AdicionarSemestre, ExcluirEixo, ExcluirCurso, ExcluirSemestre } = UseGradeStructure(currentGrade, setCurrentGrade);
  const conflicts = UseConflicts(currentGrade);

  if (!currentGrade) {
    return <p>Carregando...</p>;
  }

  function SwitchIsEdit() {
    setSelectedCell(null);
    setIsEdit(!isEdit);
  }

  const selectedAula = currentGrade.grades
    .flatMap(e => e.cursos)
    .flatMap(c => c.semestres)
    .find(s => s.id === selectedCell?.semestre_id)
    ?.aulas.find(a =>
      selectedCell?.aula_id
        ? a.id === selectedCell.aula_id
        : a.dia === selectedCell?.dia && a.hora === selectedCell?.hora
    );

  const selectedConflicts = conflicts.filter(c =>
    selectedAula &&
    c.aula_id === selectedAula.id
  );

  return (
    <div className={`layout ${isAsideOpen ? "with-aside" : ""} ${isEdit ? "edit-mode" : "view-mode"}`}>
      <div className="main">
        <GradeHeader
          className="header"
          isEdit={isEdit}
          grade={currentGrade}
          SwitchIsEdit={SwitchIsEdit} />

        <div className="body">
          {currentGrade.grades.map((eixo) => (
            <div key={eixo.id} className="eixo">
              <div className="entity-bar eixo-bar">
                <span className="entity-label">Eixo</span>
                <select
                  disabled={!isEdit}
                  className="select_eixo"
                  value={eixo.eixo_id || ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : null;

                    setCurrentGrade(prev => ({
                      ...prev,
                      grades: prev.grades.map(item =>
                        item.id === eixo.id
                          ? { ...item, eixo_id: value }
                          : item
                      )
                    }));

                    GradeService.updateEixo(eixo.id, value).catch(console.error);
                  }}>
                  <option value="">Selecione um eixo</option>

                  {eixos
                    .filter(e => {
                      const selecionados = currentGrade.grades
                        .filter(g => g.id !== eixo.id)
                        .map(g => g.eixo_id)
                        .filter(Boolean);

                      return e.id === eixo.eixo_id || !selecionados.includes(e.id);
                    })
                    .map(e => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              {eixo.cursos.map((curso) => (
                <div key={curso.id} className="curso">
                  <div className="entity-bar curso-bar">
                    <span className="entity-label">Curso</span>
                    <select
                      disabled={!isEdit}
                      className="select_curso"
                      value={curso.curso_id || ""}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : null;

                        setCurrentGrade(prev => ({
                          ...prev,
                          grades: prev.grades.map(g =>
                            g.id === eixo.id
                              ? {
                                ...g,
                                cursos: g.cursos.map(c =>
                                  c.id === curso.id
                                    ? { ...c, curso_id: value }
                                    : c
                                )
                              }
                              : g
                          )
                        }));

                        GradeService.updateCurso(curso.id, value).catch(console.error);
                      }}>
                      <option value="">Selecione um curso</option>

                      {cursos
                        .filter(c => {
                          const selecionados = currentGrade.grades
                            .flatMap(g => g.cursos)
                            .filter(cursoItem => cursoItem.id !== curso.id)
                            .map(cursoItem => cursoItem.curso_id)
                            .filter(Boolean);

                          return c.id === curso.curso_id || !selecionados.includes(c.id);
                        })
                        .map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {curso.semestres.map((semestre) => (
                    <div key={semestre.id} className="semestre">
                      <h4>{semestre.numero}º Semestre</h4>

                      <ScheduleGrid
                        selectedCell={isEdit ? selectedCell : null}
                        onSelectCell={isEdit ? setSelectedCell : () => { }}
                        isEdit={isEdit}
                        contexto={{
                          eixo_id: eixo.id,
                          curso_id: curso.id,
                          semestre_id: semestre.id
                        }}
                        materias={materias}
                        professores={professores}
                        salas={salas}
                        aulas={semestre.aulas}
                        conflitos={conflicts.filter(c => c.semestre_id === semestre.id) }
                      />
                    </div>
                  ))}
                  {isEdit && (
                    <div className="btns">
                      <button onClick={() => AdicionarSemestre(curso.id)}>
                        Adicionar Semestre
                      </button>
                      <button
                        className="delete"
                        disabled={curso.semestres.length === 0}
                        onClick={() => {
                          const ultimoSemestre = curso.semestres.at(-1);

                          if (ultimoSemestre) {
                            ExcluirSemestre(ultimoSemestre.id);
                          }
                        }}>
                        Excluir Semestre
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isEdit && (
                <div className="btns eixo-actions">
                  <button onClick={() => AdicionarCurso(eixo.id)}>
                    Adicionar Curso
                  </button>
                  <button
                    className="delete"
                    disabled={eixo.cursos.length === 0}
                    onClick={() => {
                      const ultimoCurso = eixo.cursos.at(-1);

                      if (ultimoCurso) {
                        ExcluirCurso(ultimoCurso.id);
                      }
                    }}>
                    Excluir Curso
                  </button>
                </div>
              )}
            </div>
          ))}

          {isEdit && (
            <div className="btns grade-actions">
              <button onClick={() => AdicionarEixo()}>
                Adicionar Eixo
              </button>
              <button
                className="delete"
                disabled={currentGrade.grades.length === 0}
                onClick={() => {
                  const ultimoEixo = currentGrade.grades.at(-1);

                  if (ultimoEixo) {
                    ExcluirEixo(ultimoEixo.id);
                  }
                }}>
                Excluir Eixo
              </button>
            </div>
          )}
        </div>

        <button
          onClick={deleteGrade}>
          Excluir grade
        </button>
      </div>

      {selectedCell && isEdit && (
        <AsideEditor
          selectedCell={selectedCell}
          conflicts={selectedConflicts}
          onChange={setSelectedCell}
          onSave={() => updateAula(selectedCell)}
          onClose={() => setSelectedCell(null)} />
      )}
    </div>
  );
}

export default GradeView;
