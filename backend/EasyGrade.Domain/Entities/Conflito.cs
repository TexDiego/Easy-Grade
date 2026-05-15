namespace EasyGrade.Domain.Entities;

public class Conflito
{
    public int Id { get; set; }

    public int GradeId { get; set; }

    public int AulaId { get; set; }

    public int AulaConflitanteId { get; set; }

    public string Tipo { get; set; } = string.Empty;

    public string Dia { get; set; } = string.Empty;

    public string Hora { get; set; } = string.Empty;

    public Grade Grade { get; set; } = null!;

    public Aula Aula { get; set; } = null!;

    public Aula AulaConflitante { get; set; } = null!;
}
