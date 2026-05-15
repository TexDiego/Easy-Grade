namespace EasyGrade.Domain.Entities;

public class Sala
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<Aula> Aulas { get; set; } = [];
}