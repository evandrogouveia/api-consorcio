const connection = require('../../database/connection');
const sendEmailRespostaManifestacaoController = require('./sendEmailRespostaManifestacaoController');

module.exports = {

    newRespostaManifestacao(req, res) {
        try {
            const values = [
                req.body.IDmanifestacao,
                req.body.protocolo,
                req.body.resposta || '',
            ];

            const sql = `
                INSERT INTO resposta_manifestacoes (
                    IDmanifestacao, protocolo, resposta, dataResposta
                ) VALUES (?, ?, ?, NOW())`;

            connection.query(sql, values, function (error, resultsRegister, fields) {
                if (error) {
                    return res.status(400).json({ status: 0, message: 'Erro ao inserir resposta', error });
                } else {
                    const dataRespostaManifestacao = {
                        secretaria: req.body.secretaria,
                        email: req.body.email != undefined ? req.body.email : 'anonimo@cpsmcrateus.ce.gov.br',
                        protocolo: req.body.protocolo,
                        resposta: req.body.resposta
                    }

                    sendEmailRespostaManifestacaoController.sendEmail(dataRespostaManifestacao, res);
                    res.status(200).json({ status: 1, message: 'Sucesso!' });
                }

            });
        } catch (err) {

            res.status(500).json({ status: 0, message: 'Erro ao processar os dados', error: err.message });
        }
    },

    getAllRespostasManifestacao(req, res) {
        const selectTypeAmendment = `SELECT * FROM resposta_manifestacoes ORDER BY dataResposta`;

        connection.query(selectTypeAmendment, [], function (error, results, fields) {
            if (error) {
                res.status(400).json({ status: 0, message: 'Erro ao obter dados', error: error });
            } else {
                res.status(200).json(results);
            }
        });
    },

    updateRespostaManifestacao(req, res) {
        try {
            const { ID, resposta } = req.body;

            if (!ID || !resposta) {
                return res.status(400).json({ status: 0, message: 'ID da manifestação e resposta são obrigatórios' });
            }

            const sql = `
                UPDATE resposta_manifestacoes SET resposta = ? WHERE ID = ?
            `;

            const values = [resposta, ID];

            connection.query(sql, values, function (error, results) {
                if (error) {
                    return res.status(400).json({ status: 0, message: 'Erro ao atualizar resposta', error });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ status: 0, message: 'Nenhuma resposta encontrada para atualizar' });
                }

                res.status(200).json({ status: 1, message: 'Resposta atualizada com sucesso!' });
            });

        } catch (err) {
            res.status(500).json({ status: 0, message: 'Erro ao processar os dados', error: err.message });
        }
    },

    deleteRespostaManifestacao(req, res) {
        try {
            const ID = parseInt(req.params.id); // Pega o ID da URL

            if (!ID) {
                return res.status(400).json({ status: 0, message: 'ID da manifestação é obrigatório' });
            }

            const sql = `DELETE FROM resposta_manifestacoes WHERE ID = ?`;

            connection.query(sql, [ID], function (error, results) {
                if (error) {
                    return res.status(400).json({ status: 0, message: 'Erro ao excluir resposta', error });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ status: 0, message: 'Nenhuma resposta encontrada para excluir' });
                }

                res.status(200).json({ status: 1, message: 'Resposta excluída com sucesso!' });
            });

        } catch (err) {
            res.status(500).json({ status: 0, message: 'Erro ao processar os dados', error: err.message });
        }
    }




}