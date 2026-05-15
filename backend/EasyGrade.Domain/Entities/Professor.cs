namespace EasyGrade.Domain.Entities;

public class Professor
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<Aula> Aulas { get; set; } = [];
}