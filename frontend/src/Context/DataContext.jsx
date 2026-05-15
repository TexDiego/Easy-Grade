/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

import professoresData from "../Data/Professores";
import materiasData from "../Data/Materias";
import cursosData from "../Data/Cursos";
import salasData from "../Data/Salas";
import eixosData from "../Data/Eixos";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [professores, setProfessores] = useState(professoresData);
  const [materias, setMaterias] = useState(materiasData);
  const [cursos, setCursos] = useState(cursosData);
  const [salas, setSalas] = useState(salasData);
  const [eixos, setEixos] = useState(eixosData);

  return (
    <DataContext.Provider
      value={{
        professores,
        setProfessores,
        materias,
        setMaterias,
        cursos,
        setCursos,
        salas,
        setSalas,
        eixos,
        setEixos
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
