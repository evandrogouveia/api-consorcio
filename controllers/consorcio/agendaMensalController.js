const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/agenda-mensal`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),

    newAgenda(req, res) {
        let dataForm = JSON.parse(req.body.formAgendaMensal);

        const ano = dataForm.ano;
        const mes = dataForm.mes;
        const unidade = dataForm.unidade;
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/agenda-mensal/${req.files[0]?.filename}` : '';

        const newAgenda = `INSERT INTO agenda_mensal(
            ano,
            mes,
            unidade,
            file
            ) VALUES (
                '${ano}',
                '${mes}',
                '${unidade}',
                '${file}'
            )`;

        connection.query(newAgenda, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir item', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAgenda(req, res) {
        const id = parseInt(req.params.IDUnidade);
        const selectAgenda = `SELECT * FROM agenda_mensal ORDER BY ID ASC`;

        connection.query(selectAgenda, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateAgenda(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formAgendaMensal);

        const ano = dataForm.ano;
        const mes = dataForm.mes;
        const unidade = dataForm.unidade;
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/agenda-mensal/${req.files[0]?.filename}` : dataForm.file;

        const updateAgenda= 'UPDATE `agenda_mensal` SET `ano`= ?,' +
            '`mes`= ?,' +
            '`unidade`= ?,' +
            '`file`= ?' +
            'WHERE `agenda_mensal`.`ID`= ?';

        connection.query(updateAgenda,
            [
                ano,
                mes,
                unidade,
                file,
                id
            ], function (error, results, fields) {
                if (error) {
                    res.status(400).json({ status: 0, message: 'Erro ao atualizar item', error: error });
                } else {
                    res.status(200).json(results);
                }
            });

    },

    deleteAgenda(req, res) {
        const id = parseInt(req.params.id);
        const deleteAgenda = `DELETE FROM agenda_mensal WHERE ID = ?`;
     
        connection.query(deleteAgenda, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir item', error: error });
            } else {
                res.status(200).json(true);
            }
        });
    }
}