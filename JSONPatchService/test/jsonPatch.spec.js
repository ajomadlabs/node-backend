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

// Test for JSON Patching
describe('/POST applyjsonpatch', () => {
  it('it should return modified object', (done) => {
    let patchObject = {
      jobject: {
        baz: 'qux',
        foo: 'bar'
      },
      jpobject: [
        { op: 'replace', path: '/baz', value: 'boo' }
      ]
    }
    chai.request(server)
    .post('/applyjsonpatch')
    .set('Authorization', token)
    .send(patchObject).end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      done()
    })
  })
  it('it should return error message unauthorized', (done) => {
    let patchObject = {
      jobject: {
        baz: 'qux',
        foo: 'bar'
      },
      jpobject: [
        { op: 'ree', path: '/baz', value: 'boo' }
      ]
    }
    chai.request(server)
    .post('/applyjsonpatch')
    .set('Authorization', invalidtoken)
    .send(patchObject).end((err, res) => {
      res.should.have.status(401)
      res.body.should.be.a('object')
      done()
    })
  })
})
