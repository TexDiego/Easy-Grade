using EasyGrade.API.DTOs.GradeEixo;

namespace EasyGrade.API.DTOs.Grades;

public class GradeResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public List<GradeEixoResponseDto> Eixos { get; set; } = [];
}