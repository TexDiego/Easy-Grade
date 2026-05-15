import "./AsideEditor.css";
import { useEffect } from "react";
import { useData } from "../../Context/DataContext";
import DataService from "../../Services/DataService";

function AsideEditor({ selectedCell, onChange, onSave, onClose, conflicts }) {
  const { professores, setProfessores, salas, setSalas, materias, setMaterias } = useData();

  useEffect(() => {
    if (!selectedCell) return;

    async function loadData() {
      try {
        const [professoresData, salasData, materiasData] = await Promise.all([
          DataService.getProfessores(),
          DataService.getSalas(),
          DataService.getMaterias()
        ]);

        setProfessores(professoresData);
        setSalas(salasData);
        setMaterias(materiasData);
      } catch (err) {
        console.error("Erro ao carregar dados do aside:", err);
      }
    }

    loadData();
  }, [selectedCell, setMaterias, setProfessores, setSalas]);

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
          onChange({ ...selectedCell, materia_id: e.target.value ? Number(e.target.value) : null })}>
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
          onChange({ ...selectedCell, professor_id: e.target.value ? Number(e.target.value) : null })}>
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
          onChange({ ...selectedCell, sala_id: e.target.value ? Number(e.target.value) : null })}>
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

          {conflicts.map((conflict, index) => {
            const target = conflict.target;

            return (
              <div key={`${conflict.id}-${conflict.tipo}-${index}`} className="conflict-item">
                <strong className="conflict-type">
                  {conflict.tipo === "professor" ? "Conflito de professor" : "Conflito de sala"}
                </strong>

                <label>Conflita com</label>
                <label>Eixo</label>
                <p>{target?.eixo?.name || "Eixo não selecionado"}</p>
                <label>Curso</label>
                <p>{target?.curso?.name || "Curso não selecionado"}</p>
                <label>Período</label>
                <p>{target?.semestre?.numero}° Semestre</p>
                <label>Dia/Hora</label>
                <p>{conflict.dia} → {conflict.hora}</p>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}

export default AsideEditor;
