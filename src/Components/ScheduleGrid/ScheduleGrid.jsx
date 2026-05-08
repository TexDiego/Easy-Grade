import "./ScheduleGrid.css"
import { useEffect } from "react"

function ScheduleGrid({ selectedCell, 
                        onSelectCell, 
                        isEdit, 
                        contexto, 
                        aulas, 
                        conflitos,
                        professores,
                        materias,
                        salas }) 
  {
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const horarios = ["19:30 - 21:10", "21:20 - 23:00"];

  useEffect(() => {
    const textareas = document.querySelectorAll(".input");
    textareas.forEach((textarea) => {
      const handleInput = () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      };
      textarea.addEventListener("input", handleInput);
      return () => textarea.removeEventListener("input", handleInput);
    });
  }, [isEdit]);

  return (
    <div>
      <table border="1" className="table">
        <thead>
          <tr>
            <th>Horário</th>
            {dias.map((dia) => (
              <th key={dia}>{dia}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {horarios.map((hora) => (
            <tr key={hora}>
              <td>{hora}</td>

              {dias.map((dia) => {
                const isSelected =
                  selectedCell?.dia === dia &&
                  selectedCell?.hora === hora &&
                  selectedCell?.eixo_id === contexto.eixo_id &&
                  selectedCell?.curso_id === contexto.curso_id &&
                  selectedCell?.semestre_id === contexto.semestre_id;

                const hasConflict = conflitos.some(c =>
                  c.dia === dia &&
                  c.hora === hora &&
                  c.eixo_id === contexto.eixo_id &&
                  c.curso_id === contexto.curso_id &&
                  c.semestre_id === contexto.semestre_id
                );

                const aula = aulas?.find(
                  a => a.dia === dia && a.hora === hora
                );
  
                const professor = professores.find(p => p.id === aula?.professor_id)?.name;
                const materia = materias.find(m => m.id === aula?.materia_id)?.name;
                const sala = salas.find(s => s.id === aula?.sala_id)?.name;

                return (
                  <td
                    key={`${dia}-${hora}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCell({
                        ...contexto,
                        dia,
                        hora,
                        professor_id: aula?.professor_id,
                        materia_id: aula?.materia_id,
                        sala_id: aula?.sala_id
                      });
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: hasConflict
                        ? (isSelected ? "#f87171" : "#fca5a5") // vermelho
                        : (isSelected ? "#dbeafe" : "white"),
                      transition: "background-color 0.3s"
                    }}>
                    <div>
                      {aula ? (
                        <>
                          <div className="cell">{materia}</div>
                          <div className="cell">{professor}</div>
                          <div className="cell">{sala}</div>
                        </>
                      ) : (
                        <>
                          <label className="cell">Aula</label>
                          <label className="cell">Professor</label>
                          <label className="cell">Sala</label>
                        </>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleGrid;