const connection = require('../../database/connection');

module.exports = {
    newResultado(req, res) {
        const ano = req.body.ano || '';
        const unidade = req.body.unidade || '';
        const quantidade = req.body.quantidade || '';
        const descricao = req.body.descricao || '';

        const newResultado = `INSERT INTO resultados(
        ano,
        unidade, 
        quantidade,
        descricao
        ) VALUES (
            '${ano}', 
            '${unidade}', 
            '${quantidade}',
            '${descricao}'
        )`;

        connection.query(newResultado, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao cadastrar dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getResultados(req, res) {
        const selectResultados = `SELECT * FROM resultados`;

        connection.query(selectResultados, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateResultado(req, res) {
        const id = parseInt(req.params.id);
        const ano = req.body.ano || '';
        const unidade = req.body.unidade || '';
        const quantidade = req.body.quantidade || '';
        const descricao = req.body.descricao || '';
       
        const updateResultado = 'UPDATE `resultados` SET `ano`= ?,' +
            '`unidade`= ?,' +
            '`quantidade`= ?,' +
            '`descricao`= ?' +
            'WHERE `resultados`.`ID`= ?';

        connection.query(updateResultado,
            [
                ano,
                unidade,
                quantidade,
                descricao,
                id
            ], function (error, results, fields) {
                if (error) {
                    res.status(400).json({ status: 0, message: 'Erro atualizar dados', error: error });
                } else {
                    res.status(200).json(results);
                }
            });
    },

    deleteResultado(req, res) {
        const id = parseInt(req.params.id);
        const deleteResultado = `DELETE FROM resultados WHERE ID = ?`;

        connection.query(deleteResultado, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir item', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}