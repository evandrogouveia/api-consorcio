const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/funcoes`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),

    newFuncao(req, res) {
        let dataForm = JSON.parse(req.body.formFuncao);

        const IDUnidade = dataForm.IDUnidade;
        const titulo = dataForm.titulo;
        const descricao = dataForm.descricao;
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/funcoes/${req.files[0]?.filename}` : '';

        const newFuncao = `INSERT INTO funcoes(
            IDUnidade,
            titulo,
            descricao,
            file
            ) VALUES (
                '${IDUnidade}',
                '${titulo}',
                '${descricao}',
                '${file}'
            )`;

        connection.query(newFuncao, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir funcao', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getFuncoes(req, res) {
        const id = parseInt(req.params.IDUnidade);
        const selectFuncoes = `SELECT * FROM funcoes WHERE IDUnidade = ? ORDER BY ID DESC`;

        connection.query(selectFuncoes, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter funcoes', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateFuncao(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formMunicipio);

        const titulo = dataForm.titulo;
        const descricao = dataForm.descricao;
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/funcoes/${req.files[0]?.filename}` : dataForm.file;

        const updateFuncoes = 'UPDATE `funcoes` SET `titulo`= ?,' +
            '`descricao`= ?,' +
            '`file`= ?' +
            'WHERE `funcoes`.`ID`= ?';

        connection.query(updateFuncoes,
            [
                titulo,
                descricao,
                file,
                id
            ], function (error, results, fields) {
                if (error) {
                    res.status(400).json({ status: 0, message: 'Erro atualizar vídeo', error: error });
                } else {
                    res.status(200).json(results);
                }
            });

    },

    deleteFuncao(req, res) {
        const id = parseInt(req.params.id);
        const deleteFuncao = `DELETE FROM funcoes WHERE ID = ?`;

        connection.query(deleteFuncao, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir funcao', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}