using EasyGrade.API.DTOs.Professores;
using EasyGrade.Domain.Entities;
using EasyGrade.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfessoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfessoresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var professores = await _context.Professores
            .OrderBy(p => p.Id)
            .ToListAsync();

        return Ok(professores);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var professor = await _context.Professores
            .FirstOrDefaultAsync(p => p.Id == id);

        if (professor == null)
            return NotFound();

        return Ok(professor);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProfessorDto dto)
    {
        var professor = new Professor
        {
            Name = dto.Name
        };

        _context.Professores.Add(professor);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = professor.Id },
            professor
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateProfessorDto dto
    )
    {
        var professor = await _context.Professores
            .FirstOrDefaultAsync(p => p.Id == id);

        if (professor == null)
            return NotFound();

        professor.Name = dto.Name;

        await _context.SaveChangesAsync();

        return Ok(professor);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var professor = await _context.Professores
            .FirstOrDefaultAsync(p => p.Id == id);

        if (professor == null)
            return NotFound();

        _context.Professores.Remove(professor);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}