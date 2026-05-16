using EasyGrade.API.DTOs.Dashboard;
using EasyGrade.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = new DashboardSummaryDto
        {
            Grades = await _context.Grades.CountAsync(),
            Cursos = await _context.Cursos.CountAsync(),
            Professores = await _context.Professores.CountAsync(),
            Salas = await _context.Salas.CountAsync(),
            Materias = await _context.Materias.CountAsync(),
            Eixos = await _context.Eixos.CountAsync()
        };

        return Ok(summary);
    }
}