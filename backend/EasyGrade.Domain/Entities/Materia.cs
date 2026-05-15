namespace EasyGrade.Domain.Entities;

public class Materia
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<Aula> Aulas { get; set; } = [];
}