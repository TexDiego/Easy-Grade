using EasyGrade.API.DTOs.Cursos;
using EasyGrade.Domain.Entities;
using EasyGrade.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CursosController : ControllerBase
{
    private readonly AppDbContext _context;

    public CursosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var cursos = await _context.Cursos
            .OrderBy(c => c.Id)
            .ToListAsync();

        return Ok(cursos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var curso = await _context.Cursos
            .FirstOrDefaultAsync(c => c.Id == id);

        if (curso == null)
            return NotFound();

        return Ok(curso);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCursoDto dto)
    {
        var curso = new Curso
        {
            Name = dto.Name
        };

        _context.Cursos.Add(curso);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = curso.Id },
            curso
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateCursoDto dto
    )
    {
        var curso = await _context.Cursos
            .FirstOrDefaultAsync(c => c.Id == id);

        if (curso == null)
            return NotFound();

        curso.Name = dto.Name;

        await _context.SaveChangesAsync();

        return Ok(curso);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var curso = await _context.Cursos
            .FirstOrDefaultAsync(c => c.Id == id);

        if (curso == null)
            return NotFound();

        _context.Cursos.Remove(curso);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}