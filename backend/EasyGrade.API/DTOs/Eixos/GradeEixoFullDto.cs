using EasyGrade.API.DTOs.Cursos;

namespace EasyGrade.API.DTOs.Eixos;

public class GradeEixoFullDto
{
    public int Id { get; set; }

    public int? EixoId { get; set; }

    public string? EixoNome { get; set; }

    public List<GradeCursoFullDto> Cursos { get; set; } = [];
}