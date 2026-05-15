using EasyGrade.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EasyGrade.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260515215500_BackfillConflitos")]
    public partial class BackfillConflitos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                INSERT INTO conflitos (grade_id, aula_id, aula_conflitante_id, tipo, dia, hora)
                SELECT DISTINCT
                    ge1.grade_id,
                    LEAST(a1.id, a2.id),
                    GREATEST(a1.id, a2.id),
                    'professor',
                    CASE a1.dia
                        WHEN 'Seg' THEN 'Segunda-Feira'
                        WHEN 'Ter' THEN 'Terça-Feira'
                        WHEN 'Qua' THEN 'Quarta-Feira'
                        WHEN 'Qui' THEN 'Quinta-Feira'
                        WHEN 'Sex' THEN 'Sexta-Feira'
                        WHEN 'Sab' THEN 'Sábado'
                        WHEN 'Sáb' THEN 'Sábado'
                        WHEN 'SÃ¡b' THEN 'Sábado'
                        ELSE a1.dia
                    END,
                    a1.hora
                FROM aulas a1
                JOIN semestres s1 ON s1.id = a1.semestre_id
                JOIN grade_cursos gc1 ON gc1.id = s1.grade_curso_id
                JOIN grade_eixos ge1 ON ge1.id = gc1.grade_eixo_id
                JOIN aulas a2 ON a1.id < a2.id
                JOIN semestres s2 ON s2.id = a2.semestre_id
                JOIN grade_cursos gc2 ON gc2.id = s2.grade_curso_id
                JOIN grade_eixos ge2 ON ge2.id = gc2.grade_eixo_id
                WHERE ge1.grade_id = ge2.grade_id
                  AND a1.professor_id IS NOT NULL
                  AND a1.professor_id = a2.professor_id
                  AND (a1.sala_id IS DISTINCT FROM a2.sala_id OR a1.materia_id IS DISTINCT FROM a2.materia_id)
                  AND a1.hora = a2.hora
                  AND CASE a1.dia
                        WHEN 'Seg' THEN 'Segunda-Feira'
                        WHEN 'Ter' THEN 'Terça-Feira'
                        WHEN 'Qua' THEN 'Quarta-Feira'
                        WHEN 'Qui' THEN 'Quinta-Feira'
                        WHEN 'Sex' THEN 'Sexta-Feira'
                        WHEN 'Sab' THEN 'Sábado'
                        WHEN 'Sáb' THEN 'Sábado'
                        WHEN 'SÃ¡b' THEN 'Sábado'
                        ELSE a1.dia
                      END =
                      CASE a2.dia
                        WHEN 'Seg' THEN 'Segunda-Feira'
                        WHEN 'Ter' THEN 'Terça-Feira'
                        WHEN 'Qua' THEN 'Quarta-Feira'
                        WHEN 'Qui' THEN 'Quinta-Feira'
                        WHEN 'Sex' THEN 'Sexta-Feira'
                        WHEN 'Sab' THEN 'Sábado'
                        WHEN 'Sáb' THEN 'Sábado'
                        WHEN 'SÃ¡b' THEN 'Sábado'
                        ELSE a2.dia
                      END
                ON CONFLICT DO NOTHING;
                """);

            migrationBuilder.Sql(
                """
                INSERT INTO conflitos (grade_id, aula_id, aula_conflitante_id, tipo, dia, hora)
                SELECT DISTINCT
                    ge1.grade_id,
                    LEAST(a1.id, a2.id),
                    GREATEST(a1.id, a2.id),
                    'sala',
                    CASE a1.dia
                        WHEN 'Seg' THEN 'Segunda-Feira'
                        WHEN 'Ter' THEN 'Terça-Feira'
                        WHEN 'Qua' THEN 'Quarta-Feira'
                        WHEN 'Qui' THEN 'Quinta-Feira'
                        WHEN 'Sex' THEN 'Sexta-Feira'
                        WHEN 'Sab' THEN 'Sábado'
                        WHEN 'Sáb' THEN 'Sábado'
                        WHEN 'SÃ¡b' THEN 'Sábado'
                        ELSE a1.dia
                    END,
                    a1.hora
                FROM aulas a1
                JOIN semestres s1 ON s1.id = a1.semestre_id
                JOIN grade_cursos gc1 ON gc1.id = s1.grade_curso_id
                JOIN grade_eixos ge1 ON ge1.id = gc1.grade_eixo_id
                JOIN aulas a2 ON a1.id < a2.id
                JOIN semestres s2 ON s2.id = a2.semestre_id
                JOIN grade_cursos gc2 ON gc2.id = s2.grade_curso_id
                JOIN grade_eixos ge2 ON ge2.id = gc2.grade_eixo_id
                WHERE ge1.grade_id = ge2.grade_id
                  AND a1.sala_id IS NOT NULL
                  AND a1.sala_id = a2.sala_id
                  AND (a1.professor_id IS DISTINCT FROM a2.professor_id OR a1.materia_id IS DISTINCT FROM a2.materia_id)
                  AND a1.hora = a2.hora
                  AND CASE a1.dia
                        WHEN 'Seg' THEN 'Segunda-Feira'
                        WHEN 'Ter' THEN 'Terça-Feira'
                        WHEN 'Qua' THEN 'Quarta-Feira'
                        WHEN 'Qui' THEN 'Quinta-Feira'
                        WHEN 'Sex' THEN 'Sexta-Feira'
                        WHEN 'Sab' THEN 'Sábado'
                        WHEN 'Sáb' THEN 'Sábado'
                        WHEN 'SÃ¡b' THEN 'Sábado'
                        ELSE a1.dia
                      END =
                      CASE a2.dia
                        WHEN 'Seg' THEN 'Segunda-Feira'
                        WHEN 'Ter' THEN 'Terça-Feira'
                        WHEN 'Qua' THEN 'Quarta-Feira'
                        WHEN 'Qui' THEN 'Quinta-Feira'
                        WHEN 'Sex' THEN 'Sexta-Feira'
                        WHEN 'Sab' THEN 'Sábado'
                        WHEN 'Sáb' THEN 'Sábado'
                        WHEN 'SÃ¡b' THEN 'Sábado'
                        ELSE a2.dia
                      END
                ON CONFLICT DO NOTHING;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM conflitos;");
        }
    }
}
