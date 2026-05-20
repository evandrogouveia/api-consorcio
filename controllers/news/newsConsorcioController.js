const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/news_consorcio`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),

    //cadastra uma nova notícia
    async newConsorcioNews(req, res) {
        let dataForm = JSON.parse(req.body.formNews);
        const title = dataForm.title;
        const subtitle = dataForm.subtitle || '';
        const highlightedImage = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/news_consorcio/${req.files[0]?.filename}` : '';
        const description = dataForm.description || '';
        const categories = dataForm.categories || '';
        const publicationDate = dataForm.publicationDate || '';
        const views = dataForm.views;
        const author = dataForm.author || '';
        const comments = dataForm.comments || '';

        const newRole = `INSERT INTO newsConsorcio(
            title,
            subtitle,
            highlightedImage,
            description,
            categories,
            publicationDate,
            views,
            author,
            comments
            ) VALUES (
                '${title}',
                '${subtitle}', 
                '${highlightedImage}', 
                '${description}',
                '${JSON.stringify(categories)}',
                '${publicationDate}',
                '${views}',
                '${author}',
                '${JSON.stringify(comments)}'
            )`;

        connection.query(newRole, [], function (error, resultsRegister, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao inserir notícia', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'sucesso!' });
            }
        });
    },

    //retorna todos as notícias
    getConsorcioNews(req, res) {
        const selectNews = `SELECT * FROM newsConsorcio ORDER BY publicationDate DESC`;

        connection.query(selectNews, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter notícias', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    //atualiza a notícia
    updateConsorcioNews(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formNews);
        const title = dataForm.title;
        const subtitle = dataForm.subtitle || '';
        const highlightedImage = req.files[0]?.filename ? `${process.env.BASE_URL}/uploads/news_consorcio/${req.files[0]?.filename}` : dataForm.highlightedImage;
        const description = dataForm.description || '';
        const categories = dataForm.categories || '';
        const publicationDate = dataForm.publicationDate || '';
        const views = dataForm.views;
        const author = dataForm.author || '';
        const comments = dataForm.comments || '';

        const updateNews = 'UPDATE `newsConsorcio` SET `title`= ?,' +
            '`subtitle`= ?,' +
            '`highlightedImage`= ?,' +
            '`description`= ?,' +
            '`categories`= ?,' +
            '`publicationDate`= ?,' +
            '`views`= ?,' +
            '`author`= ?,' +
            '`comments`= ?' +
            'WHERE `newsConsorcio`.`ID`= ?';

        connection.query(updateNews,
            [
                title,
                subtitle,
                highlightedImage,
                description,
                JSON.stringify(categories),
                publicationDate,
                views,
                author,
                JSON.stringify(comments),
                id
            ], function (error, results, fields) {
                if (error) {
                    res.status(400).json({ status: 0, message: 'Erro ao atualizar a notícia', error: error });
                } else {
                    res.status(200).json(results);
                }
            });

    },

    //deleta a notícia
    deleteConsorcioNews(req, res) {
        const id = parseInt(req.params.id);
        const deleteNews = `DELETE FROM newsConsorcio WHERE ID = ?`;

        connection.query(deleteNews, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir notícia', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }

}