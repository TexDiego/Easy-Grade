namespace EasyGrade.Domain.Entities;

public class GradeCurso
{
    public int Id { get; set; }

    public int GradeEixoId { get; set; }

    public int? CursoId { get; set; }

    public GradeEixo GradeEixo { get; set; } = null!;

    public Curso? Curso { get; set; }

    public ICollection<Semestre> Semestres { get; set; } = [];
}