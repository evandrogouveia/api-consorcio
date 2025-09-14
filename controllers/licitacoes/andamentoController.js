const connection = require('../../database/connection');

module.exports = {
     //cadastra uma novo andamento
     newProgress(req, res) {
        const licitacaoID = req.body.licitacaoID;
        const date = req.body.date;
        const hour = req.body.hour;
        const phase = req.body.phase;
        const situation = req.body.situation;
        const responsible = req.body.responsible;

        const newProgress = `INSERT INTO progress(
            licitacaoID,
            date,
            hour,
            phase,
            situation,
            responsible
            ) VALUES (
                '${licitacaoID}',
                '${date}',
                '${hour}',
                '${phase}',
                '${situation}',
                '${responsible}'
            )`;

        connection.query(newProgress, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir progresso', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    //retorna todos as progressos
    getProgress(req, res) {
        const selectProgress = `SELECT * FROM progress ORDER BY ID DESC`;

        connection.query(selectProgress, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter progressos', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

}