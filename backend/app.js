const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'rotacao_culturas'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

app.get('/culturas', (req, res) => {
    const query = 'SELECT id, nome FROM culturas';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar culturas:', err);
            res.status(500).json({ error: 'Erro ao buscar culturas' });
            return;
        }
        res.json(results);
    });
});

app.get('/recomendacao/:cultura_id', (req, res) => {
    const culturaId = req.params.cultura_id;

    const query = `
        SELECT c.nome AS cultura_atual, cn.nome AS cultura_recomendada, cn.motivo
        FROM culturas c
        INNER JOIN cultura_nova cn ON c.id = cn.cultura_id
        WHERE c.id = ?;
    `;

    db.query(query, [culturaId], (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao buscar recomendação da próxima cultura' });
            return;
        }
        res.json(results);
    });
});

app.get('/dicas/:cultura_id', (req, res) => {
    const culturaId = req.params.cultura_id;

    const query = `
        SELECT 
            c.nome AS cultura_nome,
            p.nome AS praga_nome,
            p.periodo_ataque,
            p.alimentacao,
            p.atracao,
            a.tipo_fertilizante,
            a.frequencia AS adubacao_frequencia,
            a.materia_organica,
            ts.tipo AS solo_tipo,
            ts.recomendacao AS solo_recomendacao,
            cl.temperatura,
            cl.umidade,
            cl.chuvas
        FROM culturas c
        LEFT JOIN cultura_pragas cp ON c.id = cp.cultura_id
        LEFT JOIN pragas p ON cp.praga_id = p.id
        LEFT JOIN adubacao a ON c.id = a.cultura_id
        LEFT JOIN cultura_solo cs ON c.id = cs.cultura_id
        LEFT JOIN tipo_solo ts ON cs.solo_id = ts.id
        LEFT JOIN clima cl ON c.id = cl.cultura_id
        WHERE c.id = ?;
    `;

    db.query(query, [culturaId], (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao buscar dicas da cultura' });
            return;
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});