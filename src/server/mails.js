import Sendgrid from 'sendgrid';
import firebase from 'src/config/firebase-admin';
import { objectToArray } from 'src/config/constants';
import * as hbsTemplates from 'src/config/handlebars';
import { logoURL } from 'src/server/helpers';

const helper = Sendgrid.mail;
const sender = new helper.Email('tuelsch@gmail.com', 'Philipp Gfeller');
const sendgrid = Sendgrid(process.env.SENDGRID_API_KEY);

/**
 * Build a single personalized email, ready to be sent
 * @param {Subscriber} subscriber The subscriber object
 * @param {Post} post The post to notify the subscriber about
 * @returns {String} Compiled HTML mail template
 */
function buildNotificationMail(subscriber, post) {
  return hbsTemplates.mail({
    post,
    subscriber,
    logoUrl: `https://bisnär.ch${logoURL()}`,
  });
}

const buildAPICall = (post, subscriber) => {
  const html = buildNotificationMail(subscriber, post);
  const reciever = new helper.Email(subscriber.email);
  const content = new helper.Content('text/html', html);
  const subject = `Hey ${subscriber.displayName}, es git e nöii Gschicht uf bisnär.ch`;
  const mail = new helper.Mail(sender, subject, reciever, content);
  return sendgrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });
}

export default function enqueueNotifications(post) {
  const ref = firebase.database().ref('/subscribers');
  return new Promise((resolve, reject) => {
    ref.once('value', (snapshot) => {
      const val = snapshot.val();
      const subscribers = objectToArray(val);

      Promise.all(subscribers.map(subscriber => sendgrid.API(buildAPICall(post, subscriber))))
        .then(resolve)
        .catch(reject);
    });
  });
}
