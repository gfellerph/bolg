import Sendgrid from 'sendgrid';
import { buildNotificationMail } from 'src/server/modules/build';

const { mail } = Sendgrid;
const sender = new mail.Email(process.env.SENDGRID_SENDER, 'Bis när - Steffi u Phippu');
const sendgrid = Sendgrid(process.env.SENDGRID_API_KEY);

// Put together a single api call for sendgrid
const buildAPICall = (post, subscriber) => {
  const html = buildNotificationMail(post, subscriber);
  const reciever = new mail.Email(subscriber.email);
  const content = new mail.Content('text/html', html);
  const subject = `Hey ${subscriber.name}, es git e nöii Gschicht uf bisnär.ch`;
  const mailToSend = new mail.Mail(sender, subject, reciever, content);
  return sendgrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mailToSend.toJSON(),
  });
}

export default (post, subscribers) => {
  // Don't send mails to everyone if this is not production
  // TODO: remove this once production has its own db
  if (process.env.ENVIRONMENT !== 'PRODUCTION') {
    /* eslint no-param-reassign:0 */
    subscribers = [
      { name: 'Phippu Test', email: 'tuelsch@gmail.com' },
    ]
  }

  const apiCalls = subscribers.map(subscriber => sendgrid.API(buildAPICall(post, subscriber)));
  return Promise.all(apiCalls);
}
