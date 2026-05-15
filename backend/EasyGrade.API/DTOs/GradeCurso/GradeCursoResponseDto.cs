namespace EasyGrade.API.DTOs.GradeCurso;

public class GradeCursoResponseDto
{
    public int Id { get; set; }

    public int GradeEixoId { get; set; }

    public int? CursoId { get; set; }

    public string? CursoNome { get; set; }
}