namespace EasyGrade.Domain.Entities;

public class Aula
{
    public int Id { get; set; }

    public int SemestreId { get; set; }

    public string Dia { get; set; } = string.Empty;

    public string Hora { get; set; } = string.Empty;

    public int? ProfessorId { get; set; }

    public int? MateriaId { get; set; }

    public int? SalaId { get; set; }

    public Semestre Semestre { get; set; } = null!;

    public Professor? Professor { get; set; }

    public Materia? Materia { get; set; }

    public Sala? Sala { get; set; }
}