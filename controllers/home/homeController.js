const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/home`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),

    registerHome(req, res) {
        let dataForm = JSON.parse(req.body.formHome);
        const categories = dataForm.categories;

        if (req.files.banner1) { dataForm.banners.banner1 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner1[0]?.filename}` };
        if (req.files.banner2) { dataForm.banners.banner2 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner2[0]?.filename}` };
        if (req.files.banner3) { dataForm.banners.banner3 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner3[0]?.filename}` };
        if (req.files.banner4) { dataForm.banners.banner4 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner4[0]?.filename}` };
        if (req.files.banner5) { dataForm.banners.banner5 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner5[0]?.filename}` };
        if (req.files.banner6) { dataForm.banners.banner6 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner6[0]?.filename}` };

        const newHome = `INSERT INTO home(
            categories,
            banners
            ) VALUES (
                '${JSON.stringify(categories)}',
                '${JSON.stringify(dataForm.banners)}'
            )`;

        connection.query(newHome, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao cadastrar dados', error: error });
            } else {
                res.status(200).json({ status: 1, message: 'dados cadastrado!' });
            }
        });

    },

    getHome(req, res) {
        const selectHome = `SELECT * FROM home`;

        connection.query(selectHome, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateHome(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formHome);

        const categories = dataForm.categories;

        req.files.banner1 ? dataForm.banners.banner1 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner1[0]?.filename}` : dataForm.banners.banner1 = dataForm.banners.banner1;
        req.files.banner2 ? dataForm.banners.banner2 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner2[0]?.filename}` : dataForm.banners.banner2 = dataForm.banners.banner2;
        req.files.banner3 ? dataForm.banners.banner3 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner3[0]?.filename}` : dataForm.banners.banner3 = dataForm.banners.banner3;
        req.files.banner4 ? dataForm.banners.banner4 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner4[0]?.filename}` : dataForm.banners.banner4 = dataForm.banners.banner4;
        req.files.banner5 ? dataForm.banners.banner5 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner5[0]?.filename}` : dataForm.banners.banner5 = dataForm.banners.banner5;
        req.files.banner6 ? dataForm.banners.banner6 = `${process.env.BASE_URL}/api-consorcio/uploads/home/${req.files.banner6[0]?.filename}` : dataForm.banners.banner6 = dataForm.banners.banner6;

        const updateHome = 'UPDATE `home` SET `banners`= ?,' +
            '`categories`= ?' +
            'WHERE `home`.`ID`= ?';

        connection.query(updateHome, [
            JSON.stringify(dataForm.banners),
            JSON.stringify(categories),
            id
        ], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao atualizar dados', error: error });
            } else {
                res.status(200).json({ status: 0, message: 'Dados atualizado!' });
            }
        });
    },

    getPublicacoes(req, res) {
        const query = `
            -- Último arquivo da POLICLÍNICA RAIMUNDO SOARES RESENDE
            (SELECT 
                id, 
                typeFile, 
                secretary, 
                date, 
                file, 
                'polo' as source,
                DATE_FORMAT(date, '%d/%m/%Y %H:%i') as formattedDate,
                'POLICLÍNICA RAIMUNDO SOARES RESENDE' as secretaria_tipo
            FROM arquivos_polo
            WHERE secretary IN ('POLICLÍNICA RAIMUNDO SOARES RESENDE', 'POLICLÍNICA REGIONAL DE CRATEÚS RAIMUNDO SOARES RESENDE')
            ORDER BY date DESC
            LIMIT 1)
            
            UNION ALL
            
            -- Último arquivo do CENTRO DE ESPECIALIDADES ODONTOLOGICAS
            (SELECT 
                id, 
                typeFile, 
                secretary, 
                date, 
                file, 
                'polo' as source,
                DATE_FORMAT(date, '%d/%m/%Y %H:%i') as formattedDate,
                'CENTRO DE ESPECIALIDADES ODONTOLOGICAS' as secretaria_tipo
            FROM arquivos_polo
            WHERE secretary IN ('CENTRO DE ESPECIALIDADES ODONTOLOGICAS', 'CENTRO DE ESPECIALIDADES ODONTOLOGICAS DR. SILVIO GERALDO FIGUEIREDO FROTA')
            ORDER BY date DESC
            LIMIT 1)
            
            UNION ALL
            
            -- Último arquivo do CONSÓRCIO PÚBLICO DE SAÚDE DA MICRORREGIÃO DE CRATEÚS
            (SELECT 
                id, 
                typeFile, 
                secretary, 
                date, 
                file, 
                'polo' as source,
                DATE_FORMAT(date, '%d/%m/%Y %H:%i') as formattedDate,
                'CONSÓRCIO PÚBLICO DE SAÚDE' as secretaria_tipo
            FROM arquivos_polo
            WHERE secretary = 'CONSÓRCIO PÚBLICO DE SAÚDE DA MICRORREGIÃO DE CRATEÚS'
            ORDER BY date DESC
            LIMIT 1)
            
            UNION ALL
            
            -- Último arquivo do Processo Seletivo
            (SELECT 
                id, 
                typeFile, 
                NULL as secretary, 
                date, 
                file, 
                'seletivo' as source,
                DATE_FORMAT(date, '%d/%m/%Y %H:%i') as formattedDate,
                'PROCESSO SELETIVO' as secretaria_tipo
            FROM processoseletivo
            ORDER BY date DESC
            LIMIT 1)
            
            ORDER BY secretaria_tipo
        `;

        connection.query(query, [], function (error, results, fields) {
            if (error) {
                console.error('Erro ao buscar publicações:', error);
                res.status(400).json({ 
                    status: 0, 
                    message: 'Erro ao obter publicações', 
                    error: error 
                });
            } else {
                // Processar o campo file do processo seletivo (se for JSON)
                const processedResults = results.map(item => {
                    if (item.source === 'seletivo' && item.file) {
                        try {
                            // Tenta fazer parse do JSON se necessário
                            if (typeof item.file === 'string' && item.file.startsWith('[')) {
                                item.file = JSON.parse(item.file);
                            }
                        } catch (e) {
                            console.error('Erro ao parsear file do processo seletivo:', e);
                        }
                    }
                    return item;
                });
                
                res.status(200).json({ 
                    status: 1, 
                    message: 'Publicações obtidas com sucesso',
                    data: processedResults 
                });
            }
        });
    }


}