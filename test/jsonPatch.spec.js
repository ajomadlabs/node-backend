// Require test dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import 'chai/register-should'

chai.use(chaiHttp)

// Test for JSON Patching
describe('/POST applyjsonpatch', () => {
  it('it should return modified object', (done) => {
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
    .send(patchObject)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      done()
    })
  })
})
