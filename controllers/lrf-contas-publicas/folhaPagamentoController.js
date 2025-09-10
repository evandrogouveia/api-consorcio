const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/folha-pagamento`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newFolhaPagamento(req, res) {
        let dataForm = JSON.parse(req.body.formFolhaPagamento);
        
        const tipoArquivo = dataForm.tipoArquivo;
        const mes = dataForm.mes || '';
        const ano = dataForm.ano || '';
        const polo = dataForm.polo || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/folha-pagamento/${req.files[0]?.filename}` : '';

        const query = `INSERT INTO folha_pagamento(
            tipoArquivo,
            mes, 
            ano,
            polo,
            file
            ) VALUES (
                '${tipoArquivo}',
                '${mes}', 
                '${ano}', 
                '${polo}', 
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

    getAllFolhaPagamento(req, res) {
        const query = `SELECT * FROM folha_pagamento ORDER BY ano DESC`;

        connection.query(query, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });

    },
    
    updateFolhaPagamento(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formFolhaPagamento);
        
        const tipoArquivo = dataForm.tipoArquivo;
        const mes = dataForm.mes || '';
        const ano = dataForm.ano || '';
        const polo = dataForm.polo || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/folha-pagamento/${req.files[0]?.filename}` : dataForm.file;

        const query = 'UPDATE `folha_pagamento` SET `tipoArquivo`= ?,' +
            '`mes`= ?,' +
            '`ano`= ?,' +
            '`polo`= ?,' +
            '`file`= ?' +
            'WHERE `folha_pagamento`.`ID`= ?';

        connection.query(query, [
            tipoArquivo,
            mes,
            ano,
            polo,
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

    deleteFolhaPagamento(req, res) {
        const id = parseInt(req.params.id);
        const query = `DELETE FROM folha_pagamento WHERE ID = ?`;

        connection.query(query, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}