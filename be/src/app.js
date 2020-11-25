const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const urlsRoute = require('./routes/urls');
const capturesRoute = require('./routes/captures');
const comparisonsRoute = require('./routes/comparisons');
const actionsRoute = require('./routes/actions');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/urls', urlsRoute);
app.use('/captures', capturesRoute);
app.use('/comparisons', comparisonsRoute);
app.use('/actions', actionsRoute);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Differ Backend API',
      version: '0.1.0',
      description:
        'This is an API to communicate with the Differ app backend to perform operations with URLs and comparisons',
    },
    servers: [
      {
        url: 'http://localhost:8000/',
      },
    ],
  },
  apis: ['./src/routes/urls.js'],
  apis: ['./src/routes/captures.js'],
  apis: ['./src/routes/comparisons.js'],
  apis: ['./src/routes/actions.js'],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
