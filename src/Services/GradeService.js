const API = "http://localhost:3000";

async function getGrade(id) {
  const res = await fetch(`${API}/grades/${id}/full`);
  return await res.json();
}

async function createEixo(grade_id) {
  const res = await fetch(`${API}/grade-eixos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grade_id
    })
  });

  return await res.json();
}

async function updateEixo(id, eixo_id) {

  const res = await fetch(
    `${API}/grade-eixos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ eixo_id })
    }
  );

  return res.json();
}

async function createCurso(grade_eixo_id) {
  const res = await fetch(`${API}/grade-cursos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grade_eixo_id
    })
  });

  return await res.json();
}

async function updateCurso(id, curso_id) {

  const res = await fetch(
    `${API}/grade-cursos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ curso_id })
    }
  );
  return res.json();
}

async function createSemestre(grade_curso_id, numero) {
  const res = await fetch(`${API}/semestres`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grade_curso_id,
      numero
    })
  });

  return await res.json();
}

async function getNumeroSemestre(grade_curso_id) {
  const res = await fetch(`${API}/grade-cursos/${grade_curso_id}/semestres`);
  const semestres = await res.json();
  return semestres.length + 1;
}

async function excluirEixo(eixo_id) {
  await fetch(`${API}/grade-eixos/${eixo_id}`, {
    method: "DELETE"
  });
}

async function excluirCurso(curso_id) {
  await fetch(`${API}/grade-cursos/${curso_id}`, {
    method: "DELETE"
  });
}

async function excluirSemestre(semestre_id) {
  await fetch(`${API}/semestres/${semestre_id}`, {
    method: "DELETE"
  });
}

export default {
  getGrade,
  createEixo,
  createCurso,
  createSemestre,
  getNumeroSemestre,
  excluirEixo,
  excluirCurso,
  excluirSemestre
};