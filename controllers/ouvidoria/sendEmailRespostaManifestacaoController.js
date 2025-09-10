const nodemailer = require('nodemailer');

module.exports = {
    sendEmail(req, res) {
        const secretaria = req.secretaria;
        const email = req.email;
        const protocolo = req.protocolo;
        const resposta = req.resposta;

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
                        Recebemos sua manifestação registrada sob o Protocolo <strong>${protocolo}</strong> e agradecemos por entrar em contato conosco.
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 10px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                       Após análise, segue a resposta à sua manifestação:
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 30px;display: block; font-size: 16px;color: rgb(46, 46, 46);">
                       <strong>${resposta}</strong>
                    </span>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;" valign="top">
                    <span style="font-family: 'Nunito', sans-serif; font-weight: 500;margin-bottom: 30px;display: block; font-size: 18px;color: rgb(46, 46, 46);">
                        Caso tenha dúvidas ou precise de mais informações, estamos à disposição.
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
            subject: `Resposta Ouvidoria - ${secretaria == 'CPSMCR' ? 'CPSM de Crateús' : secretaria == 'CEO' ? 'CEO' : 'POLICLÍNICA'}`,
            text: htmlEmail,
            html: htmlEmail,
            ...(bccMail && { bcc: bccMail })
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                return console.log(err);
            }
            return res.status(200).send({ message: `EMAIL ENVIADO` });
        });
    }


}