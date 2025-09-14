const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/licitacoes`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),


    newLicitacao(req, res) {
        let dataForm = JSON.parse(req.body.formLicitacao);
        const arrayFile = [];
        for(const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/uploads/licitacoes/${file?.filename}`)
        }
        const title = dataForm.title;
        const processNumber = dataForm.processNumber || '';
        const type = dataForm.type || '';
        const file = arrayFile;
        const openingDate = dataForm.openingDate || '';
        const publicationDate = dataForm.publicationDate || '';
        const estimatedValue = dataForm.estimatedValue || '';
        const description = dataForm.description || '';
        const comissionPresident = dataForm.comissionPresident || '';
        const responsibleInformin = dataForm.responsibleInforming || '';
        const responsibleTecnicalOpinion = dataForm.responsibleTecnicalOpinion || '';
        const responsibleAward = dataForm.responsibleAward || '';
        const responsibleHomologation = dataForm.responsibleHomologation || '';

        const newLicitacao = `INSERT INTO licitacoes(
            title,
            processNumber, 
            type,
            file,
            openingDate,
            publicationDate,
            estimatedValue,
            description,
            comissionPresident,
            responsibleInformin,
            responsibleTecnicalOpinion,
            responsibleAward,
            responsibleHomologation
            ) VALUES (
                '${title}',
                '${processNumber}', 
                '${type}',
                '${JSON.stringify(file)}',
                '${openingDate}',
                '${publicationDate}',
                '${estimatedValue}',
                '${description}',
                '${comissionPresident}',
                '${responsibleInformin}',
                '${responsibleTecnicalOpinion}',
                '${responsibleAward}',
                '${responsibleHomologation}'
            )`;

        connection.query(newLicitacao, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    getAllLicitacoes(req, res) {
        const selectLicitacao = `SELECT * FROM licitacoes ORDER BY ID DESC`;

        connection.query(selectLicitacao, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getSearchLicitacoes(req, res) {
        const term = req.query.term[0];

        const selectLicitacoes = `SELECT * FROM licitacoes WHERE 
        LOWER(licitacoes.description) LIKE LOWER('%${term}%') OR
        LOWER(licitacoes.title) LIKE LOWER('%${term}%') OR
        LOWER(licitacoes.processNumber) LIKE LOWER('%${term}%') OR
        LOWER(licitacoes.openingDate) LIKE LOWER('%${term}%')
        `;

        connection.query(selectLicitacoes, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },
    
    updateLicitacao(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formLicitacao);

        const arrayFile = [];
        for(const file of req.files) {
            arrayFile.push(`${process.env.BASE_URL}/uploads/licitacoes/${file?.filename}`)
        }
        
        const title = dataForm.title;
        const processNumber = dataForm.processNumber || '';
        const type = dataForm.type || '';
        const file = arrayFile.length > 0 ? arrayFile : dataForm.file;
        const openingDate = dataForm.openingDate || '';
        const publicationDate = dataForm.publicationDate || '';
        const estimatedValue = dataForm.estimatedValue || '';
        const description = dataForm.description || '';
        const comissionPresident = dataForm.comissionPresident || '';
        const responsibleInformin = dataForm.responsibleInforming || '';
        const responsibleTecnicalOpinion = dataForm.responsibleTecnicalOpinion || '';
        const responsibleAward = dataForm.responsibleAward || '';
        const responsibleHomologation = dataForm.responsibleHomologation || '';

        const updateLicitacao = 'UPDATE `licitacoes` SET `title`= ?,' +
            '`file`= ?,' +
            '`processNumber`= ?,' +
            '`type`= ?,' +
            '`openingDate`= ?,' +
            '`publicationDate`= ?,' +
            '`estimatedValue`= ?,' +
            '`description`= ?,' +
            '`comissionPresident`= ?,' +
            '`responsibleInformin`= ?,' +
            '`responsibleTecnicalOpinion`= ?,' +
            '`responsibleAward`= ?,' +
            '`responsibleHomologation`= ?' +
            'WHERE `licitacoes`.`ID`= ?';

        connection.query(updateLicitacao, [
            title,
            JSON.stringify(file),
            processNumber,
            type,
            openingDate,
            publicationDate,
            estimatedValue,
            description,
            comissionPresident,
            responsibleInformin,
            responsibleTecnicalOpinion,
            responsibleAward,
            responsibleHomologation,
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ message: 'Erro ao atualizar dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'Dados atualizado!' });
            }
        });
    },

    deleteLicitacao(req, res) {
        const id = parseInt(req.params.id);
        const deleteLicitacao = `DELETE FROM licitacoes WHERE ID = ?`;

        connection.query(deleteLicitacao, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}