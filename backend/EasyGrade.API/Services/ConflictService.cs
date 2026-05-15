using EasyGrade.Domain.Entities;
using EasyGrade.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyGrade.API.Services;

public class ConflictService
{
    private readonly AppDbContext _context;

    public ConflictService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int?> GetGradeIdByAulaIdAsync(int aulaId)
    {
        return await _context.Aulas
            .Where(a => a.Id == aulaId)
            .Select(a => (int?)a.Semestre.GradeCurso.GradeEixo.GradeId)
            .FirstOrDefaultAsync();
    }

    public async Task RecalculateGradeConflictsAsync(int gradeId)
    {
        var existing = await _context.Conflitos
            .Where(c => c.GradeId == gradeId)
            .ToListAsync();

        _context.Conflitos.RemoveRange(existing);

        if (existing.Count > 0)
            await _context.SaveChangesAsync();

        var aulas = await _context.Aulas
            .Include(a => a.Semestre)
                .ThenInclude(s => s.GradeCurso)
                    .ThenInclude(gc => gc.GradeEixo)
            .Where(a => a.Semestre.GradeCurso.GradeEixo.GradeId == gradeId)
            .ToListAsync();

        var novosConflitos = aulas
            .GroupBy(a => new
            {
                Dia = NormalizeDay(a.Dia),
                a.Hora
            })
            .SelectMany(group => BuildConflictsForGroup(gradeId, group.Key.Dia, group.Key.Hora, group.ToList()))
            .ToList();

        _context.Conflitos.AddRange(novosConflitos);

        await _context.SaveChangesAsync();
    }

    private static IEnumerable<Conflito> BuildConflictsForGroup(
        int gradeId,
        string dia,
        string hora,
        List<Aula> aulas)
    {
        var keys = new HashSet<string>();

        for (var i = 0; i < aulas.Count; i++)
        {
            for (var j = i + 1; j < aulas.Count; j++)
            {
                var aulaA = aulas[i];
                var aulaB = aulas[j];

                if (HasProfessorConflict(aulaA, aulaB)
                    && TryCreateConflict(gradeId, dia, hora, aulaA.Id, aulaB.Id, "professor", keys, out var professorConflict))
                {
                    yield return professorConflict;
                }

                if (HasSalaConflict(aulaA, aulaB)
                    && TryCreateConflict(gradeId, dia, hora, aulaA.Id, aulaB.Id, "sala", keys, out var salaConflict))
                {
                    yield return salaConflict;
                }
            }
        }
    }

    private static bool HasProfessorConflict(Aula aulaA, Aula aulaB)
    {
        if (aulaA.ProfessorId == null || aulaB.ProfessorId == null)
            return false;

        if (aulaA.ProfessorId != aulaB.ProfessorId)
            return false;

        return aulaA.SalaId != aulaB.SalaId || aulaA.MateriaId != aulaB.MateriaId;
    }

    private static bool HasSalaConflict(Aula aulaA, Aula aulaB)
    {
        if (aulaA.SalaId == null || aulaB.SalaId == null)
            return false;

        if (aulaA.SalaId != aulaB.SalaId)
            return false;

        return aulaA.ProfessorId != aulaB.ProfessorId || aulaA.MateriaId != aulaB.MateriaId;
    }

    private static bool TryCreateConflict(
        int gradeId,
        string dia,
        string hora,
        int aulaAId,
        int aulaBId,
        string tipo,
        HashSet<string> keys,
        out Conflito conflito)
    {
        var firstId = Math.Min(aulaAId, aulaBId);
        var secondId = Math.Max(aulaAId, aulaBId);
        var key = $"{firstId}:{secondId}:{tipo}";

        if (!keys.Add(key))
        {
            conflito = null!;
            return false;
        }

        conflito = new Conflito
        {
            GradeId = gradeId,
            AulaId = firstId,
            AulaConflitanteId = secondId,
            Tipo = tipo,
            Dia = dia,
            Hora = hora
        };

        return true;
    }

    private static string NormalizeDay(string day)
    {
        return day switch
        {
            "Seg" => "Segunda-Feira",
            "Ter" => "Terça-Feira",
            "Qua" => "Quarta-Feira",
            "Qui" => "Quinta-Feira",
            "Sex" => "Sexta-Feira",
            "Sab" => "Sábado",
            "Sáb" => "Sábado",
            "SÃ¡b" => "Sábado",
            _ => day
        };
    }
}
