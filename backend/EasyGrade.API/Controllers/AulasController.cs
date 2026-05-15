using Microsoft.AspNetCore.Mvc;
using EasyGrade.Infrastructure.Data;
using EasyGrade.Domain.Entities;
using EasyGrade.API.DTOs.Aulas;
using Microsoft.EntityFrameworkCore;
using EasyGrade.API.Services;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AulasController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ConflictService _conflictService;

    public AulasController(AppDbContext context, ConflictService conflictService)
    {
        _context = context;
        _conflictService = conflictService;
    }

    [HttpGet("semestre/{semestreId}")]
    public async Task<IActionResult> GetBySemestre(int semestreId)
    {
        var aulas = await _context.Aulas
            .AsNoTracking()
            .Include(a => a.Professor)
            .Include(a => a.Materia)
            .Include(a => a.Sala)
            .Where(a => a.SemestreId == semestreId)
            .ToListAsync();

        var aulaCompleta = await _context.Aulas
            .AsNoTracking()
            .Include(a => a.Professor)
            .Include(a => a.Materia)
            .Include(a => a.Sala)
            .FirstAsync(a => a.Id == aulas[0].Id);

        return Ok(aulaCompleta);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAulaDto dto)
    {
        var aula = new Aula
        {
            SemestreId = dto.SemestreId,
            Dia = dto.Dia,
            Hora = dto.Hora,
            ProfessorId = dto.ProfessorId,
            MateriaId = dto.MateriaId,
            SalaId = dto.SalaId
        };

        _context.Aulas.Add(aula);

        await _context.SaveChangesAsync();

        var gradeId = await _conflictService.GetGradeIdByAulaIdAsync(aula.Id);

        if (gradeId != null)
            await _conflictService.RecalculateGradeConflictsAsync(gradeId.Value);

        return Ok(aula);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Aulas.FindAsync(id);

        if (entity == null)
            return NotFound();

        var gradeId = await _conflictService.GetGradeIdByAulaIdAsync(entity.Id);

        _context.Aulas.Remove(entity);

        await _context.SaveChangesAsync();

        if (gradeId != null)
            await _conflictService.RecalculateGradeConflictsAsync(gradeId.Value);

        return NoContent();
    }
}
