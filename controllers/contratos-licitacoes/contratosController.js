const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/contratos`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newContract(req, res) {
        let dataForm = JSON.parse(req.body.formContract);
        
        const modality = dataForm.modality;
        const number = dataForm.number || '';
        const date = dataForm.date || '';
        const exercise = dataForm.exercise || '';
        const hiredName = dataForm.hiredName || '';
        const cpfCnpj = dataForm.cpfCnpj || '';
        const validity = dataForm.validity || '';
        const globalValue = dataForm.globalValue || '';
        const monthlyValue = dataForm.monthlyValue || '';
        const secretary = dataForm.secretary || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/contratos/${req.files[0]?.filename}` : '';
        const description = dataForm.description || '';
        const IDlicitacao = dataForm.IDlicitacao || '';


        const newContract = `INSERT INTO contracts(
            modality,
            number, 
            date,
            exercise,
            hiredName,
            cpfCnpj,
            validity,
            globalValue,
            monthlyValue,
            secretary,
            file,
            description,
            IDlicitacao
            ) VALUES (
                '${modality}',
                '${number}', 
                '${date}', 
                '${exercise}',
                '${hiredName}',
                '${cpfCnpj}',
                '${JSON.stringify(validity)}',
                '${globalValue}',
                '${monthlyValue}',
                '${secretary}',
                '${file}',
                '${description}',
                '${IDlicitacao}'
            )`;

        connection.query(newContract, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir contrato', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllContracts(req, res) {
        const selectContracts = `SELECT * FROM contracts ORDER BY date DESC`;

        connection.query(selectContracts, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter contratos', error: error });
            } else {
                res.status(200).json(results);
            }
        });

    },
    
    updateContract(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formContract);
        
        const modality = dataForm.modality;
        const number = dataForm.number || '';
        const date = dataForm.date || '';
        const exercise = dataForm.exercise || '';
        const hiredName = dataForm.hiredName || '';
        const cpfCnpj = dataForm.cpfCnpj || '';
        const validity = dataForm.validity || '';
        const globalValue = dataForm.globalValue || '';
        const monthlyValue = dataForm.monthlyValue || '';
        const secretary = dataForm.secretary || '';
        const file = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/contratos/${req.files[0]?.filename}` : dataForm.file;
        const description = dataForm.description || '';
        const IDlicitacao = dataForm.IDlicitacao || '';

        const updateContract = 'UPDATE `contracts` SET `modality`= ?,' +
            '`number`= ?,' +
            '`date`= ?,' +
            '`exercise`= ?,' +
            '`hiredName`= ?,' +
            '`cpfCnpj`= ?,' +
            '`validity`= ?,' +
            '`globalValue`= ?,' +
            '`monthlyValue`= ?,' +
            '`secretary`= ?,' +
            '`file`= ?,' +
            '`description`= ?,' +
            '`IDlicitacao`= ?' +
            'WHERE `contracts`.`ID`= ?';

        connection.query(updateContract, [
            modality,
            number,
            date,
            exercise,
            hiredName,
            cpfCnpj,
            JSON.stringify(validity),
            globalValue,
            monthlyValue,
            secretary,
            file,
            description,
            IDlicitacao,
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ message: 'Erro ao atualizar contrato', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'Contrato atualizado!' });
            }
        });
    },

    deleteContract(req, res) {
        const id = parseInt(req.params.id);
        const deleteContract = `DELETE FROM contracts WHERE ID = ?`;

        connection.query(deleteContract, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir contrato', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}