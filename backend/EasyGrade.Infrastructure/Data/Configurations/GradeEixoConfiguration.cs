using EasyGrade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EasyGrade.Infrastructure.Data.Configurations;

public class GradeEixoConfiguration : IEntityTypeConfiguration<GradeEixo>
{
    public void Configure(EntityTypeBuilder<GradeEixo> builder)
    {
        builder.ToTable("grade_eixos");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.Id)
            .HasColumnName("id");

        builder.Property(g => g.GradeId)
            .HasColumnName("grade_id");

        builder.Property(g => g.EixoId)
            .HasColumnName("eixo_id");

        builder.HasOne(g => g.Grade)
            .WithMany(g => g.Eixos)
            .HasForeignKey(g => g.GradeId);

        builder.HasOne(g => g.Eixo)
            .WithMany()
            .HasForeignKey(g => g.EixoId);
    }
}