import express from "express";
import pool from "../Data/db.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

function createCrudRoutes(route, table) {

  app.get(`/${route}`, async (_, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM ${table} ORDER BY id`
      );

      res.json(result.rows);

    } catch (err) {
      console.error(err);
      res.status(500).send("Erro");
    }
  });

  app.post(`/${route}`, async (req, res) => {
    try {

      const { name } = req.body;

      const result = await pool.query(
        `INSERT INTO ${table} (name)
         VALUES ($1)
         RETURNING *`,
        [name]
      );

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).send("Erro");
    }
  });

}

createCrudRoutes("professores", "professores");
createCrudRoutes("materias", "materias");
createCrudRoutes("salas", "salas");
createCrudRoutes("cursos", "cursos");
createCrudRoutes("eixos", "eixos");

app.get("/grades", async (_, res) => {

  try {

    const grades = await pool.query(`
      SELECT *
      FROM grades
      ORDER BY id
    `);

    res.json(grades.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro");
  }

});

app.get("/grades/:id/full", async (req, res) => {
  const { id } = req.params;

  try {

    const gradeResult = await pool.query(
      `SELECT * FROM grades WHERE id = $1`,
      [id]
    );

    if (gradeResult.rows.length === 0) {
      return res.status(404).json({
        error: "Grade não encontrada"
      });
    }

    const grade = gradeResult.rows[0];

    const eixosResult = await pool.query(`
      SELECT * FROM grade_eixos
      WHERE grade_id = $1
      ORDER BY id
    `, [id]);

    const eixos = [];

    for (const eixo of eixosResult.rows) {

      const cursosResult = await pool.query(`
        SELECT * FROM grade_cursos
        WHERE grade_eixo_id = $1
        ORDER BY id
      `, [eixo.id]);

      const cursos = [];

      for (const curso of cursosResult.rows) {

        const semestresResult = await pool.query(`
          SELECT * FROM semestres
          WHERE grade_curso_id = $1
          ORDER BY numero
        `, [curso.id]);

        const semestres = [];

        for (const semestre of semestresResult.rows) {

          const aulasResult = await pool.query(`
            SELECT
              a.*,

              p.name as professor_name,
              m.name as materia_name,
              s.name as sala_name

            FROM aulas a

            LEFT JOIN professores p
            ON p.id = a.professor_id

            LEFT JOIN materias m
            ON m.id = a.materia_id

            LEFT JOIN salas s
            ON s.id = a.sala_id

            WHERE a.semestre_id = $1
          `, [semestre.id]);

          semestres.push({
            ...semestre,
            aulas: aulasResult.rows
          });
        }

        cursos.push({
          ...curso,
          semestres
        });
      }

      eixos.push({
        ...eixo,
        cursos
      });
    }

    res.json({
      ...grade,
      grades: eixos
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar grade");
  }
});

app.post("/grades", async (req, res) => {

  try {

    const { name } = req.body;

    const result = await pool.query(`
      INSERT INTO grades (name)
      VALUES ($1)
      RETURNING *
    `, [name]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro");
  }

});

app.post("/grade-eixos", async (req, res) => {
  const { grade_id } = req.body;

  try {

    const result = await pool.query(`
      INSERT INTO grade_eixos
      (grade_id)
      VALUES ($1)
      RETURNING *
    `, [grade_id]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar eixo");
  }
});

app.put("/grade-eixos/:id", async (req, res) => {

  const { id } = req.params;
  const { eixo_id } = req.body;

  try {

    const result = await pool.query(`
      UPDATE grade_eixos
      SET eixo_id = $1
      WHERE id = $2
      RETURNING *
    `, [eixo_id, id]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro");
  }
});

app.delete("/grade-eixos/:id", async (req, res) => {
  const { id } = req.params;

  try {

    await pool.query(`
      DELETE FROM grade_eixos
      WHERE id = $1
    `, [id]);

    res.sendStatus(204);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir eixo");
  }
});

app.post("/grade-cursos", async (req, res) => {
  const { grade_eixo_id } = req.body;

  try {

    const result = await pool.query(`
      INSERT INTO grade_cursos
      (grade_eixo_id)
      VALUES ($1)
      RETURNING *
    `, [grade_eixo_id]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar curso");
  }
});

app.put("/grade-cursos/:id", async (req, res) => {

  const { id } = req.params;
  const { curso_id } = req.body;
  try {

    const result = await pool.query(`
      UPDATE grade_cursos
      SET curso_id = $1
      WHERE id = $2
      RETURNING *
    `, [curso_id, id]);
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro");
  }
});

app.delete("/grade-cursos/:id", async (req, res) => {
  const { id } = req.params;

  try {

    await pool.query(`
      DELETE FROM grade_cursos
      WHERE id = $1
    `, [id]);

    res.sendStatus(204);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir curso");
  }
});

app.post("/schedule", async (req, res) => {

  try {

    const {
      semestre_id,
      dia,
      hora,
      professor_id,
      materia_id,
      sala_id
    } = req.body;

    const result = await pool.query(`
      INSERT INTO aulas (
        semestre_id,
        dia,
        hora,
        professor_id,
        materia_id,
        sala_id
      )

      VALUES ($1,$2,$3,$4,$5,$6)

      RETURNING *
    `, [
      semestre_id,
      dia,
      hora,
      professor_id,
      materia_id,
      sala_id
    ]);

    const aula = result.rows[0];

    const hydrated = await pool.query(`
      SELECT
        a.*,

        p.name as professor_name,
        m.name as materia_name,
        s.name as sala_name

      FROM aulas a

      LEFT JOIN professores p
      ON p.id = a.professor_id

      LEFT JOIN materias m
      ON m.id = a.materia_id

      LEFT JOIN salas s
      ON s.id = a.sala_id

      WHERE a.id = $1
    `, [aula.id]);

    res.json(hydrated.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro");
  }

});

app.delete("/schedule", async (req, res) => {

  const {
    semestre_id,
    dia,
    hora
  } = req.body;

  try {

    await pool.query(`
      DELETE FROM aulas
      WHERE semestre_id = $1
      AND dia = $2
      AND hora = $3
    `, [
      semestre_id,
      dia,
      hora
    ]);

    res.sendStatus(204);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar aula");
  }
});

app.post("/semestres", async (req, res) => {
  const { grade_curso_id, numero } = req.body;

  try {

    const result = await pool.query(`
      INSERT INTO semestres
      (grade_curso_id, numero)
      VALUES ($1, $2)
      RETURNING *
    `, [grade_curso_id, numero]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar semestre");
  }
});

app.delete("/semestres/:id", async (req, res) => {
  const { id } = req.params;

  try {

    await pool.query(`
      DELETE FROM semestres
      WHERE id = $1
    `, [id]);

    res.sendStatus(204);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir semestre");
  }
});

app.get("/grade-cursos/:id/semestres", async (req, res) => {
  const { id } = req.params;

  try {

    const result = await pool.query(`
      SELECT *
      FROM semestres
      WHERE grade_curso_id = $1
      ORDER BY numero
    `, [id]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar semestres");
  }
});

app.get("/professores", async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM professores
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar professores");
  }
});

app.get("/professores/:id", async (req, res) => {
  const { id } = req.params;
  try {

    const result = await pool.query(`
      SELECT *
      FROM professores
      WHERE id = $1
    `, [id]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar professor");
  }
});

app.post("/professores", async (req, res) => {
  const { name } = req.body;
  try {

    const result = await pool.query(`
      INSERT INTO professores (name)
      VALUES ($1)
      RETURNING *
    `, [name]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar professor");
  }
});

app.put("/professores/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {

    const result = await pool.query(`
      UPDATE professores
      SET name = $1
      WHERE id = $2
      RETURNING *
    `, [name, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar professor");
  }
});

app.delete("/professores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`
      DELETE FROM professores
      WHERE id = $1
    `, [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir professor");
  }
});

app.get("/materias", async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM materias
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar materias");
  }
});

app.get("/Materias/:id", async (req, res) => {
  const { id } = req.params;
  try {

    const result = await pool.query(`
      SELECT *
      FROM materias
      WHERE id = $1
    `, [id]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar materia");
  }
});

app.post("/materias", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO materias (name)
      VALUES ($1)
      RETURNING *
    `, [name]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar materia");
  }
});

app.put("/materias/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(`
      UPDATE materias
      SET name = $1
      WHERE id = $2
      RETURNING *
    `, [name, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar materia");
  }
});

app.delete("/materias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`
      DELETE FROM materias
      WHERE id = $1
    `, [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir materia");
  }
});

app.get("/salas", async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM salas
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar salas");
  }
});

app.get("/salas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT *
      FROM salas
      WHERE id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar sala");
  }
});

app.post("/salas", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO salas (name)
      VALUES ($1)
      RETURNING *
    `, [name]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar sala");
  }
});

app.put("/salas/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(`
      UPDATE salas
      SET name = $1
      WHERE id = $2
      RETURNING *
    `, [name, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar sala");
  }
});

app.delete("/salas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`
      DELETE FROM salas
      WHERE id = $1
    `, [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir sala");
  }
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});