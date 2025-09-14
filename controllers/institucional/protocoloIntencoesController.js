const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/protocolo-intencoes`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newProtocoloIntencoes(req, res) {
        let dataForm = JSON.parse(req.body.formProtocoloIntencoes);

        const tipoArquivo = dataForm.tipoArquivo;
        const data = dataForm.data || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/protocolo-intencoes/${req.files[0]?.filename}` : '';

        const query = `INSERT INTO protocoloIntencoes(
            typeFile,
            date, 
            file
            ) VALUES (
                '${tipoArquivo}',
                '${data}',
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

    getAllProtocoloIntencoes(req, res) {
        const query = `SELECT * FROM protocoloIntencoes ORDER BY date DESC`;

        connection.query(query, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });

    },
    
    updateProtocoloIntencoes(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formProtocoloIntencoes);
        
        const tipoArquivo = dataForm.tipoArquivo;
        const data = dataForm.data || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/protocolo-intencoes/${req.files[0]?.filename}` : dataForm.file;

        const query = 'UPDATE `protocoloIntencoes` SET `typeFile`= ?,' +
            '`date`= ?,' +
            '`file`= ?' +
            'WHERE `protocoloIntencoes`.`ID`= ?';

        connection.query(query, [
            tipoArquivo,
            data,
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

    deleteProtocoloIntencoes(req, res) {
        const id = parseInt(req.params.id);
        const query = `DELETE FROM protocoloIntencoes WHERE ID = ?`;

        connection.query(query, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}