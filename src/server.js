import express from 'express';
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import herokuSslRedirect from 'heroku-ssl-redirect';
import mongoose from 'mongoose';
import io from 'socket.io';
import apiRoutes from 'src/server/routes/api-routes';
import migrationRoutes from 'src/server/routes/migration-routes';
import { postSpamReport } from 'src/server/api/spamreport';
import passport from 'src/config/passport';
import expressStatic from 'src/config/express-static';
import { rebuild } from 'src/server/modules/build';
import { publishedPosts } from 'src/server/modules/queries';

const app = express();

// Attach socket io for initialization in bin/www
app.io = io();

// Connect to mongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  /* eslint no-console: 0 */
  .then(() => console.log('Connected to mongodb server'))
  .then(publishedPosts)
  .then(rebuild)
  .catch((err) => { console.error(err); });

app.use(passport.initialize());

// View engine settings
app.set('views', './server/views');
app.set('view engine', 'pug');

// Redirect to https
app.use(herokuSslRedirect());

// Gzip all the things
app.use(compression());

// Serve the static files
app.use(favicon(path.resolve('public/favicon.ico')));
app.use(express.static('public', expressStatic));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api', apiRoutes);
app.use('/migrate', migrationRoutes);
app.post('/api/spamreport', postSpamReport);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
