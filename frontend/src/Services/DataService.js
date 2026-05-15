import { request } from "./ApiClient";

async function getProfessores() {
    return request("/Professores");
}

async function getMaterias() {
    return request("/Materias");
}

async function getSalas() {
    return request("/Salas");
}

async function getEixos() {
    return request("/Eixos");
}

async function getCursos() {
    return request("/Cursos");
}

async function getByType(type) {
    return request(`/${type}`);
}

async function createByType(type, name) {
    return request(`/${type}`, {
        method: "POST",
        body: JSON.stringify({ name })
    });
}

async function updateByType(type, id, name) {
    return request(`/${type}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name })
    });
}

async function deleteByType(type, id) {
    return request(`/${type}/${id}`, {
        method: "DELETE"
    });
}

export default {
    getProfessores,
    getMaterias,
    getSalas,
    getEixos,
    getCursos,
    getByType,
    createByType,
    updateByType,
    deleteByType
};
