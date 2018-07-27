const express = require('express');
const server = express();
const actionModel = require('./data/helpers/actionModel');
const projectModel = require('./data/helpers/projectModel');

server.use(express.json());

server.get('/actions/', async (req, res, next) => {
  try {
    const actions = await actionModel.get();
    res.status(200).json(actions);
  } catch(err) {
      next({code: 500, userMessage: "Server Error: Action could not be retrieved", consoleMessage: err});
    }
})

server.get('/actions/:id', async (req, res, next) => {
  try {
    const action = await actionModel.get(req.params.id);
    res.status(200).json(action);
  } catch(err) {
    next({code: 404, userMessage: `NotFound: No action with id ${req.params.id} `, consoleMessage: err});
    //May want to come back and rewrite this error, I don't know if it's entirely accurate
  }
})

server.use((err, req, res, next) => {
  switch(err.code) {
    case 500:
    res.status(err.code).send({
      success: false,
      statusCode: err.code,
      message: err.userMessage,
      consoleMessage: err.compilerMessage
    })
    break;
    case 404:
    res.status(err.code).send({
      success: false,
      statusCode: err.code,
      message: err.userMessage,
      consoleMessage: err.compilerMessage
    })
    break;
    case 400:
    res.status(err.code).send({
      success: false,
      statusCode: err.code,
      message: err.userMessage,
      consoleMessage: err.compilerMessage
    })
    break;
    default:
      res.status(500).send({
        success: fasle,
        checked: faslse,
        statusCode: 500,
        message: "You have an uncaught error"
      })
    break;
  }
})

server.listen(8000, () => {console.log("App is listening...")});
