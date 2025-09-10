const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/polos`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),

    //cadastra um novo polo
    newPolo(req, res) {
        let dataForm = JSON.parse(req.body.formPolo)
        const image = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/polos/${req.files[0]?.filename}` : '';
        const title = dataForm.title || '';
        const subtitle = dataForm.subtitle || '';
        const imagens = dataForm.imagens || '';
        const apresentacao = dataForm.apresentacao || '';
        const responsavel = dataForm.responsavel || '';
        const institutional = dataForm.institutional || '';
        const contacts = dataForm.contacts || '';
        const address = dataForm.address || '';
        const functions = dataForm.functions || '';
        const links = dataForm.links || '';

        const newPolo = `INSERT INTO polos(
            image,
            title,
            subtitle, 
            imagens,
            apresentacao,
            responsavel,
            institutional,
            contacts,
            address,
            functions,
            links
            ) VALUES (
                '${image}',
                '${title}',
                '${subtitle}', 
                '${JSON.stringify(imagens)}}', 
                '${apresentacao}', 
                '${JSON.stringify(responsavel)}', 
                '${JSON.stringify(institutional)}', 
                '${JSON.stringify(contacts)}',
                '${JSON.stringify(address)}',
                '${functions}',
                '${JSON.stringify(links)}'
            )`;

        connection.query(newPolo, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir polo', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    //retorna todos os polos
    getPolos(req, res) {
        const selectPolos = `SELECT * FROM polos ORDER BY title`;

        connection.query(selectPolos, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter polos', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    //atualiza o polo
    updatePolo(req, res) {
        let dataForm = JSON.parse(req.body.formPolo);
        const imagensArray = [];

        if (req.files?.imagens) {
            for (let i in req.files?.imagens) {
                imagensArray.push(`${process.env.BASE_URL}/api-consorcio/uploads/polos/${req.files.imagens[i]?.filename}`);
                dataForm.imagens = imagensArray;
            }
        } else {
            dataForm.imagens = dataForm.imagens;
        }

        const id = parseInt(req.params.id);
        const image = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/polos/${req.files[0]?.filename}` : dataForm.image;
        const title = dataForm.title;
        const subtitle = dataForm.subtitle;
        const imagens = dataForm.imagens || '';
        const apresentacao = dataForm.apresentacao || '';
        const responsavel = dataForm.responsavel || '';
        const institutional = dataForm.institutional;
        const contacts = dataForm.contacts;
        const address = dataForm.address;
        const functions = dataForm.functions;
        const links = dataForm.links || '';

        const updatePolo = 'UPDATE `polos` SET `image`= ?,' +
            '`title`= ?,' +
            '`subtitle`= ?,' +
            '`imagens`= ?,' +
            '`apresentacao`= ?,' +
            '`responsavel`= ?,' +
            '`institutional`= ?,' +
            '`contacts`= ?,' +
            '`address`= ?,' +
            '`functions`= ?,' +
            '`links`= ?' +
            'WHERE `polos`.`ID`= ?';

        connection.query(updatePolo,
            [
                image,
                title,
                subtitle,
                JSON.stringify(imagens),
                apresentacao,
                JSON.stringify(responsavel),
                JSON.stringify(institutional),
                JSON.stringify(contacts),
                JSON.stringify(address),
                functions,
                JSON.stringify(links),
                id
            ], function (error, results, fields) {
                if (error) {
                    res.status(400).json({ status: 0, message: 'Erro atualizar o polo', error: error });
                } else {
                    res.status(200).json(results);
                }
            });

    },

    //deleta o polo
    deletePolo(req, res) {
        const id = parseInt(req.params.id);
        const deletePolo = `DELETE FROM polos WHERE ID = ?`;

        connection.query(deletePolo, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir polo', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}