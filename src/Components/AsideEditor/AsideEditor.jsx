import "./AsideEditor.css";
import { useData } from "../../Context/DataContext";

function AsideEditor({ selectedCell, onChange, onSave, onClose, conflicts, grade }) {

  const { professores, salas, materias } = useData();

  if (!selectedCell) return null;

  return (
    <aside className={`aside ${selectedCell ? "open" : ""}`}>
      <h3>Editar Aula</h3>

      <p>
        <strong>{selectedCell.dia}</strong> - {selectedCell.hora}
      </p>

      <select
        value={selectedCell.materiaId || ""}
        onChange={(e) =>
          onChange({ ...selectedCell, materiaId: e.target.value })}>
        <option value="">Selecione a matéria</option>
        {materias.map(m => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </select>

      <select
        value={selectedCell.professorId || ""}
        onChange={(e) =>
          onChange({ ...selectedCell, professorId: e.target.value })}>
        <option value="">Selecione o professor</option>
        {professores.map(p => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>

      <select
        value={selectedCell.salaId || ""}
        onChange={(e) =>
          onChange({ ...selectedCell, salaId: e.target.value })}>
        <option value="">Selecione a sala</option>
        {salas.map(s => (
          <option key={s.id} value={s.id}>
            {s.nome}
          </option>
        ))}
      </select>

      <button className="save" onClick={() => onSave(selectedCell)}>
        Salvar
      </button>

      <button className="close" onClick={onClose}>
        Fechar
      </button>

      <hr />

      {conflicts?.length > 0 && (
        <div className="conflicts">
          <h4>Conflitos detectados:</h4>

          {conflicts.map((c, index) => {
            const eixo = grade.grades.find(e => e.id === c.eixoId);
            const curso = eixo?.cursos.find(cu => cu.id === c.cursoId);
            const semestre = curso?.semestres.find(s => s.id === c.semestreId);

            return (
              <div key={index} className="conflict-item">
                <strong className="conflict-type">
                  {c.tipo === "professor" ? "Conflito de professor" : "Conflito de sala"}
                </strong>

                <label>Eixo</label>
                <p>{eixo?.nome}</p>
                <label>Curso</label>
                <p>{curso?.nome}</p>
                <label>Período</label>
                <p>{semestre?.numero}° Semestre</p>
                <label>Dia/Hora</label>
                <p>{c.dia} → {c.hora}</p>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}

export default AsideEditor;