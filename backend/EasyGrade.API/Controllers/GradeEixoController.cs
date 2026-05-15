using Microsoft.AspNetCore.Mvc;
using EasyGrade.Infrastructure.Data;
using EasyGrade.Domain.Entities;
using EasyGrade.API.DTOs.GradeEixo;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradeEixoController : ControllerBase
{
    private readonly AppDbContext _context;

    public GradeEixoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateGradeEixoDto dto)
    {
        var gradeEixo = new GradeEixo
        {
            GradeId = dto.GradeId,
            EixoId = dto.EixoId
        };

        _context.GradeEixos.Add(gradeEixo);

        await _context.SaveChangesAsync();

        return Ok(gradeEixo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateGradeEixoDto dto)
    {
        var entity = await _context.GradeEixos.FindAsync(id);

        if (entity == null)
            return NotFound();

        entity.EixoId = dto.EixoId;

        await _context.SaveChangesAsync();

        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.GradeEixos.FindAsync(id);

        if (entity == null)
            return NotFound();

        _context.GradeEixos.Remove(entity);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
