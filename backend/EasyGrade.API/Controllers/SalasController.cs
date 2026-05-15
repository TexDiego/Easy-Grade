using EasyGrade.API.DTOs.Salas;
using EasyGrade.Domain.Entities;
using EasyGrade.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalasController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var salas = await _context.Salas
            .OrderBy(s => s.Id)
            .ToListAsync();

        return Ok(salas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var sala = await _context.Salas
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sala == null)
            return NotFound();

        return Ok(sala);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateSalaDto dto)
    {
        var sala = new Sala
        {
            Name = dto.Name
        };

        _context.Salas.Add(sala);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = sala.Id },
            sala
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateSalaDto dto
    )
    {
        var sala = await _context.Salas
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sala == null)
            return NotFound();

        sala.Name = dto.Name;

        await _context.SaveChangesAsync();

        return Ok(sala);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sala = await _context.Salas
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sala == null)
            return NotFound();

        _context.Salas.Remove(sala);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}