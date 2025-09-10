const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/contratos-programa`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newContratoPrograma(req, res) {
        let dataForm = JSON.parse(req.body.formContratoPrograma);
        const arrayFile = [];
        for(const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/api-consorcio/uploads/contratos-programa/${file?.filename}`)
        }
        const title = dataForm.title;
        const date = dataForm.date || '';
        const secretary = dataForm.secretary || '';
        const file = arrayFile;
        const description = dataForm.description || '';

        const newContrato = `INSERT INTO contratosPrograma(
            title,
            date, 
            secretary,
            file,
            description
            ) VALUES (
                '${title}',
                '${date}', 
                '${secretary}',
                '${JSON.stringify(file)}',
                '${description}'
            )`;

        connection.query(newContrato, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllContratosPrograma(req, res) {
        const selectContratos = `SELECT * FROM contratosPrograma ORDER BY ID DESC`;

        connection.query(selectContratos, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getSearchContratosPrograma(req, res) {
        const term = req.query.term[0];

        const selectContratos = `SELECT * FROM contratosPrograma WHERE 
        LOWER(contratosPrograma.description) LIKE LOWER('%${term}%') OR
        LOWER(contratosPrograma.title) LIKE LOWER('%${term}%')
        `;

        connection.query(selectContratos, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },
    
    updateContratoPrograma(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formContratoPrograma);

        const arrayFile = [];
        for(const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/api-consorcio/uploads/contratos-programa/${file?.filename}`)
        }
        
        const title = dataForm.title;
        const date = dataForm.date || '';
        const secretary = dataForm.secretary || '';
        const file = arrayFile.length > 0 ? arrayFile : dataForm.file;
        const description = dataForm.description || '';

        const updateContrato = 'UPDATE `contratosPrograma` SET `title`= ?,' +
            '`date`= ?,' +
            '`secretary`= ?,' +
            '`file`= ?,' +
            '`description`= ?' +
            'WHERE `contratosPrograma`.`ID`= ?';

        connection.query(updateContrato, [
            title,
            date,
            secretary,
            JSON.stringify(file),
            description,
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ message: 'Erro ao atualizar dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'Dados atualizado!' });
            }
        });
    },

    deleteContratoPrograma(req, res) {
        const id = parseInt(req.params.id);
        const deleteContrato = `DELETE FROM contratosPrograma WHERE ID = ?`;

        connection.query(deleteContrato, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}