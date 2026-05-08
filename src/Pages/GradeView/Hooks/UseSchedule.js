import { useState } from "react";

export function UseSchedule(currentGrade, setCurrentGrade) {
    const API = "http://localhost:3000";

    async function updateAula(cell) {
        try {
            const payload = {
                eixo_id: cell.eixo_id,
                curso_id: cell.curso_id,
                semestre_id: cell.semestre_id,
                dia: cell.dia,
                hora: cell.hora,
                professor_id: cell.professor_id,
                materia_id: cell.materia_id,
                sala_id: cell.sala_id
            };

            const response = await fetch(`${API}/schedule`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const aulaSalva = await response.json();

            setCurrentGrade(prev => ({
                ...prev,
                grades: prev.grades.map(eixo => {
                    if (eixo.id !== cell.eixo_id) return eixo;

                    return {
                        ...eixo,
                        cursos: eixo.cursos.map(curso => {
                            if (curso.id !== cell.curso_id) return curso;

                            return {
                                ...curso,
                                semestres: curso.semestres.map(semestre => {
                                    if (semestre.id !== cell.semestre_id) return semestre;

                                    const aulasFiltradas = semestre.aulas.filter(
                                        a => !(a.dia === cell.dia && a.hora === cell.hora)
                                    );

                                    return {
                                        ...semestre,
                                        aulas: [
                                            ...aulasFiltradas,
                                            aulaSalva
                                        ]
                                    };
                                })
                            };
                        })
                    };
                })
            }));

        } catch (err) {
            console.error("Erro ao salvar aula:", err);
        }
    }

    async function deleteAula(cell) {
        try {
            await fetch(`${API}/schedule`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    eixo_id: cell.eixo_id,
                    curso_id: cell.curso_id,
                    semestre_id: cell.semestre_id,
                    dia: cell.dia,
                    hora: cell.hora
                })
            });
        } catch (err) {
            console.error("Erro ao deletar aula:", err);
        }
    }

    return {
        updateAula,
        deleteAula
    };
}