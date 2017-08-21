import Sendgrid from 'sendgrid';

const helper = Sendgrid.mail;
const sender = new helper.Email('adiemerci@bisnär.ch');
const reciever = new helper.Email('tuelsch@gmail.com');
const content = new helper.Content('text/plain', 'He, tsäueli');
const subject = 'Nöis mail';
const mail = new helper.Mail(sender, subject, reciever, content);
const sendgrid = Sendgrid(process.env.SENDGRID_API_KEY);
const request = sendgrid.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

export default function () {
  return sendgrid.API(request)
    .then((response) => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch((error) => {
      console.error(error);
    });
}
