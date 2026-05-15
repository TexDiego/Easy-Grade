using EasyGrade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EasyGrade.Infrastructure.Data.Configurations;

public class ConflitoConfiguration : IEntityTypeConfiguration<Conflito>
{
    public void Configure(EntityTypeBuilder<Conflito> builder)
    {
        builder.ToTable("conflitos");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("id");

        builder.Property(c => c.GradeId)
            .HasColumnName("grade_id");

        builder.Property(c => c.AulaId)
            .HasColumnName("aula_id");

        builder.Property(c => c.AulaConflitanteId)
            .HasColumnName("aula_conflitante_id");

        builder.Property(c => c.Tipo)
            .HasColumnName("tipo")
            .HasMaxLength(20);

        builder.Property(c => c.Dia)
            .HasColumnName("dia")
            .HasMaxLength(30);

        builder.Property(c => c.Hora)
            .HasColumnName("hora")
            .HasMaxLength(20);

        builder.HasIndex(c => c.GradeId);

        builder.HasIndex(c => c.AulaId);

        builder.HasIndex(c => c.AulaConflitanteId);

        builder.HasIndex(c => new
            {
                c.GradeId,
                c.AulaId,
                c.AulaConflitanteId,
                c.Tipo
            })
            .IsUnique();

        builder.HasOne(c => c.Grade)
            .WithMany()
            .HasForeignKey(c => c.GradeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Aula)
            .WithMany()
            .HasForeignKey(c => c.AulaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.AulaConflitante)
            .WithMany()
            .HasForeignKey(c => c.AulaConflitanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
