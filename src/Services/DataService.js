import professores from "../Data/Professores";
import materias from "../Data/Materias";
import cursos from "../Data/Cursos";
import salas from "../Data/Salas";
import eixos from "../Data/Eixos";
import aulas from "../Data/Aulas";

const DataService = {
    getProfessores: () => professores,
    getMaterias: () => materias,
    getCursos: () => cursos,
    getSalas: () => salas,
    getEixos: () => eixos,
    getAulas: () => aulas,
    addAula: (aula) => {
        aulas.push(aula);
    }
};

export default DataService;