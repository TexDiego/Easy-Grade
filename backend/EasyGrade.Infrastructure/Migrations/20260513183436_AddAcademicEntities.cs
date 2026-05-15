using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EasyGrade.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Curso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Curso", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Eixo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eixo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Materia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materia", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Professores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sala",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sala", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GradeEixo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GradeId = table.Column<int>(type: "integer", nullable: false),
                    EixoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GradeEixo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GradeEixo_Eixo_EixoId",
                        column: x => x.EixoId,
                        principalTable: "Eixo",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GradeEixo_Grades_GradeId",
                        column: x => x.GradeId,
                        principalTable: "Grades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GradeCurso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GradeEixoId = table.Column<int>(type: "integer", nullable: false),
                    CursoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GradeCurso", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GradeCurso_Curso_CursoId",
                        column: x => x.CursoId,
                        principalTable: "Curso",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GradeCurso_GradeEixo_GradeEixoId",
                        column: x => x.GradeEixoId,
                        principalTable: "GradeEixo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Semestre",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GradeCursoId = table.Column<int>(type: "integer", nullable: false),
                    Numero = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Semestre", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Semestre_GradeCurso_GradeCursoId",
                        column: x => x.GradeCursoId,
                        principalTable: "GradeCurso",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Aula",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SemestreId = table.Column<int>(type: "integer", nullable: false),
                    Dia = table.Column<string>(type: "text", nullable: false),
                    Hora = table.Column<string>(type: "text", nullable: false),
                    ProfessorId = table.Column<int>(type: "integer", nullable: true),
                    MateriaId = table.Column<int>(type: "integer", nullable: true),
                    SalaId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aula", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Aula_Materia_MateriaId",
                        column: x => x.MateriaId,
                        principalTable: "Materia",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Aula_Professores_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professores",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Aula_Sala_SalaId",
                        column: x => x.SalaId,
                        principalTable: "Sala",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Aula_Semestre_SemestreId",
                        column: x => x.SemestreId,
                        principalTable: "Semestre",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Aula_MateriaId",
                table: "Aula",
                column: "MateriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Aula_ProfessorId",
                table: "Aula",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Aula_SalaId",
                table: "Aula",
                column: "SalaId");

            migrationBuilder.CreateIndex(
                name: "IX_Aula_SemestreId",
                table: "Aula",
                column: "SemestreId");

            migrationBuilder.CreateIndex(
                name: "IX_GradeCurso_CursoId",
                table: "GradeCurso",
                column: "CursoId");

            migrationBuilder.CreateIndex(
                name: "IX_GradeCurso_GradeEixoId",
                table: "GradeCurso",
                column: "GradeEixoId");

            migrationBuilder.CreateIndex(
                name: "IX_GradeEixo_EixoId",
                table: "GradeEixo",
                column: "EixoId");

            migrationBuilder.CreateIndex(
                name: "IX_GradeEixo_GradeId",
                table: "GradeEixo",
                column: "GradeId");

            migrationBuilder.CreateIndex(
                name: "IX_Semestre_GradeCursoId",
                table: "Semestre",
                column: "GradeCursoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Aula");

            migrationBuilder.DropTable(
                name: "Materia");

            migrationBuilder.DropTable(
                name: "Professores");

            migrationBuilder.DropTable(
                name: "Sala");

            migrationBuilder.DropTable(
                name: "Semestre");

            migrationBuilder.DropTable(
                name: "GradeCurso");

            migrationBuilder.DropTable(
                name: "Curso");

            migrationBuilder.DropTable(
                name: "GradeEixo");

            migrationBuilder.DropTable(
                name: "Eixo");
        }
    }
}
