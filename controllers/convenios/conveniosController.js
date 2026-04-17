const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/convenios`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newConvenio(req, res) {
        let dataForm = JSON.parse(req.body.formConvenio);

        const numero = dataForm.numero || '';
        const ano = dataForm.ano || '';
        const secretaria = dataForm.secretaria || '';
        const convenente = dataForm.convenente || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/convenios/${req.files[0]?.filename}` : '';
        const descricao = dataForm.descricao || '';

        const newConvenio = `INSERT INTO convenios(
            numero,
            ano, 
            secretaria,
            convenente,
            file,
            descricao
            ) VALUES (
                '${numero}', 
                '${ano}', 
                '${secretaria}',
                '${convenente}', 
                '${file}',
                '${descricao}' 
            )`;

        connection.query(newConvenio, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllConvenios(req, res) {
        const selectConvenios = `SELECT * FROM convenios ORDER BY ID DESC`;

        connection.query(selectConvenios, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateConvenio(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formConvenio);

        const numero = dataForm.numero || '';
        const ano = dataForm.ano || '';
        const secretaria = dataForm.secretaria || '';
        const convenente = dataForm.convenente || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/convenios/${req.files[0]?.filename}` : dataForm.file;
        const descricao = dataForm.descricao || '';

        const updateAta = 'UPDATE `convenios` SET `numero`= ?,' +
            '`ano`= ?,' +
            '`secretaria`= ?,' +
            '`convenente`= ?,' +
            '`file`= ?,' +
            '`descricao`= ?' +
            'WHERE `convenios`.`ID`= ?';

        connection.query(updateAta, [
            numero,
            ano,
            secretaria,
            convenente,
            file,
            descricao,
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ message: 'Erro ao atualizar dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'Dados atualizado!' });
            }
        });
    },

    deleteConvenio(req, res) {
        const id = parseInt(req.params.id);
        const deleteConvenio = `DELETE FROM convenios WHERE ID = ?`;

        connection.query(deleteConvenio, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}