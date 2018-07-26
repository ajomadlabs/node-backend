// Import required modules
import jwt from 'jsonwebtoken';
import store from 'store';
import jsonpatch from 'jsonpatch';
import auth from '../config/auth';

// Defining Helper Function - Authetication Verification
const verify = (req, res) => {
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token, auth.secret);
  if (decoded === store.get('username')) {
    return true;
  } else {
    return false;
  }
}

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
    const userName = req.body.username;
    const password = req.body.password;
    const token = jwt.sign(userName, auth.secret);
    store.set('username', userName);
    res.send({token: token});
  }),
  /*
    Apply JSON Patch Route
    Accepts JSON Object
    Accepts JSON Patch Object
    Apply the Patch using jsonpatch
    Sends the Patched Document 
  */
  app.post('/applyjsonpatch', (req, res) => {
    const verification = verify(req, res);
    if (verification === true) {
      const jsonObject = req.body.jobject;
      const jsonPatchObject = req.body.jpobject;
      const patchDoc = jsonpatch.apply_patch(jsonObject, jsonPatchObject);
      res.send(patchDoc);
    } else {
      res.send('Unauthorized');
    }
  })
};
