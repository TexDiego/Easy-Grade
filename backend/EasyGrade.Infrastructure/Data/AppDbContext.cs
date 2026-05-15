using Microsoft.EntityFrameworkCore;
using EasyGrade.Domain.Entities;

namespace EasyGrade.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Grade> Grades => Set<Grade>();

    public DbSet<Professor> Professores => Set<Professor>();
    public DbSet<Materia> Materias => Set<Materia>();
    public DbSet<Sala> Salas => Set<Sala>();
    public DbSet<Curso> Cursos => Set<Curso>();
    public DbSet<Eixo> Eixos => Set<Eixo>();
    public DbSet<GradeEixo> GradeEixos => Set<GradeEixo>();
    public DbSet<GradeCurso> GradeCursos => Set<GradeCurso>();
    public DbSet<Semestre> Semestres => Set<Semestre>();
    public DbSet<Aula> Aulas => Set<Aula>();
    public DbSet<Conflito> Conflitos => Set<Conflito>();
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly
        );

        base.OnModelCreating(modelBuilder);
    }
}
