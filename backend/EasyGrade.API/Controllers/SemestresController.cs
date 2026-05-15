using Microsoft.AspNetCore.Mvc;
using EasyGrade.Infrastructure.Data;
using EasyGrade.Domain.Entities;
using EasyGrade.API.DTOs.Semestres;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SemestresController : ControllerBase
{
    private readonly AppDbContext _context;

    public SemestresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("gradecurso/{gradeCursoId}")]
    public async Task<IActionResult> GetByGradeCurso(int gradeCursoId)
    {
        var semestres = await _context.Semestres
            .Where(s => s.GradeCursoId == gradeCursoId)
            .OrderBy(s => s.Numero)
            .ToListAsync();

        return Ok(semestres);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateSemestreDto dto)
    {
        var semestre = new Semestre
        {
            GradeCursoId = dto.GradeCursoId,
            Numero = dto.Numero,
        };

        _context.Semestres.Add(semestre);

        await _context.SaveChangesAsync();

        return Ok(semestre);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Semestres.FindAsync(id);

        if (entity == null)
            return NotFound();

        _context.Semestres.Remove(entity);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}