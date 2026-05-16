using EasyGrade.API.DTOs.Grades;
using EasyGrade.Domain.Entities;
using EasyGrade.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradesController : ControllerBase
{
    private readonly AppDbContext _context;

    public GradesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var grades = await _context.Grades.ToListAsync();

        return Ok(grades);
    }

    [HttpGet("{id}/full")]
    public async Task<IActionResult> GetFull(int id)
    {
        var grade = await _context.Grades
            .AsNoTracking()
            .Where(g => g.Id == id)
            .Select(g => new GradeFullResponseDto
            {
                Id = g.Id,
                Name = g.Name,
                Conflitos = _context.Conflitos
                    .Where(c => c.GradeId == g.Id)
                    .OrderBy(c => c.Id)
                    .Select(c => new DTOs.Conflitos.ConflitoResponseDto
                    {
                        Id = c.Id,
                        GradeId = c.GradeId,
                        AulaId = c.AulaId,
                        AulaConflitanteId = c.AulaConflitanteId,
                        Tipo = c.Tipo,
                        Dia = c.Dia,
                        Hora = c.Hora
                    })
                    .ToList(),
                Eixos = g.Eixos
                    .OrderBy(ge => ge.Id)
                    .Select(ge => new DTOs.Eixos.GradeEixoFullDto
                    {
                        Id = ge.Id,
                        EixoId = ge.EixoId,
                        EixoNome = ge.Eixo != null ? ge.Eixo.Name : null,
                        Cursos = ge.Cursos
                            .OrderBy(gc => gc.Id)
                            .Select(gc => new DTOs.Cursos.GradeCursoFullDto
                            {
                                Id = gc.Id,
                                CursoId = gc.CursoId,
                                CursoNome = gc.Curso != null ? gc.Curso.Name : null,
                                Semestres = gc.Semestres
                                    .OrderBy(s => s.Numero)
                                    .Select(s => new DTOs.Semestres.SemestreFullDto
                                    {
                                        Id = s.Id,
                                        Numero = s.Numero,
                                        Aulas = s.Aulas
                                            .OrderBy(a => a.Dia)
                                            .ThenBy(a => a.Hora)
                                            .Select(a => new DTOs.Aulas.AulaResponseDto
                                            {
                                                Id = a.Id,
                                                SemestreId = a.SemestreId,
                                                Dia = a.Dia,
                                                Hora = a.Hora,
                                                ProfessorId = a.ProfessorId,
                                                MateriaId = a.MateriaId,
                                                SalaId = a.SalaId,
                                                ProfessorNome = a.Professor != null ? a.Professor.Name : null,
                                                MateriaNome = a.Materia != null ? a.Materia.Name : null,
                                                SalaNome = a.Sala != null ? a.Sala.Name : null
                                            })
                                            .ToList()
                                    })
                                    .ToList()
                            })
                            .ToList()
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (grade == null)
            return NotFound();

        return Ok(grade);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateGradeDto dto)
    {
        var grade = new Grade
        {
            Name = dto.Name
        };

        _context.Grades.Add(grade);

        await _context.SaveChangesAsync();

        return Ok(grade);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Grades
            .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null)
            return NotFound();

        _context.Grades.Remove(entity);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}