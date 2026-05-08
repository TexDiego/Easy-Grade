import { Link, useLocation, useParams } from "react-router-dom";
import ScheduleGrid from "../../Components/ScheduleGrid/ScheduleGrid";
import AsideEditor from "../../Components/AsideEditor/AsideEditor";
import GradeHeader from "../../Components/Header/GradeHeader/GradeHeader";
import DataService from "../../Services/DataService";
import { useState, useEffect, useMemo } from "react";
import GradeService from "../../Services/GradeService";
import { UseGradeStructure } from "./Hooks/UseGradeStructure";
import { UseSchedule } from "./Hooks/UseSchedule";
import UseConflicts from "./Hooks/UseConflicts";
import "./GradeView.css";

function GradeView() {
  const [currentGrade, setCurrentGrade] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [salas, setSalas] = useState([]);
  const [eixos, setEixos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { updateAula, deleteAula } = UseSchedule(currentGrade, setCurrentGrade);
  const isAsideOpen = selectedCell && isEdit;

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

  const { AdicionarEixo, AdicionarCurso, AdicionarSemestre, ExcluirEixo, ExcluirCurso, ExcluirSemestre } = UseGradeStructure(currentGrade, setCurrentGrade);
  const conflicts = UseConflicts(currentGrade);

  if (!currentGrade) {
    return <p>Carregando...</p>;
  }

  function SwitchIsEdit() {
    setIsEdit(!isEdit);
  }

  const selectedAula = currentGrade.grades
    .flatMap(e => e.cursos)
    .flatMap(c => c.semestres)
    .find(s => s.id === selectedCell?.semestre_id)
    ?.aulas.find(a =>
      a.dia === selectedCell?.dia &&
      a.hora === selectedCell?.hora
    );

  const selectedConflicts = conflicts.filter(c =>
    selectedAula &&
    c.dia === selectedCell.dia &&
    c.hora === selectedCell.hora &&
    c.professor_id === selectedAula.professor_id &&
    (
      c.eixo_id !== selectedCell.eixo_id ||
      c.curso_id !== selectedCell.curso_id ||
      c.semestre_id !== selectedCell.semestre_id
    )
  );

  function getInfoFromIds(grade, conflito) {
    const eixo = grade.grades.find(e => e.id === conflito.eixo_id);
    const curso = eixo?.cursos.find(c => c.id === conflito.curso_id);
    const semestre = curso?.semestres.find(s => s.id === conflito.semestre_id);

    return {
      eixo: eixo?.eixo_id,
      curso: curso?.curso_id,
      semestre: semestre?.numero
    };
  }

  return (
    <div className={`layout ${isAsideOpen ? "with-aside" : ""}`}>
      <div className="main">
        <GradeHeader
          className="header"
          isEdit={isEdit}
          grade={currentGrade}
          SwitchIsEdit={SwitchIsEdit} />

        <div className="body">
          {currentGrade.grades.map((eixo) => (
            <div key={eixo.id} className="eixo">
              <select
                disabled={!isEdit}
                className="select_eixo"
                value={eixo.eixo_id || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setCurrentGrade(prev => ({
                    ...prev,
                    grades: prev.grades.map(item =>
                      item.id === eixo.id
                        ? { ...item, eixo_id: value }
                        : item
                    )
                  }));
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

              {eixo.cursos.map((curso) => (
                <div key={curso.id} className="curso">
                  <select
                    disabled={!isEdit}
                    className="select_curso"
                    value={curso.curso_id || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);

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
                  <div className="btns">
                    <button
                      style={{ opacity: isEdit ? 1 : 0 }}
                      onClick={() => AdicionarSemestre(curso.id)}>
                      Adicionar Semestre
                    </button>
                    <button
                      className="delete"
                      style={{ opacity: isEdit && currentGrade.grades.length > 0 ? 1 : 0 }}
                      onClick={() => {
                        const ultimoSemestre = curso.semestres.at(-1);

                        if (ultimoSemestre) {
                          ExcluirSemestre(ultimoSemestre.id);
                        }
                      }}>
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
                  onClick={() => {
                    const ultimoCurso = eixo.cursos.at(-1);

                    if (ultimoCurso) {
                      ExcluirCurso(ultimoCurso.id);
                    }
                  }}>
                  Excluir Curso
                </button>
              </div>
            </div>
          ))}

          <div className="btns">
            <button
              style={{ opacity: isEdit ? 1 : 0 }}
              onClick={() => AdicionarEixo(currentGrade.id)}>
              Adicionar Eixo
            </button>
            <button
              className="delete"
              style={{ opacity: isEdit && currentGrade.grades.length > 0 ? 1 : 0 }}
              onClick={() => {
                const ultimoEixo = currentGrade.grades.at(-1);

                if (ultimoEixo) {
                  ExcluirEixo(ultimoEixo.id);
                }
              }}>
              Excluir Eixo
            </button>
          </div>
        </div>
      </div>

      {selectedCell && isEdit && (
        <AsideEditor
          grade={currentGrade}
          selectedCell={selectedCell}
          conflitos={selectedConflicts.map(c => ({
            ...c,
            info: getInfoFromIds(currentGrade, c)
          }))}
          onChange={setSelectedCell}
          onSave={() => updateAula(selectedCell)}
          onClose={() => setSelectedCell(null)} />
      )}
    </div>
  );
}

export default GradeView;