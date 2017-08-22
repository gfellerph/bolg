import Sendgrid from 'sendgrid';
import firebase from '@/config/firebase-admin';
import { objectToArray } from '@/config/constants';

const helper = Sendgrid.mail;
const sender = new helper.Email('tuelsch@gmail.com', 'Philipp Gfeller');
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
      console.log(JSON.stringify(response.body));
      console.log(response.statusCode);
      console.log(response.headers);
    })
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
}
