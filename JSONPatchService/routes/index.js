// Import required modules
import jwt from 'jsonwebtoken'
import jsonpatch from 'jsonpatch'
import auth from '../config/auth'

// Defining Helper Function - Authetication Verification
const verify = (req, res) => {
  const token = req.headers['authorization']
  let decoded = ''
  jwt.verify(token, auth.secret, (err, decode) => {
    if (err) {
      decoded = false
    } else {
      if (decode.data === auth.email + auth.password) {
        decoded = true
      } else {
        decoded = false
      }
    }
  })
  return decoded
}

// Export routes
module.exports = (app) => {
  /*
    Apply JSON Patch Route
    Accepts JSON Object
    Accepts JSON Patch Object
    Apply the Patch using jsonpatch
    Sends the Patched Document
  */
  app.post('/applyjsonpatch', (req, res) => {
    const verification = verify(req, res)
    if (verification === true) {
      try {
        const jsonObject = req.body.jobject
        const jsonPatchObject = req.body.jpobject
        const patchDoc = jsonpatch.apply_patch(jsonObject, jsonPatchObject)
        res.status(200).send(patchDoc)
      } catch (e) {
        res.status(404).send({error: 'Invalid Operation'})
      }
    } else {
      res.status(401).send({error: 'Unauthorized'})
    }
  })
}
