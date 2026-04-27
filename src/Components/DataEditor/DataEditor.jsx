import { useState, useEffect } from "react";
import "./DataEditor.css";

const DataEditor = ({ value, onSave }) => {
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    setCurrentValue(value || "");
  }, [value]);

  return (
    <div className="data-editor">

        <label className="label-editor">Editar Valor:</label>

        <input
            className="input-editor"
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}/>

        <button 
            className="save-btn"
            onClick={() => {
                onSave(currentValue);
                setCurrentValue("");}}>
            Salvar
        </button>

        <button
            className="cancel-btn"
            onClick={() => {
                onSave(value);
                setCurrentValue("")}}>
            Cancelar
        </button>
    </div>
  );
};

export default DataEditor;