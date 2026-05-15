import GradeService from "../../../Services/GradeService";

export function UseSchedule(currentGrade, setCurrentGrade) {
    async function updateAula(cell) {
        try {
            const existingAula = currentGrade.grades
                .flatMap(eixo => eixo.cursos)
                .flatMap(curso => curso.semestres)
                .find(semestre => semestre.id === cell.semestre_id)
                ?.aulas.find(aula => aula.dia === cell.dia && aula.hora === cell.hora);

            if (existingAula) {
                await GradeService.excluirAula(existingAula.id);
            }

            await GradeService.createAula(cell);

            const refreshedGrade = await GradeService.getGrade(currentGrade.id);
            setCurrentGrade(refreshedGrade);

        } catch (err) {
            console.error("Erro ao salvar aula:", err);
        }
    }

    async function deleteAula(cell) {
        try {
            const existingAula = currentGrade.grades
                .flatMap(eixo => eixo.cursos)
                .flatMap(curso => curso.semestres)
                .find(semestre => semestre.id === cell.semestre_id)
                ?.aulas.find(aula => aula.dia === cell.dia && aula.hora === cell.hora);

            if (existingAula) {
                await GradeService.excluirAula(existingAula.id);
                const refreshedGrade = await GradeService.getGrade(currentGrade.id);
                setCurrentGrade(refreshedGrade);
            }
        } catch (err) {
            console.error("Erro ao deletar aula:", err);
        }
    }

    return {
        updateAula,
        deleteAula
    };
}
