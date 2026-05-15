namespace EasyGrade.Domain.Entities;

public class GradeEixo
{
    public int Id { get; set; }

    public int GradeId { get; set; }

    public int? EixoId { get; set; }

    public Grade Grade { get; set; } = null!;

    public Eixo? Eixo { get; set; }

    public ICollection<GradeCurso> Cursos { get; set; } = [];
}