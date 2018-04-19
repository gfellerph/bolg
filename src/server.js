import express from 'express';
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import herokuSslRedirect from 'heroku-ssl-redirect';
import mongoose from 'mongoose';
import io from 'socket.io';
import redirectRoutes from 'src/server/routes/redirect-routes';
import apiRoutes from 'src/server/routes/api-routes';
import migrationRoutes from 'src/server/routes/migration-routes';
import errorRoutes from 'src/server/routes/error-routes';
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
  .then(() => console.log('Blog built'))
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
app.use(redirectRoutes);
app.use('/api', apiRoutes);
app.use('/migrate', migrationRoutes);
app.use(errorRoutes);

/* eslint no-unused-vars: 0 */
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') !== 'production' ? err : { message: err.message };
  res.status(err.status || 500);

  if (req.accepts('json')) {
    res.json({ message: err.message });
    return;
  }

  // render the error page
  res.render('error');
});

export default app;
