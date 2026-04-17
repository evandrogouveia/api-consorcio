const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/atas`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newAta(req, res) {
        let dataForm = JSON.parse(req.body.formAtas);
        const arrayFile = [];
        for(const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/api-consorcio/uploads/atas/${file?.filename}`)
        }
        const title = dataForm.title;
        const date = dataForm.date || '';
        const secretary = dataForm.secretary || '';
        const category = dataForm.category || '';
        const file = arrayFile;
        const description = dataForm.description || '';

        const newAta = `INSERT INTO atas(
            title,
            date, 
            secretary,
            category,
            file,
            description
            ) VALUES (
                '${title}',
                '${date}', 
                '${secretary}',
                '${category}',
                '${JSON.stringify(file)}',
                '${description}'
            )`;

        connection.query(newAta, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllAtas(req, res) {
        const selectAtas = `SELECT * FROM atas ORDER BY ID DESC`;

        connection.query(selectAtas, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getSearchAtas(req, res) {
        const term = req.query.term[0];

        const selectAtas = `SELECT * FROM atas WHERE 
        LOWER(atas.description) LIKE LOWER('%${term}%') OR
        LOWER(atas.title) LIKE LOWER('%${term}%')
        `;

        connection.query(selectAtas, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },
    
    updateAtas(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formAtas);

        const arrayFile = [];
        for(const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/api-consorcio/uploads/atas/${file?.filename}`)
        }
        
        const title = dataForm.title;
        const date = dataForm.date || '';
        const secretary = dataForm.secretary || '';
        const category = dataForm.category || '';
        const file = arrayFile.length > 0 ? arrayFile : (typeof dataForm.file === 'string' ? JSON.parse(dataForm.file) : dataForm.file);
        const description = dataForm.description || '';

        const updateAta = 'UPDATE `atas` SET `title`= ?,' +
            '`date`= ?,' +
            '`secretary`= ?,' +
            '`category`= ?,' +
            '`file`= ?,' +
            '`description`= ?' +
            'WHERE `atas`.`ID`= ?';

        connection.query(updateAta, [
            title,
            date,
            secretary,
            category,
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

    deleteAta(req, res) {
        const id = parseInt(req.params.id);
        const deleteAta = `DELETE FROM atas WHERE ID = ?`;

        connection.query(deleteAta, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}