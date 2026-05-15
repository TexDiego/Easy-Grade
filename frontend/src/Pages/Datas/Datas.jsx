import React from 'react'
import "./Datas.css";
import { useData } from "../../Context/DataContext";
import { useState, useEffect } from "react";
import DataEditor from "../../Components/DataEditor/DataEditor";
import DatasHeader from '../../Components/Header/DatasHeader/DatasHeader';
import DataService from "../../Services/DataService";

const endpointMap = {
    professores: "Professores",
    salas: "Salas",
    materias: "Materias",
    cursos: "Cursos",
    eixos: "Eixos"
};

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

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [newItemName, setNewItemName] = useState("");
    const [dados, setDados] = useState(null);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        if (!dados) return;

        async function fetchData() {
            try {
                const data = await DataService.getByType(endpointMap[dados]);
                const updateMap = {
                    professores: setProfessores,
                    salas: setSalas,
                    materias: setMaterias,
                    cursos: setCursos,
                    eixos: setEixos
                };

                updateMap[dados](data);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
        }

        fetchData();
    }, [dados, setCursos, setEixos, setMaterias, setProfessores, setSalas]);

    const updateMap = {
        professores: setProfessores,
        salas: setSalas,
        materias: setMaterias,
        cursos: setCursos,
        eixos: setEixos
    };

    async function handleSave(updatedName) {
        if (!editItem || !dados) return;

        try {
            const updatedItem = await DataService.updateByType(
                endpointMap[dados],
                editItem.id,
                updatedName
            );
            const setter = updateMap[dados];

            setter(prev =>
                prev.map(item =>
                    item.id === updatedItem.id
                        ? { ...item, ...updatedItem }
                        : item
                )
            );

            setEditItem(null);

        } catch (err) {
            console.error("Erro ao atualizar:", err);
        }
    }

    async function handleAdd() {
        if (!newItemName || !dados) return;

        try {
            const createdItem = await DataService.createByType(
                endpointMap[dados],
                newItemName
            );

            updateMap[dados](prev => [...prev, createdItem]);

            setNewItemName("");

        } catch (err) {
            console.error("Erro ao adicionar:", err);
        }
    }

    async function handleDelete(id) {
        if (!dados) return;

        try {
            await DataService.deleteByType(endpointMap[dados], id);

            updateMap[dados](prev =>
                prev.filter(item => item.id !== id)
            );

        } catch (err) {
            console.error("Erro ao deletar:", err);
        }
    }

    const rawData = dataMap[dados] || [];

    const normalizedData = rawData.map(item => ({
        ...item,
        displayName: item.name || ""
    }));

    const filteredData = normalizedData.filter(item =>
        item.displayName.toLowerCase().includes(search.toLowerCase())
    );

    const sortedData = filteredData.sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
    );

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="datas-container">
            <DatasHeader />

            <div className="controls">
                <input
                    className='searchBar'
                    type="text"
                    placeholder="Pesquisar..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }} />
            </div>

            <div className='select'>
                <select onChange={(e) => setDados(e.target.value)}>
                    <option value="">Selecione um tipo de dado</option>
                    <option value="professores">Professores</option>
                    <option value="salas">Salas</option>
                    <option value="materias">Matérias</option>
                    <option value="cursos">Cursos</option>
                    <option value="eixos">Eixos</option>
                </select>
                <select
                    className='pages'
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className='content'>
                {dados && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th className="edit"></th>
                                <th className="delete"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(item => (
                                <tr key={item.id}>
                                    <td>{item.displayName}</td>

                                    <td className="edit">
                                        <button onClick={() => setEditItem(item)}>
                                            Editar
                                        </button>
                                    </td>

                                    <td className="delete">
                                        <button onClick={() => handleDelete(item.id)}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}>
                    Anterior
                </button>

                <span>
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}>
                    Próxima
                </button>
            </div>

            {dados && (<div className="add">
                <input
                    type="text"
                    placeholder="Novo item"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)} />

                <button onClick={handleAdd}>
                    Adicionar
                </button>
            </div>)}

            {editItem && (
                <DataEditor
                    key={editItem.id}
                    value={editItem.name}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}
export default Datas;
