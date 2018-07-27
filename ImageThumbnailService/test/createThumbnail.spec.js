/*eslint-disable */
// Require test dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import 'chai/register-should'
import jwt from 'jsonwebtoken'
import auth from '../config/auth'

chai.use(chaiHttp)

const token = jwt.sign({data: auth.email + auth.password}, auth.secret, {expiresIn: '1h'})
const invalidtoken = jwt.sign({data: auth.email + auth.password + auth.invalid}, auth.secret, {expiresIn: '1h'})

// Test for Create Thumbnail
describe('/POST createthumb', () => {
  it('it should return resized image', (done) => {
    let imageDetails = {
      url: 'https://i.imgur.com/vpST9Ar.jpg'
    }
    chai.request(server)
    .post('/createthumb')
    .set('Authorization', token)
    .send(imageDetails)
    .end((err, res) => {
      res.should.have.status(200)
    })
    done()
  })
  it('it should return image format wrong', (done) => {
    let imageDetails = {
      url: 'https://i.imgur.com/vpST9Ar.pdf'
    }
    chai.request(server)
    .post('/createthumb')
    .set('Authorization', token)
    .send(imageDetails)
    .end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.be.property('error')
      done()
    })
  })
  it('it should return unauthoized', (done) => {
    let imageDetails = {
      url: 'https://i.imgur.com/vpST9Ar.pdf'
    }
    chai.request(server)
    .post('/createthumb')
    .set('Authorization', invalidtoken)
    .send(imageDetails)
    .end((err, res) => {
      res.should.have.status(401)
      res.body.should.be.a('object')
      res.body.should.be.property('error')
      done()
    })
  })
  it('it should return error processing image', (done) => {
    let imageDetails = {
      url: 'https://i.imgur.com/ajo.jpg'
    }
    chai.request(server)
    .post('/createthumb')
    .set('Authorization', token)
    .send(imageDetails)
    .end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.be.property('error')
    })
    done()
  })
})
