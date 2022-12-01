const express = require('express');

// require controllers
const userController = require('../controllers/userController.js');
const ticketController = require('../controllers/ticketController.js');

const app = require('../server.js');
const session = require('express-session');


const router = express.Router();

//router to check if user has been authenticated by session
router.get('/', (req, res) => {
  if(req.session.user){
    return res.status(200).json(req.session.user);
  }else{
    return res.sendStatus(400);
  }
})

// route requests to create new user
router.post('/signup', userController.signup, (req, res) => {
  console.log('exited signup middleware, preparing signup response');
  return res.status(200).json(res.locals.newUser); // expecting userController.signup to save db response as locals property newUser
})

// route requests to login
router.post('/login', userController.login, (req, res) => {
  console.log ('exited login middleware, preparing login response');
  return res.status(200).json(res.locals.loggedIn) // expecting userController.login to save db response as locals property loggedIn
})

// route requests to get user tickets
router.get('/usertickets', userController.authenticateUser,ticketController.getUserTickets, (req, res) => {
  console.log ('exited get user tickets middleware, preparing get tickets reesponse');
  return res.status(200).json(res.locals.userTickets); // expecting ticketController.getUserTickets to save db response as locals property userTickets
})


// route requests for user to create a new ticket
router.post('/usertickets', userController.authenticateUser, ticketController.createTicket, (req, res) => {
  console.log ('exited createTicket middleware, preparing response', res.body);
  return res.status(200).json(res.locals.newTicket); // expecting ticketController.createTicket to save db resposne to res locals property newTicket
})

// route requests for user to delete ticket
router.delete('/usertickets', userController.authenticateUser, ticketController.deleteTicket, (req, res) => {
  console.log ('exited deleteTicket middleware, preparing response');
  return res.status(200).json(res.locals.deletedTicket); // expecting ticketController.deleteTicket to save db response to locals as deletedTicket
})

// route requests to get admin tickets
router.get('/admintickets', ticketController.getAdminTickets, (req, res) => {
  console.log ('exited get admin tickets middleware, preparing get tickets reesponse');
  return res.status(200).json(res.locals.adminTickets); // expecting ticketController.getAdminTickets to save db response as locals property adminTickets
})

// route requests for admin to update ticket status
router.patch('/admintickets', ticketController.updateTicket, (req, res) => {
  console.log ('exited updateTicket middleware, preparing response');
  return res.status(200).json(res.locals.updatedTicket); // expecting ticketController.updateTicket to save db response to locals as updatedTicket
})

router.get('/logout', (req, res) => {
  console.log ('logging out of user');
  req.session.destroy();
  return res.sendStatus(200);
})

module.exports = router;