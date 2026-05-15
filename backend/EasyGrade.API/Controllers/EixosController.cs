using EasyGrade.API.DTOs.Eixos;
using EasyGrade.Domain.Entities;
using EasyGrade.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EixosController : ControllerBase
{
    private readonly AppDbContext _context;

    public EixosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var eixos = await _context.Eixos
            .OrderBy(e => e.Id)
            .ToListAsync();

        return Ok(eixos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var eixo = await _context.Eixos
            .FirstOrDefaultAsync(e => e.Id == id);

        if (eixo == null)
            return NotFound();

        return Ok(eixo);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEixoDto dto)
    {
        var eixo = new Eixo
        {
            Name = dto.Name
        };

        _context.Eixos.Add(eixo);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = eixo.Id },
            eixo
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateEixoDto dto
    )
    {
        var eixo = await _context.Eixos
            .FirstOrDefaultAsync(e => e.Id == id);

        if (eixo == null)
            return NotFound();

        eixo.Name = dto.Name;

        await _context.SaveChangesAsync();

        return Ok(eixo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var eixo = await _context.Eixos
            .FirstOrDefaultAsync(e => e.Id == id);

        if (eixo == null)
            return NotFound();

        _context.Eixos.Remove(eixo);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}