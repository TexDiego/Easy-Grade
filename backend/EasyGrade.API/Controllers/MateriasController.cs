using EasyGrade.API.DTOs.Materias;
using EasyGrade.Domain.Entities;
using EasyGrade.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MateriasController : ControllerBase
{
    private readonly AppDbContext _context;

    public MateriasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var materias = await _context.Materias
            .OrderBy(m => m.Id)
            .ToListAsync();

        return Ok(materias);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var materia = await _context.Materias
            .FirstOrDefaultAsync(m => m.Id == id);

        if (materia == null)
            return NotFound();

        return Ok(materia);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateMateriaDto dto)
    {
        var materia = new Materia
        {
            Name = dto.Name
        };

        _context.Materias.Add(materia);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = materia.Id },
            materia
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateMateriaDto dto
    )
    {
        var materia = await _context.Materias
            .FirstOrDefaultAsync(m => m.Id == id);

        if (materia == null)
            return NotFound();

        materia.Name = dto.Name;

        await _context.SaveChangesAsync();

        return Ok(materia);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var materia = await _context.Materias
            .FirstOrDefaultAsync(m => m.Id == id);

        if (materia == null)
            return NotFound();

        _context.Materias.Remove(materia);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}