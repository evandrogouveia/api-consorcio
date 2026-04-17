const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/ata_constituicao`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newAtaConstituicao(req, res) {
        let dataForm = JSON.parse(req.body.formAtaConstituicao);

        const date = dataForm.date || '';
        const secretary = dataForm.secretary || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/ata_constituicao/${req.files[0]?.filename}` : '';

        const newAta = `INSERT INTO ata_constituicao(
            date, 
            secretary,
            file
            ) VALUES (
                '${date}', 
                '${secretary}',
                '${file}'
            )`;

        connection.query(newAta, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllAtasConstituicao(req, res) {
        const selectAtas = `SELECT * FROM ata_constituicao ORDER BY ID DESC`;

        connection.query(selectAtas, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateAtasConstituicao(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formAtaConstituicao);

        const date = dataForm.date || '';
        const secretary = dataForm.secretary || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/ata_constituicao/${req.files[0]?.filename}` : dataForm.file;

        const updateAta = 'UPDATE `ata_constituicao` SET `date`= ?,' +
            '`secretary`= ?,' +
            '`file`= ?' +
            'WHERE `ata_constituicao`.`ID`= ?';

        connection.query(updateAta, [
            date,
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

    deleteAtaConstituicao(req, res) {
        const id = parseInt(req.params.id);
        const deleteAta = `DELETE FROM ata_constituicao WHERE ID = ?`;

        connection.query(deleteAta, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}