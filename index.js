const express = require('express');
const server = express();
const cors = require('cors');
const projectModel = require('./data/helpers/projectModel');
const actionModel = require('./data/helpers/actionModel');

server.use(cors());
server.use(express.json());

//BEGIN PROJECTS CRUD
server.get('/projects/', async (req, res, next) => {
  try {
    const projects = await projectModel.get();
    res.status(200).json(projects);
  } catch(err) {
    next({
      code: 500,
      userMessage: "Server Error: Projects could not be retrieved",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})

server.get('/projects/:id', async (req, res, next) => {
  try {
    /* If the ID you provide is invalid the API will throw an error instead of
    returning a failed response so I just made the server error a 404 */
    const project = await projectModel.get(req.params.id);
    res.status(200).json(project);
  } catch(err) {
    next({
      code: 404,
      userMessage: "Not Found: Project not found",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})

server.post('/projects', async (req, res, next) => {
  try {
    const {name, description} = req.body;
    if (!(name && description)) {
      return next({
        code: 400,
        userMessage: "Bad Request: Provide a name and description"
      });
    }
    if (name.length > 128) {
      return next({
        code: 400,
        userMessage: `Bad Request: Name is ${name.length} characters, must be 128 or less`
      });
    }
    const newProject = await projectModel.insert({name, description});
    res.status(201).json(newProject);
  } catch(err) {
    next({
      code: 500,
      userMessage: "Server Error: Project could not be created",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})

server.delete('/projects/:id', async (req, res, next) => {
  try {
    const deleted = await projectModel.remove(req.params.id);
    if (deleted) return res.status(200).json({result: deleted, message: "DELETED"});
  } catch(err) {
    next({
      code: 500,
      userMessage: "Server Error: Project could not be created",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})

server.put('/projects/:id', async (req, res, next) => {
  const {name, description} = req.body;
  if (!(name && description)) {
    return next({
      code: 400,
      userMessage: "Bad Request: Provide a name and description"
    });
  }
  if (name.length > 128) {
    return next({
      code: 400,
      userMessage: `Name is ${name.length} characters, must be 128 or less`
    });
  }
  try {
    const updatedProject = await projectModel.update(req.params.id, {name, description});
    res.status(200).json(updatedProject);
  } catch(err) {
    next({
      code: 500,
      userMessage: "Server Error: Project could not be created",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})

server.get('/projects/:id/actions', async (req, res, next) => {
  try {
    const actions = await projectModel.getProjectActions(req.params.id);
    res.status(200).json(actions);
  } catch(err) { //Once again 404 here because API method throws Error
    next({
      code: 404,
      userMessage: "Server Error: Project not found",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})
//END PROJECTS CRUD

//BEGIN ACTIONS CRUD
server.get('/actions/', async (req, res, next) => {
  try {
    const actions = await actionModel.get();
    res.status(200).json(actions);
  } catch(err) {
      next({code: 500,
        userMessage: "Server Error: Actions could not be retrieved",
        consoleMessage: err});
    }
})

server.get('/actions/:id', async (req, res, next) => {
  try {
    const action = await actionModel.get(req.params.id);
    res.status(200).json(action);
  } catch(err) {
    next({code: 404, userMessage: `NotFound: No action with id ${req.params.id} `, consoleMessage: err});
    //Note previous comments about get methods in these DBs
  }
})

server.post('/actions/', async (req, res, next) => {
  const {project_id, description, notes} = req.body;
  if (!(project_id && description && notes)) {
    return next({
      code: 400,
      userMessage: "Bad Request: Provide a project_id, description and notes"
    });
  }
  if (description.length > 128) {
    return next({
      code: 400,
      userMessage: `Bad Request: Description is ${description.length} characters, must be 128 or less`
    });
  }
  try {
    newAction = await actionModel.insert({project_id, description, notes})
    res.status(200).json(newAction);
  } catch(err) {
      next({
        code: 500,
        userMessage: "Server Error: Action could not be created",
        consoleError: err,
        consoleMessage: `${err}`
      });
  }
})

server.delete('/actions/:id', async (req, res, next) => {
  try {
    const deleted = await actionModel.remove(req.params.id);
    if (deleted) return res.status(200).json({result: deleted, message: "DELETED"});
  } catch(err) {
    next({
      code: 500,
      userMessage: "Server Error: Project could not be created",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})

server.put('/actions/:id', async (req, res, next) => {
  const {project_id, description, notes} = req.body;
  if (!(project_id && description && notes)) {
    return next({
      code: 400,
      userMessage: "Bad Request: Provide a project_id, description and notes"
    });
  }
  if (description.length > 128) {
    return next({
      code: 400,
      userMessage: `Bad Request: Description is ${description.length} characters, must be 128 or less`
    });
  }
  try {
    const updatedAction = await actionModel.update(req.params.id, {project_id, description, notes});
    res.status(200).json(updatedAction);
  } catch(err) {
    next({
      code: 500,
      userMessage: "Server Error: Project could not be created",
      consoleError: err,
      consoleMessage: `${err}`
    });
  }
})
//END ACTIONS CRUD

server.use((err, req, res, next) => {
  switch(err.code) {
    case 500:
    res.status(err.code).send({
      success: false,
      statusCode: err.code,
      message: err.userMessage,
      consoleError: err.consoleError,
      consoleMessage: err.consoleMessage
    })
    break;
    case 404:
    res.status(err.code).send({
      success: false,
      statusCode: err.code,
      message: err.userMessage,
      consoleError: err.consoleError,
      consoleMessage: err.compilerMessage
    })
    break;
    case 400:
    res.status(err.code).send({
      success: false,
      statusCode: err.code,
      message: err.userMessage,
      consoleError: err.consoleError,
      consoleMessage: err.compilerMessage
    })
    break;
    default:
      res.status(500).send({
        success: fasle,
        checked: faslse,
        statusCode: 500,
        consoleError: err.consoleError,
        message: "You have an uncaught error"
      })
    break;
  }
})

server.listen(8000, () => {console.log("App is listening...")});
