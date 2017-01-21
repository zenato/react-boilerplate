import { emojify } from 'node-emoji';
import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { resolveApp } from './paths';
import hbsHelpers from './hbsHelpers';
import serverRendering from './serverRendering';
import { saveAccessToken } from '../shared/state/actions/common';
import { fetchSignedInfo } from '../shared/state/actions/user';

const app = express();
const debug = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;

const hbsConfig = {
  defaultLayout: 'default',
  extname: '.hbs',
  helpers: hbsHelpers,
};

if (!debug) {
  app.use('/static', express.static(resolveApp(process.env.STATIC_PATH)));
}

app.engine('hbs', exphbs(hbsConfig));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(cookieParser());

app.enable('trust proxy');
app.disable('x-powered-by');

// Static resources
app.use('/public', express.static('public'));

// Server rendering
const preload = async (req, res, store) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      store.dispatch(saveAccessToken(accessToken));
      await store.dispatch(fetchSignedInfo(true));
    }
  } catch (e) {
    store.dispatch(saveAccessToken(null));
  }
};
const render = (res, model) => res.render('index', model);
app.use(serverRendering(preload, render));

// NotFound
app.use((req, res) => {
  res.status(404).render('pageNotFound');
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).render('error', { message: err.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.info(emojify(`:sparkles:  Server listening on ${port}.`));
});
