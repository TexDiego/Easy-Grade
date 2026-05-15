import { request } from "./ApiClient";

function normalizeAula(aula) {
  return {
    ...aula,
    professor_id: aula.professorId ?? aula.professor_id ?? null,
    materia_id: aula.materiaId ?? aula.materia_id ?? null,
    sala_id: aula.salaId ?? aula.sala_id ?? null,
    professor_name: aula.professorNome ?? aula.professor_name ?? null,
    materia_name: aula.materiaNome ?? aula.materia_name ?? null,
    sala_name: aula.salaNome ?? aula.sala_name ?? null
  };
}

function normalizeSemestre(semestre) {
  return {
    ...semestre,
    grade_curso_id: semestre.gradeCursoId ?? semestre.grade_curso_id,
    aulas: (semestre.aulas ?? []).map(normalizeAula)
  };
}

function normalizeCurso(curso) {
  return {
    ...curso,
    grade_eixo_id: curso.gradeEixoId ?? curso.grade_eixo_id,
    curso_id: curso.cursoId ?? curso.curso_id ?? null,
    name: curso.cursoNome ?? curso.name,
    semestres: (curso.semestres ?? []).map(normalizeSemestre)
  };
}

function normalizeEixo(eixo) {
  return {
    ...eixo,
    grade_id: eixo.gradeId ?? eixo.grade_id,
    eixo_id: eixo.eixoId ?? eixo.eixo_id ?? null,
    name: eixo.eixoNome ?? eixo.name,
    cursos: (eixo.cursos ?? []).map(normalizeCurso)
  };
}

function normalizeGrade(grade) {
  const normalizedGrade = {
    ...grade,
    grades: (grade.eixos ?? grade.grades ?? []).map(normalizeEixo),
    conflicts: (grade.conflitos ?? grade.conflicts ?? []).map(normalizeConflict)
  };

  return normalizedGrade;
}

function normalizeConflict(conflict) {
  return {
    ...conflict,
    grade_id: conflict.gradeId ?? conflict.grade_id,
    aula_id: conflict.aulaId ?? conflict.aula_id,
    aula_conflitante_id: conflict.aulaConflitanteId ?? conflict.aula_conflitante_id
  };
}

async function getGrade(id) {
  const grade = await request(`/Grades/${id}/full`);
  return normalizeGrade(grade);
}

async function createEixo(grade_id) {
  const eixo = await request("/GradeEixo", {
    method: "POST",
    body: JSON.stringify({
      gradeId: grade_id,
      eixoId: null
    })
  });

  return normalizeEixo(eixo);
}

async function updateEixo(id, eixo_id) {
  const eixo = await request(
    `/GradeEixo/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ eixoId: eixo_id || null })
    }
  );

  return normalizeEixo(eixo);
}

async function createCurso(grade_eixo_id) {
  const curso = await request("/GradeCurso", {
    method: "POST",
    body: JSON.stringify({
      gradeEixoId: grade_eixo_id,
      cursoId: null
    })
  });

  return normalizeCurso(curso);
}

async function updateCurso(id, curso_id) {
  const curso = await request(
    `/GradeCurso/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ cursoId: curso_id || null })
    }
  );

  return normalizeCurso(curso);
}

async function createSemestre(grade_curso_id, numero) {
  const semestre = await request("/Semestres", {
    method: "POST",
    body: JSON.stringify({
      gradeCursoId: grade_curso_id,
      numero
    })
  });

  return normalizeSemestre(semestre);
}

async function getNumeroSemestre(grade_curso_id) {
  const semestres = await request(`/Semestres/gradecurso/${grade_curso_id}`);
  return semestres.length + 1;
}

async function excluirEixo(eixo_id) {
  await request(`/GradeEixo/${eixo_id}`, {
    method: "DELETE"
  });
}

async function excluirCurso(curso_id) {
  await request(`/GradeCurso/${curso_id}`, {
    method: "DELETE"
  });
}

async function excluirSemestre(semestre_id) {
  await request(`/Semestres/${semestre_id}`, {
    method: "DELETE"
  });
}

async function createAula(cell) {
  const aula = await request("/Aulas", {
    method: "POST",
    body: JSON.stringify({
      semestreId: cell.semestre_id,
      dia: cell.dia,
      hora: cell.hora,
      professorId: cell.professor_id || null,
      materiaId: cell.materia_id || null,
      salaId: cell.sala_id || null
    })
  });

  return normalizeAula(aula);
}

async function excluirAula(aula_id) {
  await request(`/Aulas/${aula_id}`, {
    method: "DELETE"
  });
}

export default {
  getGrade,
  createEixo,
  updateEixo,
  createCurso,
  updateCurso,
  createSemestre,
  getNumeroSemestre,
  excluirEixo,
  excluirCurso,
  excluirSemestre,
  createAula,
  excluirAula
};
