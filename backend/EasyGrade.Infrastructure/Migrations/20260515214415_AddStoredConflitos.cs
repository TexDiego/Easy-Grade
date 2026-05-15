using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EasyGrade.Infrastructure.Migrations
{
    public partial class AddStoredConflitos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "conflitos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    grade_id = table.Column<int>(type: "integer", nullable: false),
                    aula_id = table.Column<int>(type: "integer", nullable: false),
                    aula_conflitante_id = table.Column<int>(type: "integer", nullable: false),
                    tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    dia = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    hora = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_conflitos", x => x.id);
                    table.ForeignKey(
                        name: "FK_conflitos_aulas_aula_conflitante_id",
                        column: x => x.aula_conflitante_id,
                        principalTable: "aulas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_conflitos_aulas_aula_id",
                        column: x => x.aula_id,
                        principalTable: "aulas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_conflitos_grades_grade_id",
                        column: x => x.grade_id,
                        principalTable: "grades",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_conflitos_aula_conflitante_id",
                table: "conflitos",
                column: "aula_conflitante_id");

            migrationBuilder.CreateIndex(
                name: "IX_conflitos_aula_id",
                table: "conflitos",
                column: "aula_id");

            migrationBuilder.CreateIndex(
                name: "IX_conflitos_grade_id",
                table: "conflitos",
                column: "grade_id");

            migrationBuilder.CreateIndex(
                name: "IX_conflitos_grade_id_aula_id_aula_conflitante_id_tipo",
                table: "conflitos",
                columns: new[] { "grade_id", "aula_id", "aula_conflitante_id", "tipo" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "conflitos");
        }
    }
}
