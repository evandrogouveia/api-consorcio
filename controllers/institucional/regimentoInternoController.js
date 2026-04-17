const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/regimento_interno`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newRegimentoInterno(req, res) {
        let dataForm = JSON.parse(req.body.formRegimentoInterno);

        const secretary = dataForm.secretary || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/regimento_interno/${req.files[0]?.filename}` : '';

        const newFile = `INSERT INTO regimento_interno(
            secretary,
            file
            ) VALUES (
                '${secretary}',
                '${file}'
            )`;

        connection.query(newFile, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllRegimentoInterno(req, res) {
        const selectFile = `SELECT * FROM regimento_interno ORDER BY ID DESC`;

        connection.query(selectFile, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateRegimentoInterno(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formRegimentoInterno);

        const secretary = dataForm.secretary || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/regimento_interno/${req.files[0]?.filename}` : dataForm.file;

        const updateFile = 'UPDATE `regimento_interno` SET `secretary`= ?,' +
            '`file`= ?' +
            'WHERE `regimento_interno`.`ID`= ?';

        connection.query(updateFile, [
            secretary,
            file,
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ message: 'Erro ao atualizar dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'Dados atualizado!' });
            }
        });
    },

    deleteRegimentoInterno(req, res) {
        const id = parseInt(req.params.id);
        const deleteFile = `DELETE FROM regimento_interno WHERE ID = ?`;

        connection.query(deleteFile, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}