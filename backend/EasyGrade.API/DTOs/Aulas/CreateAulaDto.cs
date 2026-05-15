namespace EasyGrade.API.DTOs.Aulas;

public class CreateAulaDto
{
    public int SemestreId { get; set; }

    public string Dia { get; set; } = string.Empty;

    public string Hora { get; set; } = string.Empty;

    public int? ProfessorId { get; set; }

    public int? MateriaId { get; set; }

    public int? SalaId { get; set; }
}