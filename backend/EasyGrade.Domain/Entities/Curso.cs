namespace EasyGrade.Domain.Entities;

public class Curso
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<GradeCurso> GradeCursos { get; set; } = [];
}