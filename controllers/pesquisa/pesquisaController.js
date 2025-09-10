const connection = require('../../database/connection');

module.exports = {
    getPesquisa(req, res) {
        const term = req.query.t;
        if (!term) {
            return res.status(400).json({ error: 'O parâmetro "termo" é obrigatório.' });
        }

        const query = `
            SELECT 'atas' AS origem, ID, title, description FROM atas WHERE title LIKE ? OR description LIKE ?
            UNION ALL
            SELECT 'licitacoes' AS origem, ID, title, description FROM licitacoes WHERE title LIKE ? OR description LIKE ?
            UNION ALL
            SELECT 'newsConsorcio' AS origem, ID, title, description FROM newsConsorcio WHERE title LIKE ? OR description LIKE ?
            UNION ALL
            SELECT 'processoseletivo' AS origem, ID, typeFile, description FROM processoseletivo WHERE typeFile LIKE ? OR description LIKE ?
        `;

        const valores = Array(4).fill([`%${term}%`, `%${term}%`]).flat();

        connection.query(query, valores, function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!', results });
            }
        });
    }

}