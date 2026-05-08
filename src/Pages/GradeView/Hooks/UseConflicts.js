import { useMemo } from "react";

function calculateConflicts(grade) {

    if (!grade || !grade.grades) {
        return [];
    }

    const conflitos = [];
    const mapa = {};

    grade.grades.forEach(eixo => {
        eixo.cursos.forEach(curso => {
            curso.semestres.forEach(semestre => {
                semestre.aulas.forEach(aula => {
                    const key = `${aula.dia}-${aula.hora}`;

                    if (!mapa[key]) mapa[key] = [];

                    mapa[key].push({
                        ...aula,
                        eixo_id: eixo.id,
                        curso_id: curso.id,
                        semestre_id: semestre.id
                    });
                });
            });
        });
    });

    Object.values(mapa).forEach(lista => {
        lista.forEach(aulaA => {
            lista.forEach(aulaB => {

                if (aulaA === aulaB) return;

                const mesmoProfessor =
                    aulaA.professor_id === aulaB.professor_id;

                const mesmaSala =
                    aulaA.sala_id === aulaB.sala_id;

                const mesmaMateria =
                    aulaA.materia_id === aulaB.materia_id;

                if (
                    mesmoProfessor &&
                    (!mesmaSala || !mesmaMateria)
                ) {
                    conflitos.push(aulaA);
                }

                if (
                    mesmaSala &&
                    (!mesmoProfessor || !mesmaMateria)
                ) {
                    conflitos.push(aulaA);
                }
            });
        });
    });

    return conflitos;
}

export default function UseConflicts(currentGrade) {

    return useMemo(() => {
        return calculateConflicts(currentGrade);
    }, [currentGrade]);
}