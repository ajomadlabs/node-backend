// Import required modules
import jwt from 'jsonwebtoken'
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
      if (decode.data === auth.email + auth.password) {
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
        res.status(200).send(data)
        file.unlinkSync(filename)
      }).catch((err) => {
        res.status(500).send({error: err})
      })
    })
  } catch (e) {
    res.status(404).send({error: 'Error processing image'})
  }
}

// Export routes
module.exports = (app) => {
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
        res.status(404).send({error: 'Supported Image types are: png, jpg, jpeg and bmp'})
      }
    } else {
      res.status(401).send({error: 'Unauthorized'})
    }
  })
}
