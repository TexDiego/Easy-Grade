import GradeService from "../../../Services/GradeService";

export function UseGradeStructure(currentGrade, setCurrentGrade) {
  const API = "http://localhost:3000";

  async function AdicionarEixo(grade_id) {
    const novoEixo = await GradeService.createEixo(currentGrade.id);

    setCurrentGrade(prev => ({
      ...prev,
      grades: [
        ...prev.grades,
        {
          ...novoEixo,
          cursos: []
        }
      ]
    }));
  }

  async function AdicionarCurso(grade_eixo_id) {
    const novoCurso = await GradeService.createCurso(grade_eixo_id);

    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => {
        if (eixo.id === grade_eixo_id) {
          return {
            ...eixo,
            cursos: [
              ...eixo.cursos,
              {
                ...novoCurso,
                semestres: []
              }
            ]
          };
        }
        return eixo;
      })
    }));
  }

  async function AdicionarSemestre(grade_curso_id) {
    const numero = await GradeService.getNumeroSemestre(grade_curso_id);
    const novoSemestre = await GradeService.createSemestre(grade_curso_id, numero);

    const semestreCompleto = {
      ...novoSemestre,
      aulas: []
    };

    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => ({
        ...eixo,
        cursos: eixo.cursos.map(curso => {
          if (curso.id === grade_curso_id) {
            return {
              ...curso,
              semestres: [
                ...curso.semestres,
                semestreCompleto
              ]
            };
          }
          return curso;
        })
      }))
    }));
  }

  async function ExcluirEixo(eixo_id) {
    await GradeService.excluirEixo(eixo_id);
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.filter(eixo => eixo.id !== eixo_id)
    }));
  }

  async function ExcluirCurso(curso_id) {
    await GradeService.excluirCurso(curso_id);

    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => ({
        ...eixo,
        cursos: eixo.cursos.filter(
          curso => curso.id !== curso_id
        )
      }))
    }));
  }

  async function ExcluirSemestre(semestre_id) {
    await GradeService.excluirSemestre(semestre_id);
    setCurrentGrade(prev => ({
      ...prev,
      grades: prev.grades.map(eixo => ({
        ...eixo,
        cursos: eixo.cursos.map(curso => ({
          ...curso,
          semestres: curso.semestres.filter(
            semestre => semestre.id !== semestre_id
          )
        }))
      }))
    }));
  }

  return {
    AdicionarEixo,
    AdicionarCurso,
    AdicionarSemestre,
    ExcluirEixo,
    ExcluirCurso,
    ExcluirSemestre
  };
}