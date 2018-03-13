const express = require('express');
const bodyParser = require('body-parser');
const mc = require(`./controllers/messages_controller`);
const session = require('express-session');
require('dotenv').config();

const createInitialSession = require('./middleware/session');
const filter = require('./middleware/filter');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 10000}
  })
);

app.use((req, res, next) => createInitialSession(req, res, next));
app.use((req, res, next) => {
  const {method} = req;
  if (method === 'POST' || method === 'PUT') {
    filter(req, res, next);
  } else {
    next();
  }
});

app.get('/api/messages', mc.read);
app.get('/api/messages/history', mc.history);
app.post('/api/messages', mc.create);
app.put('/api/messages', mc.update);
app.delete('/api/messages', mc.delete);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
