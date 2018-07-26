// Import required modules
import jwt from 'jsonwebtoken'
import store from 'store'
import jsonpatch from 'jsonpatch'
import imgdownload from 'image-downloader'
import imgresize from 'resize-img'
import file from 'fs'
import path from 'path'
import auth from '../config/auth'

// Defining Helper Function - Authetication Verification
const verify = (req, res) => {
  const token = req.headers['authorization']
  let decoded = ''
  jwt.verify(token, auth.secret, (err, decode) => {
    if (err) {
      decoded = false
    } else {
      if (decode.data === store.get('username')) {
        decoded = true
      } else {
        decoded = false
      }
    }
  })
  return decoded
}

// Defining Helper Function - Download Image and Resize
const downloadImageAndResize = async (options, res) => {
  try {
    await imgdownload.image(options).then(({
      filename,
      image
    }) => {
      imgresize(file.readFileSync(filename), {width: 50, height: 50}).then(data => {
        res.setHeader('Content-type', 'image/png')
        res.send(data)
        file.unlinkSync(filename)
      }).catch((err) => {
        res.send(err)
      })
    })
  } catch (e) {
    res.send('Error processing image')
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
    const userName = req.body.username
    const password = req.body.password
    const token = jwt.sign({data: userName + password}, auth.secret, {expiresIn: '1h'})
    store.set('username', userName + password)
    res.send({token: token})
  })
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
        res.send(patchDoc)
      } catch (e) {
        res.send(e)
      }
    } else {
      res.send('Unauthorized')
    }
  })
  /*
    Creat thumbnail Route
    Accepts Image URL
    Downloads the image from the URL
    Resize the image to 50x50
    Sends the resized thumbnail
  */
  app.post('/createthumb', (req, res) => {
    const verification = verify(req, res)
    if (verification === true) {
      const imgurl = req.body.url
      const imgdest = auth.path
      const imgext = path.extname(imgurl)
      if (imgext === '.jpg' || imgext === '.png' || imgext === '.jpeg' || imgext === '.bmp') {
        const options = {
          url: imgurl,
          dest: imgdest
        }
        downloadImageAndResize(options, res)
      } else {
        res.send('Supported Image types are: png, jpg, jpeg and bmp')
      }
    } else {
      res.send('Unauthorized')
    }
  })
}
