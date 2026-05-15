using Microsoft.AspNetCore.Mvc;
using EasyGrade.Infrastructure.Data;
using EasyGrade.Domain.Entities;
using EasyGrade.API.DTOs.GradeCurso;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradeCursoController : ControllerBase
{
    private readonly AppDbContext _context;

    public GradeCursoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateGradeCursoDto dto)
    {
        var gradeCurso = new GradeCurso
        {
            GradeEixoId = dto.GradeEixoId,
            CursoId = dto.CursoId,
        };

        _context.GradeCursos.Add(gradeCurso);

        await _context.SaveChangesAsync();

        return Ok(gradeCurso);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateGradeCursoDto dto)
    {
        var entity = await _context.GradeCursos.FindAsync(id);

        if (entity == null)
            return NotFound();

        entity.CursoId = dto.CursoId;

        await _context.SaveChangesAsync();

        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.GradeCursos.FindAsync(id);

        if (entity == null)
            return NotFound();

        _context.GradeCursos.Remove(entity);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
