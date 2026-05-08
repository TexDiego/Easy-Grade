import "./AsideEditor.css";
import { useEffect } from "react";
import { useData } from "../../Context/DataContext";

function AsideEditor({ selectedCell, onChange, onSave, onClose, conflicts, grade }) {

  const { professores, setProfessores, salas, setSalas, materias, setMaterias } = useData();

  useEffect(() => {
    if (!selectedCell) return;

    async function loadData() {
      try {
        const [profRes, salasRes, matRes] = await Promise.all([
          fetch("http://localhost:3000/professores"),
          fetch("http://localhost:3000/salas"),
          fetch("http://localhost:3000/materias")
        ]);

        const professoresData = await profRes.json();
        const salasData = await salasRes.json();
        const materiasData = await matRes.json();

        setProfessores(professoresData);
        setSalas(salasData);
        setMaterias(materiasData);

      } catch (err) {
        console.error("Erro ao carregar dados do aside:", err);
      }
    }

    loadData();
  }, [selectedCell]);

  if (!selectedCell) return null;

  return (
    <aside className={`aside ${selectedCell ? "open" : ""}`}>
      <h3>Editar Aula</h3>

      <p>
        <strong>{selectedCell.dia}</strong> - {selectedCell.hora}
      </p>

      <select
        value={selectedCell.materia_id || ""}
        onChange={(e) =>
          onChange({ ...selectedCell, materia_id: e.target.value })}>
        <option value="">Selecione a matéria</option>
        {materias.map(m => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <select
        value={selectedCell.professor_id || ""}
        onChange={(e) =>
          onChange({ ...selectedCell, professor_id: e.target.value })}>
        <option value="">Selecione o professor</option>
        {professores.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        value={selectedCell.sala_id || ""}
        onChange={(e) =>
          onChange({ ...selectedCell, sala_id: e.target.value })}>
        <option value="">Selecione a sala</option>
        {salas.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
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
            const eixo = grade.grades.find(e => e.id === c.eixo_id);
            const curso = eixo?.cursos.find(cu => cu.id === c.curso_id);
            const semestre = curso?.semestres.find(s => s.id === c.semestre_id);

            return (
              <div key={index} className="conflict-item">
                <strong className="conflict-type">
                  {c.tipo === "professor" ? "Conflito de professor" : "Conflito de sala"}
                </strong>

                <label>Eixo</label>
                <p>{eixo?.name}</p>
                <label>Curso</label>
                <p>{curso?.name}</p>
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