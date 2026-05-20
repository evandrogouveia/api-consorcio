const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/arquivos_polo`;
            if (file.mimetype !== 'application/pdf') {
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path); //gera o diretório automaticamente
                }
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newArquivo(req, res) {
        let dataForm = JSON.parse(req.body.formArquivo);

        const typeFile = dataForm.typeFile;
        const title = dataForm.title || '';
        const date = dataForm.date || '';
        const exercise = dataForm.exercise || '';
        const secretary = dataForm.secretary || '';
        const competence = dataForm.competence || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/arquivos_polo/${req.files[0]?.filename}` : '';
        const description = dataForm.description || '';
        const acronym = dataForm.acronym || '';
        console.log(file)
        const newArquivo = `INSERT INTO arquivos_polo(
            typeFile,
            title,
            date, 
            exercise,
            secretary,
            competence,
            file,
            description,
            acronym
            ) VALUES (
                '${typeFile}',
                '${title}',
                '${date}', 
                '${exercise}', 
                '${secretary}',
                '${competence}',
                '${file}',
                '${description}',
                '${acronym}'
            )`;

        connection.query(newArquivo, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir arquivo', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllArquivos(req, res) {
        const selectArquivo = `SELECT * FROM arquivos_polo ORDER BY date DESC`;

        connection.query(selectArquivo, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter arquivo', error: error });
            } else {
                res.status(200).json(results);
            }
        });

    },

    updateArquivo(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formArquivo);

        const typeFile = dataForm.typeFile;
        const title = dataForm.title || '';
        const date = dataForm.date || '';
        const exercise = dataForm.exercise || '';
        const secretary = dataForm.secretary || '';
        const competence = dataForm.competence || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/arquivos_polo/${req.files[0]?.filename}` : dataForm.file;
        const description = dataForm.description || '';
        const acronym = dataForm.acronym || '';

        const updateArquivo = 'UPDATE `arquivos_polo` SET `typeFile`= ?,' +
            '`title`= ?,' +
            '`date`= ?,' +
            '`exercise`= ?,' +
            '`secretary`= ?,' +
            '`competence`= ?,' +
            '`file`= ?,' +
            '`description`= ?,' +
            '`acronym`= ?' +
            'WHERE `arquivos_polo`.`ID`= ?';

        connection.query(updateArquivo, [
            typeFile,
            title,
            date,
            exercise,
            secretary,
            competence,
            file,
            description,
            acronym,
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ message: 'Erro ao atualizar arquivo', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'Arquivo atualizado!' });
            }
        });
    },

    deleteArquivo(req, res) {
        const id = parseInt(req.params.id);
        const deleteArquivo = `DELETE FROM arquivos_polo WHERE ID = ?`;

        connection.query(deleteArquivo, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir arquivo', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}