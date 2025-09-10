const connection = require('../../database/connection');

module.exports = {
    newVaga(req, res) {
        const titulo = req.body.titulo;
        const link = req.body.link;

        const newVaga = `INSERT INTO vagas(
            titulo,
            link
            ) VALUES (
                '${titulo}',
                '${link}'
            )`;

        connection.query(newVaga, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir vaga', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },
 
    getVagas(req, res) {
        const selectVagas = `SELECT * FROM vagas ORDER BY ID DESC`;

        connection.query(selectVagas, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter vagas', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getSearchVagas(req, res) {
        const term = req.query.term[0];

        const selectVagas = `SELECT * FROM vagas WHERE LOWER(vagas.titulo) LIKE LOWER('%${term}%')`;

        connection.query(selectVagas, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateVaga(req, res) {
        const id = parseInt(req.params.id);
        const titulo = req.body.titulo;
        const link = req.body.link;

        const updateVaga = 'UPDATE `vagas` SET `titulo`= ?,' +
            '`link`= ?' +
            'WHERE `vagas`.`ID`= ?';

        connection.query(updateVaga, 
            [
                titulo, 
                link,
                id
            ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro atualizar vaga', error: error });
            } else {
                res.status(200).json(results);
            }
        });

    },

    deleteVaga(req, res) {
        const id = parseInt(req.params.id);
        const deleteVaga = `DELETE FROM vagas WHERE ID = ?`;

        connection.query(deleteVaga, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir vaga', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}