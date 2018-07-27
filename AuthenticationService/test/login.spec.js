/*eslint-disable */
// Require test dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import 'chai/register-should'

chai.use(chaiHttp)

// Test for Login
describe('/POST login', () => {
  it('it should return jwt token', (done) => {
    let userCredentials = {
      username: 'ajojohn555@gmail.com',
      password: 'Ajojohn234'
    }
    chai.request(server).post('/login').send(userCredentials).end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.be.property('token')
      done()
    })
  })

  it('it should return invalid email', (done) => {
    let userCredentials = {
      username: 'ajojohn555gmail.com',
      password: 'Ajojohn234'
    }
    chai.request(server).post('/login').send(userCredentials).end((err, res) => {
      res.should.have.status(401)
      res.body.should.be.property('error')
      done()
    })
  })
})
