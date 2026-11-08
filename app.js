require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const ejsMate = require('ejs-mate');
const pageRoutes = require("./routes/pageRoutes");
const viewLocals = require('./config/viewLocals');
// const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://cdn.jsdelivr.net"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      "img-src": ["'self'", "data:"]
    }
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'queueless.sid',
  secret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 4
  }
}));
app.use(viewLocals);
app.use('/', pageRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'QueueLess' }));
// app.use(notFound);
// app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log(`QueueLess is running at http://localhost:${PORT}`));
}

module.exports = app;
