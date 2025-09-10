const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/servicos-atividades`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newServicoAtividade(req, res) {
        let dataForm = JSON.parse(req.body.formServicosAtividades);
        const polo = dataForm.polo;
        const tipoArquivo = dataForm.tipoArquivo;
        const data = dataForm.data || '';
        const periodo = dataForm.periodo || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/servicos-atividades/${req.files[0]?.filename}` : '';

        const query = `INSERT INTO servicos_atividades(
            polo,
            tipoArquivo,
            data, 
            periodo,
            file
            ) VALUES (
                '${polo}',
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

    getAllServicoAtividade(req, res) {
        const query = `SELECT * FROM servicos_atividades ORDER BY data DESC`;

        connection.query(query, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });

    },
    
    updateServicoAtividade(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formOrcamentoContabil);
        
        const polo = dataForm.polo;
        const tipoArquivo = dataForm.tipoArquivo;
        const data = dataForm.data || '';
        const periodo = dataForm.periodo || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/servicos-atividades/${req.files[0]?.filename}` : dataForm.file;

        const query = 'UPDATE `servicos_atividades` SET `polo`= ?,' +
            '`tipoArquivo`= ?,' +
            '`data`= ?,' +
            '`periodo`= ?,' +
            '`file`= ?' +
            'WHERE `servicos_atividades`.`ID`= ?';

        connection.query(query, [
            polo,
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

    deleteServicoAtividade(req, res) {
        const id = parseInt(req.params.id);
        const query = `DELETE FROM servicos_atividades WHERE ID = ?`;

        connection.query(query, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}