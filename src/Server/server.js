import express from "express";
import pool from "../Data/db.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const entityMap = {
  courses: {
    table: "courses",
    columns: ["name"],
  },
  professores: {
    table: "professores",
    columns: ["name"],
  },
  materias: {
    table: "materias",
    columns: ["name"],
  },
  salas: {
    table: "salas",
    columns: ["name"],
  },
  eixos: {
    table: "eixos",
    columns: ["name"],
  },
};

app.get("/:entity", async (req, res) => {
  const { entity } = req.params;

  const config = entityMap[entity];
  if (!config) return res.status(404).send("Entidade não encontrada");

  try {
    const result = await pool.query(`SELECT * FROM ${config.table}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/:entity", async (req, res) => {
  const { entity } = req.params;
  const config = entityMap[entity];

  if (!config) return res.status(404).send("Entidade não encontrada");

  const values = config.columns.map(col => req.body[col]);

  const placeholders = config.columns.map((_, i) => `$${i + 1}`).join(", ");

  try {
    const result = await pool.query(
      `INSERT INTO ${config.table} (${config.columns.join(", ")})
       VALUES (${placeholders}) RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao inserir");
  }
});

app.put("/:entity/:id", async (req, res) => {
  const { entity, id } = req.params;
  const config = entityMap[entity];

  if (!config) return res.status(404).send("Entidade não encontrada");

  const setClause = config.columns
    .map((col, i) => `${col} = $${i + 1}`)
    .join(", ");

  const values = config.columns.map(col => req.body[col]);

  try {
    const result = await pool.query(
      `UPDATE ${config.table}
       SET ${setClause}
       WHERE id = $${config.columns.length + 1}
       RETURNING *`,
      [...values, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar");
  }
});

app.delete("/:entity/:id", async (req, res) => {
  const { entity, id } = req.params;
  const config = entityMap[entity];

  if (!config) return res.status(404).send("Entidade não encontrada");

  try {
    await pool.query(
      `DELETE FROM ${config.table} WHERE id = $1`,
      [id]
    );

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar");
  }
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});