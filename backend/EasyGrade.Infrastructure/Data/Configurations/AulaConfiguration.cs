using EasyGrade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EasyGrade.Infrastructure.Data.Configurations;

public class AulaConfiguration : IEntityTypeConfiguration<Aula>
{
    public void Configure(EntityTypeBuilder<Aula> builder)
    {
        builder.ToTable("aulas");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
                .HasColumnName("id");

        builder.Property(a => a.SemestreId)
            .HasColumnName("semestre_id");

        builder.Property(a => a.Dia)
            .HasColumnName("dia");

        builder.Property(a => a.Hora)
            .HasColumnName("hora");

        builder.Property(a => a.ProfessorId)
            .HasColumnName("professor_id");

        builder.Property(a => a.MateriaId)
            .HasColumnName("materia_id");

        builder.Property(a => a.SalaId)
            .HasColumnName("sala_id");

        builder.HasOne(a => a.Semestre)
            .WithMany()
            .HasForeignKey(a => a.SemestreId);

        builder.HasOne(a => a.Professor)
            .WithMany(p => p.Aulas)
            .HasForeignKey(a => a.ProfessorId);

        builder.HasOne(a => a.Materia)
            .WithMany(m => m.Aulas)
            .HasForeignKey(a => a.MateriaId);

        builder.HasOne(a => a.Sala)
            .WithMany(s => s.Aulas)
            .HasForeignKey(a => a.SalaId);
    }
}