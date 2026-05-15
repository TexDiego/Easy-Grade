namespace EasyGrade.Domain.Entities;

public class Semestre
{
    public int Id { get; set; }

    public int GradeCursoId { get; set; }

    public int Numero { get; set; }

    public GradeCurso GradeCurso { get; set; } = null!;

    public ICollection<Aula> Aulas { get; set; } = [];
}