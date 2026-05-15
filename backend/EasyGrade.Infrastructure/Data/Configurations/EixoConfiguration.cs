using EasyGrade.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EasyGrade.Infrastructure.Data.Configurations;

public class EixoConfiguration : IEntityTypeConfiguration<Eixo>
{
    public void Configure(EntityTypeBuilder<Eixo> builder)
    {
        builder.ToTable("eixos");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.Name)
            .HasColumnName("name");
    }
}