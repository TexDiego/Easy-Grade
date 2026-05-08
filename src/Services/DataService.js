const API = "http://localhost:3000";

async function getProfessores() {
    const res = await fetch(`${API}/professores`);
    return await res.json();
}

async function getMaterias() {
    const res = await fetch(`${API}/materias`);
    return await res.json();
}

async function getSalas() {
    const res = await fetch(`${API}/salas`);
    return await res.json();
}

async function getEixos() {
    const res = await fetch(`${API}/eixos`);
    return await res.json();
}

async function getCursos() {
    const res = await fetch(`${API}/cursos`);
    return await res.json();
}

export default {
    getProfessores,
    getMaterias,
    getSalas,
    getEixos,
    getCursos
};