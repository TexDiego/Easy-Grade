using EasyGrade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EasyGrade.Infrastructure.Data.Configurations;

public class GradeCursoConfiguration : IEntityTypeConfiguration<GradeCurso>
{
    public void Configure(EntityTypeBuilder<GradeCurso> builder)
    {
        builder.ToTable("grade_cursos");

        builder.HasKey(g => g.Id);

        builder.Property(e => e.Id)
                .HasColumnName("id");

        builder.Property(e => e.GradeEixoId)
            .HasColumnName("grade_eixo_id");

        builder.Property(e => e.CursoId)
            .HasColumnName("curso_id");

        builder.HasOne(e => e.GradeEixo)
            .WithMany(g => g.Cursos)
            .HasForeignKey(e => e.GradeEixoId);

        builder.HasOne(e => e.Curso)
            .WithMany(c => c.GradeCursos)
            .HasForeignKey(e => e.CursoId);

        builder.HasMany(c => c.Semestres)
        .WithOne(s => s.GradeCurso)
        .HasForeignKey(s => s.GradeCursoId);
    }
}