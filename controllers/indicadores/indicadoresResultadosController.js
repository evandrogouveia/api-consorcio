const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/indicadores`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newIndicador(req, res) {
        let dataForm = JSON.parse(req.body.formIndicadores);
        const arrayFile = req.files.map(file =>
            `${process.env.BASE_URL}/uploads/indicadores/${file.filename}`
        );

        const titulo = dataForm.titulo || '';
        const data = dataForm.data || '';
        const exercicio = dataForm.exercicio || '';
        const secretaria = dataForm.secretaria || '';
        const descricao = dataForm.descricao || '';

        const newIndicador = `INSERT INTO indicadores_resultados(
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

        connection.query(newIndicador, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllIndicadores(req, res) {
        const selectIndicadores = `SELECT * FROM indicadores_resultados ORDER BY ID DESC`;

        connection.query(selectIndicadores, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getIndicadorById(req, res) {
        const id = parseInt(req.params.id);
        const selectIndicador = `SELECT * FROM indicadores_resultados WHERE ID = ?`;

        connection.query(selectIndicador, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getSearchIndicadores(req, res) {
        const term = req.query.term[0];

        const selectIndicadores = `SELECT * FROM indicadores_resultados WHERE 
        LOWER(indicadores_resultados.descricao) LIKE LOWER('%${term}%') OR
        LOWER(indicadores_resultados.titulo) LIKE LOWER('%${term}%')
        `;

        connection.query(selectIndicadores, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateIndicador(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formIndicadores);

        const arrayFile = [];
        for (const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/uploads/indicadores/${file?.filename}`)
        }

        const titulo = dataForm.titulo || '';
        const data = dataForm.data || '';
        const exercicio = dataForm.exercicio || '';
        const secretaria = dataForm.secretaria || '';
        const file = arrayFile.length > 0 ? arrayFile : dataForm.file;
        const descricao = dataForm.descricao || '';


        const updateIndicador = 'UPDATE `indicadores_resultados` SET `titulo`= ?,' +
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

    deleteIndicador(req, res) {
        const id = parseInt(req.params.id);
        const deleteIndicador = `DELETE FROM indicadores_resultados WHERE ID = ?`;

        connection.query(deleteIndicador, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}