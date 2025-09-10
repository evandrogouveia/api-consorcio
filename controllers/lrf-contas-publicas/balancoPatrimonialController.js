const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/balanco-patrimonial`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newBalancoPatrimonial(req, res) {
        let dataForm = JSON.parse(req.body.formBalancoPatrimonial);
        
        const tipoArquivo = dataForm.tipoArquivo;
        const data = dataForm.data || '';
        const periodo = dataForm.periodo || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/balanco-patrimonial/${req.files[0]?.filename}` : '';

        const query = `INSERT INTO balanco_patrimonial(
            tipoArquivo,
            data, 
            periodo,
            file
            ) VALUES (
                '${tipoArquivo}',
                '${data}', 
                '${JSON.stringify(periodo)}', 
                '${file}'
            )`;

        connection.query(query, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllBalancoPatrimonial(req, res) {
        const query = `SELECT * FROM balanco_patrimonial ORDER BY data DESC`;

        connection.query(query, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });

    },
    
    updateBalancoPatrimonial(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formBalancoPatrimonial);
        
        const tipoArquivo = dataForm.tipoArquivo;
        const data = dataForm.data || '';
        const periodo = dataForm.periodo || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/balanco-patrimonial/${req.files[0]?.filename}` : dataForm.file;

        const query = 'UPDATE `balanco_patrimonial` SET `tipoArquivo`= ?,' +
            '`data`= ?,' +
            '`periodo`= ?,' +
            '`file`= ?' +
            'WHERE `balanco_patrimonial`.`ID`= ?';

        connection.query(query, [
            tipoArquivo,
            data,
            JSON.stringify(periodo),
            file,
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ message: 'Erro ao atualizar dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    deleteBalancoPatrimonial(req, res) {
        const id = parseInt(req.params.id);
        const query = `DELETE FROM balanco_patrimonial WHERE ID = ?`;

        connection.query(query, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}