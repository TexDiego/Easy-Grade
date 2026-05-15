using EasyGrade.API.DTOs.Semestres;

namespace EasyGrade.API.DTOs.Cursos;

public class GradeCursoFullDto
{
    public int Id { get; set; }

    public int? CursoId { get; set; }

    public string? CursoNome { get; set; }

    public List<SemestreFullDto> Semestres { get; set; } = [];
}