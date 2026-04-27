import React from 'react'
import "./Datas.css";
import { useData } from "../../Context/DataContext";
import { useState, useEffect } from "react";
import DataEditor from "../../Components/DataEditor/DataEditor";
import DatasHeader from '../../Components/Header/DatasHeader/DatasHeader';

function Datas() {

    const {
        professores, setProfessores,
        salas, setSalas,
        materias, setMaterias,
        cursos, setCursos,
        eixos, setEixos
    } = useData();

    const dataMap = {
        professores,
        salas,
        materias,
        cursos,
        eixos
    };

    const [dados, setDados] = useState(null);
    const [editItem, setEditItem] = useState(null);

    function handleSave(updatedName) {
        if (!editItem || !dados) return;

        const updateMap = {
        professores: setProfessores,
        salas: setSalas,
        materias: setMaterias,
        cursos: setCursos,
        eixos: setEixos
        };

        const setter = updateMap[dados];

        setter(prev =>
        prev.map(item =>
            item.id === editItem.id
            ? { ...item, nome: updatedName }
            : item)
        );

        setEditItem(null);
    }

    return (
        <div>
            <DatasHeader />

            <div className='select'>
                <select onChange={(e) => setDados(e.target.value)}>
                    <option value="">Selecione um tipo de dado</option>
                    <option value="professores">Professores</option>
                    <option value="salas">Salas</option>
                    <option value="materias">Matérias</option>
                    <option value="cursos">Cursos</option>
                    <option value="eixos">Eixos</option>
                </select>
            </div>

            <div className='content'>
                {dados && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th className="edit"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataMap[dados].map(item => (
                                <tr key={item.id}>
                                    <td>{item.nome}</td>
                                    <td className="edit">
                                        <button onClick={() => setEditItem(item)}>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {editItem && (
                <DataEditor
                    value={editItem.nome}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}
export default Datas;