using EasyGrade.API.DTOs.Aulas;

namespace EasyGrade.API.DTOs.Semestres;

public class SemestreFullDto
{
    public int Id { get; set; }

    public int Numero { get; set; }

    public List<AulaResponseDto> Aulas { get; set; } = [];
}