namespace EasyGrade.API.DTOs.GradeEixo;

public class GradeEixoResponseDto
{
    public int Id { get; set; }

    public int GradeId { get; set; }

    public int? EixoId { get; set; }

    public string? EixoNome { get; set; }
}