using EasyGrade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EasyGrade.Infrastructure.Data.Configurations;

public class SemestreConfiguration : IEntityTypeConfiguration<Semestre>
{
    public void Configure(EntityTypeBuilder<Semestre> builder)
    {
        builder.ToTable("semestres");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
                .HasColumnName("id");

        builder.Property(s => s.Numero)
            .HasColumnName("numero");

        builder.Property(s => s.GradeCursoId)
            .HasColumnName("grade_curso_id");

        builder.HasOne(s => s.GradeCurso)
            .WithMany(gc => gc.Semestres)
            .HasForeignKey(s => s.GradeCursoId);

        builder.HasMany(s => s.Aulas)
            .WithOne(a => a.Semestre)
            .HasForeignKey(a => a.SemestreId);
    }
}