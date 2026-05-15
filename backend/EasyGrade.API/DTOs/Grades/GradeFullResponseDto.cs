using EasyGrade.API.DTOs.Eixos;
using EasyGrade.API.DTOs.Conflitos;

namespace EasyGrade.API.DTOs.Grades;

public class GradeFullResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public List<GradeEixoFullDto> Eixos { get; set; } = [];

    public List<ConflitoResponseDto> Conflitos { get; set; } = [];
}
