import { useMemo } from "react";

const dayMap = {
    Seg: "Segunda-Feira",
    Ter: "Terça-Feira",
    Qua: "Quarta-Feira",
    Qui: "Quinta-Feira",
    Sex: "Sexta-Feira",
    "Sáb": "Sábado",
    "SÃ¡b": "Sábado",
    Sab: "Sábado"
};

function normalizeDay(day) {
    return dayMap[day] ?? day;
}

function collectAulasById(grade) {
    const map = new Map();

    grade.grades.forEach(eixo => {
        eixo.cursos.forEach(curso => {
            curso.semestres.forEach(semestre => {
                semestre.aulas.forEach(aula => {
                    map.set(aula.id, {
                        aula,
                        eixo,
                        curso,
                        semestre
                    });
                });
            });
        });
    });

    return map;
}

function createConflictEntry(conflict, sourceContext, targetContext) {
    return {
        ...conflict,
        aula_id: sourceContext.aula.id,
        conflito_aula_id: targetContext.aula.id,
        eixo_id: sourceContext.eixo.id,
        curso_id: sourceContext.curso.id,
        semestre_id: sourceContext.semestre.id,
        dia: normalizeDay(sourceContext.aula.dia),
        hora: sourceContext.aula.hora,
        target: {
            aula: targetContext.aula,
            eixo: targetContext.eixo,
            curso: targetContext.curso,
            semestre: targetContext.semestre
        }
    };
}

function buildConflictEntries(grade) {
    if (!grade || !grade.grades || !grade.conflicts) {
        return [];
    }

    const aulasById = collectAulasById(grade);
    const entries = [];

    grade.conflicts.forEach(conflict => {
        const aula = aulasById.get(conflict.aula_id);
        const aulaConflitante = aulasById.get(conflict.aula_conflitante_id);

        if (!aula || !aulaConflitante) return;

        entries.push(createConflictEntry(conflict, aula, aulaConflitante));
        entries.push(createConflictEntry(conflict, aulaConflitante, aula));
    });

    return entries;
}

export default function UseConflicts(currentGrade) {
    return useMemo(() => {
        return buildConflictEntries(currentGrade);
    }, [currentGrade]);
}
