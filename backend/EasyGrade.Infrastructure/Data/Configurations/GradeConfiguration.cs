using EasyGrade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EasyGrade.Infrastructure.Data.Configurations;

public class GradeConfiguration : IEntityTypeConfiguration<Grade>
{
    public void Configure(EntityTypeBuilder<Grade> builder)
    {
        builder.ToTable("grades");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.Id)
            .HasColumnName("id");

        builder.Property(g => g.Name)
            .HasColumnName("name");

        builder.HasMany(g => g.Eixos)
            .WithOne(e => e.Grade)
            .HasForeignKey(e => e.GradeId);
    }
}