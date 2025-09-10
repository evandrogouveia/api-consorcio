const connection = require('../../database/connection');
const multer = require('multer');
let fs = require('fs-extra');
const sendEmailManifestacaoController = require('./senEmailManifestacaoController');


function generateProtocol() {
    const timestamp = new Date().getTime();
    return `P-${timestamp}`;
}

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/manifestacao`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path); //gera o diretório automaticamente
            }
            cb(null, path);
        },
        filename: function (req, files, cb) {
            cb(null, `${Date.now()}-${files.originalname}`);
        }
    }),



    newManifestacao(req, res) {
        try {
            const dataForm = JSON.parse(req.body.formManifestacao);
            const arquivo = req.files?.[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/manifestacao/${req.files[0]?.filename}` : '';
            const protocolo = generateProtocol();

            const values = [
                dataForm.nome || '',
                dataForm.email || '',
                arquivo,
                dataForm.telefone || '',
                dataForm.sexo || '',
                dataForm.dataNascimento || '',
                dataForm.grauInstrucao || '',
                dataForm.endereco || '',
                dataForm.bairro || '',
                dataForm.estado || '',
                dataForm.municipio || '',
                dataForm.anonimo ? 1 : 0,
                dataForm.secretaria || '',
                dataForm.natureza || '',
                dataForm.mensagem || '',
                protocolo
            ];

            const sql = `
                INSERT INTO manifestacoes (
                    nome, email, arquivo, telefone, sexo, dataNascimento, 
                    grauInstrucao, endereco, bairro, estado, municipio, anonimo, 
                    secretaria, natureza, mensagem, protocolo, dataCadastro
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

            connection.query(sql, values, function (error, resultsRegister, fields) {
                if (error) {
                    return res.status(400).json({ status: 0, message: 'Erro ao inserir manifestação', error });
                } else {
                   
                    const dataManifestacao = {
                        secretaria: dataForm.secretaria,
                        email: dataForm.email != undefined ? dataForm.email : 'anonimo@cpsmcrateus.ce.gov.br ',
                        protocolo: protocolo
                    }

                    sendEmailManifestacaoController.sendEmail(dataManifestacao, res)
                    res.status(200).json({ status: 1, message: 'Sucesso!', protocolo: protocolo });
                }

            });
        } catch (err) {
            res.status(500).json({ status: 0, message: 'Erro ao processar os dados', error: err.message });
        }
    },

    getManifestacao(req, res) {
        const selectManifestacao = `SELECT * FROM manifestacoes ORDER BY dataCadastro DESC`;

        connection.query(selectManifestacao, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter manifestações', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getManifestacaoPorProtocolo(req, res) {
        try {
            const { protocolo } = req.params; // Pegando o protocolo da URL

            if (!protocolo) {
                return res.status(400).json({ status: 0, message: 'Protocolo é obrigatório' });
            }

            const sql = `SELECT 
                            m.ID,
                            m.protocolo,
                            m.nome,
                            m.email,
                            m.natureza,
                            m.mensagem,
                            m.dataCadastro,
                            r.ID,
                            r.resposta,
                            r.dataResposta
                        FROM manifestacoes m
                        LEFT JOIN resposta_manifestacoes r ON m.ID = r.IDmanifestacao
                        WHERE m.protocolo = ?;`;

            connection.query(sql, [protocolo], function (error, results) {
                if (error) {
                    return res.status(400).json({ status: 0, message: 'Erro ao buscar manifestação', error });
                }

                if (results.length === 0) {
                    return res.status(404).json({ status: 0, message: 'Nenhuma manifestação encontrada' });
                }

                // Formatar resposta: agrupar as respostas sob a manifestação
                const manifestacao = {
                    ID: results[0].ID,
                    protocolo: results[0].protocolo,
                    nome: results[0].nome,
                    email: results[0].email,
                    natureza: results[0].natureza,
                    mensagem: results[0].mensagem,
                    dataCadastro: results[0].dataCadastro,
                    respostas: results
                        .filter(r => r.ID) // Remove respostas vazias (NULL)
                        .map(r => ({
                            resposta: r.resposta,
                            dataResposta: r.dataResposta
                        }))
                };

                res.status(200).json({ status: 1, message: 'Manifestação encontrada!', data: manifestacao });
            });

        } catch (err) {
            res.status(500).json({ status: 0, message: 'Erro ao processar os dados', error: err.message });
        }
    },


    updateManifestacao(req, res) {
        const id = parseInt(req.params.id);
        let dataForm = JSON.parse(req.body.formManifestacao);
        const nome = dataForm.nome;
        const email = dataForm.email || '';
        const arquivo = req.files[0]?.filename ? `${process.env.BASE_URL}/api-consorcio/uploads/manifestacao/${req.files[0]?.filename}` : dataForm.arquivo;
        const telefone = dataForm.telefone || '';
        const sexo = dataForm.sexo || '';
        const dataNascimento = dataForm.dataNascimento || '';
        const grauInstrucao = dataForm.grauInstrucao;
        const endereco = dataForm.endereco || '';
        const bairro = dataForm.bairro || '';
        const estado = dataForm.estado || '';
        const municipio = dataForm.municipio || '';
        const anonimo = dataForm.anonimo || false;
        const secretaria = dataForm.secretaria || '';
        const natureza = dataForm.natureza || '';
        const mensagem = dataForm.mensagem || '';

        const updateManifestacao = 'UPDATE `manifestacoes` SET `nome`= ?,' +
            '`email`= ?,' +
            '`arquivo`= ?,' +
            '`telefone`= ?,' +
            '`sexo`= ?,' +
            '`dataNascimento`= ?,' +
            '`grauInstrucao`= ?,' +
            '`endereco`= ?,' +
            '`bairro`= ?,' +
            '`estado`= ?,' +
            '`municipio`= ?,' +
            '`anonimo`= ?,' +
            '`secretaria`= ?,' +
            '`natureza`= ?,' +
            '`mensagem`= ?' +
            'WHERE `manifestacoes`.`ID`= ?';

        connection.query(updateManifestacao,
            [
                nome,
                email,
                arquivo,
                telefone,
                sexo,
                dataNascimento,
                grauInstrucao,
                endereco,
                bairro,
                estado,
                municipio,
                anonimo,
                secretaria,
                natureza,
                mensagem,
                id
            ], function (error, results, fields) {
                if (error) {
                    res.status(400).json({ status: 0, message: 'Erro ao atualizar a manifestação', error: error });
                } else {
                    res.status(200).json(results);
                }
            });

    },


    deleteManifestacao(req, res) {
        const id = parseInt(req.params.id);
        const deleteManifestacao = `DELETE FROM manifestacoes WHERE ID = ?`;

        connection.query(deleteManifestacao, [id], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao excluir manifestação', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    }
}