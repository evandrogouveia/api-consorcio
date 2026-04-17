const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/absenteismo`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newAbsenteismo(req, res) {
        let dataForm = JSON.parse(req.body.formAbsenteismo);
        const arrayFile = req.files.map(file =>
            `${process.env.BASE_URL}/uploads/absenteismo/${file.filename}`
        );

        const titulo = dataForm.titulo || '';
        const data = dataForm.data || '';
        const exercicio = dataForm.exercicio || '';
        const secretaria = dataForm.secretaria || '';
        const descricao = dataForm.descricao || '';

        const newAbsenteismo = `INSERT INTO absenteismo(
            titulo,
            data, 
            exercicio,
            secretaria,
            file,
            descricao
            ) VALUES (
                '${titulo}',
                '${data}', 
                '${exercicio}',
                '${secretaria}',
                '${JSON.stringify(arrayFile)}',
                '${descricao}'
            )`;

        connection.query(newAbsenteismo, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllAbsenteismo(req, res) {
        const selectAbsenteismo = `SELECT * FROM absenteismo ORDER BY ID DESC`;

        connection.query(selectAbsenteismo, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getAbsenteismoById(req, res) {
        const id = parseInt(req.params.id);
        const selectAbsenteismo= `SELECT * FROM absenteismo WHERE ID = ?`;

        connection.query(selectAbsenteismo, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getSearchAbsenteismo(req, res) {
        const term = req.query.term[0];

        const selectAbsenteismo= `SELECT * FROM absenteismo WHERE 
        LOWER(absenteismo.descricao) LIKE LOWER('%${term}%') OR
        LOWER(absenteismo.titulo) LIKE LOWER('%${term}%')
        `;

        connection.query(selectAbsenteismo, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateAbsenteismo(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formAbsenteismo);

        const arrayFile = [];
        for (const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/uploads/absenteismo/${file?.filename}`)
        }

        const titulo = dataForm.titulo || '';
        const data = dataForm.data || '';
        const exercicio = dataForm.exercicio || '';
        const secretaria = dataForm.secretaria || '';
        const file = arrayFile.length > 0 ? arrayFile : dataForm.file;
        const descricao = dataForm.descricao || '';


        const updateIndicador = 'UPDATE `absenteismo` SET `titulo`= ?,' +
            '`data`= ?,' +
            '`exercicio`= ?,' +
            '`secretaria`= ?,' +
            '`file`= ?,' +
            '`descricao`= ?' +
            'WHERE `indicadores_resultados`.`ID`= ?';

        connection.query(updateIndicador, [
            titulo,
            data,
            exercicio,
            secretaria,
            JSON.stringify(file),
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

    deleteAbsenteismo(req, res) {
        const id = parseInt(req.params.id);
        const deleteAbsenteismo = `DELETE FROM absenteismo WHERE ID = ?`;

        connection.query(deleteAbsenteismo, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}