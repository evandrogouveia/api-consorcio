const nodemailer = require('nodemailer');

module.exports = {
    sendEmail(req, res) {
        const secretaria = req.secretaria;
        const email = req.email;
        const protocolo = req.protocolo

        let htmlEmail = `
        <table style="font-size: 12px;margin: auto;width: 650px;" cellspacing="0">
        <thead>
            <tr>
                <td style="text-align: center;background:rgb(226, 228, 248);"  valign="top" >
                    <img width="130" height="auto" alt="logo" style="margin-top:10px;margin-bottom: 20px;" src="https://cpsmcrateus.ce.gov.br/api-consorcio/uploads/header/1741634375888-logo-consorcio.png">
                </td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: left;"  valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 700;font-size: 20px;margin-top: 30px;margin-bottom: 30px;display: block;color:rgb(46, 46, 46);">
                        Prezado(a) cidadão(ã),
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 30px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                        Recebemos sua manifestação enviada à ${secretaria == 'CPSMCR' ? 'Ouvidoria do Consórcio Publico de Saúde Microrregião de Crateús.' : 
                          secretaria == 'CEO' ? 'Centro de Especialidades Odontológicas.' : 'Policlínica Raimundo Soares Resende.'}
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 30px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                        O número do seu protocolo é <strong>${protocolo}</strong>. Guarde este número para acompanhar o andamento da sua solicitação.
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 30px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                        Nosso compromisso é analisar cuidadosamente sua demanda e responder no menor prazo possível. Caso haja necessidade de informações adicionais, entraremos em contato.
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 30px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                        Agradecemos sua participação e estamos à disposição para esclarecer dúvidas.
                    </span>
                </td>
            </tr>
             <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 10px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                        Atenciosamente,
                    </span>
                </td>
            </tr>
             <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 40px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                       Ouvidoria - ${secretaria == 'CPSMCR' ? 'CPSM de Crateús' : secretaria == 'CEO' ? 'CEO' : 'POLICLÍNICA'}
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif;margin-bottom: 15px;display: block; font-weight: 700;font-size: 18px;color: rgb(46, 46, 46);">
                        Consulte o andamento de sua manifestação no botão abaixo
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: center;" valign="top">
                       <a style="font-family: 'Nunito', sans-serif;display: block; font-weight: 600;font-size: 16px;color: #ffffff; background: #305081; width: 250px;margin: 30px auto 40px;
                       padding: 15px; border-radius: 5px;text-decoration: none;color: #ffffff" 
                       href="https://cpsmcrateus.ce.gov.br/#/consulta-manifestacao" target="_blank">
                        Consultar Manifestação
                       </a>
                </td>
            </tr>

        </tbody>
        <tfoot style="background: #f5f5f5;">
            <tr>
                <td style="text-align: left;padding: 15px 30px 0" valign="top">
                    <span style="font-family: 'Nunito', sans-serif;display: block;font-weight: 500;font-size: 13px;color: #273d47;">
                        Atenção: Esta é uma mensagem automática, não é necessário respondê-la
                    </span>
                </td>
            </tr>
            <tr>
            <td style="text-align: left;padding: 15px 30px 0" valign="top"></td>
        </tr>
        </tfoot>
    </table>
    `;

        let sesAccessKey = process.env.MAIL_USER;
        let sesSecretKey = process.env.MAIL_PASSWORD;

        const transporter = nodemailer.createTransport({
            port: 465,               // true for 465, false for other ports
            host: "mail.cpsmcrateus.ce.gov.br",
            auth: {
                user: sesAccessKey,
                pass: sesSecretKey
            },
            secure: true,
        });

        let bccMail;

        switch (secretaria) {
            case 'CPSMCR':
              bccMail = 'ouvidoria@cpsmcrateus.ce.gov.br';
              break;
            case 'CEO':
              bccMail = 'ouvidoriaceo7@gmail.com';
              break;
            default:
              bccMail = 'ouvidoriapoliclinica354@gmail.com';
        }

        const mailOptions = {
            to: email,
            from: `ouvidoria@cpsmcrateus.ce.gov.br`,
            subject: `Ouvidoria - ${secretaria == 'CPSMCR' ? 'CPSM de Crateús' : secretaria == 'CEO' ? 'CEO' : 'POLICLÍNICA'}`,
            text: htmlEmail,
            html: htmlEmail,
            ...(bccMail && { bcc: bccMail })
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                return console.log(err);
            }
            console.log('email enviado!')
            return res.status(200).send({ message: `EMAIL ENVIADO` });
        });
    }


}