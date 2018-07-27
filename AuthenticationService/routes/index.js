// Import required modules
import jwt from 'jsonwebtoken'
import store from 'store'
import validator from 'email-validator'
import auth from '../config/auth'

// Export routes
module.exports = (app) => {
  /*
    Login Route
    Accepts username which will be an email.
    Accepts password.
    Generates a jwt token.
    Store the username in localstorage.
    Sends the token as response.
  */
  app.post('/login', (req, res) => {
    const userName = req.body.username
    const password = req.body.password
    if (validator.validate(userName) === true) {
      const token = jwt.sign({data: userName + password}, auth.secret, {expiresIn: '1h'})
      store.set('username', userName + password)
      res.send({token: token})
    } else {
      res.status(404).send({error: 'Invalid Email'})
    }
  })
}
