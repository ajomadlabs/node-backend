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
        { op: 'replace', path: '/baz', value: 'boo' }
      ]
    }
    chai.request(server)
    .post('/applyjsonpatch')
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWpvam9objU1NUBnbWFpbC5jb21Bam9qb2huIiwiaWF0IjoxNTMyNjM5ODIyLCJleHAiOjE1MzI2NDM0MjJ9.1v5lBAUiihowpmBdXFR7TEDMbS5EeQaAttA9mDyhoFA')
    .send(patchObject)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      done()
    })
  })
  it('it should return error message', (done) => {
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
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWpvam9objU1NUBnbWFpbC5jb21Bam9qb2huIiwiaWF0IjoxNTMyNjM5OTA2LCJleHAiOjE1MzI2NDM1MDZ9.yOr62VCiOwlIHPo47gjifhcdMBGB8gWfgXHJ-If2WBc')
    .send(patchObject)
    .end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      done()
    })
  })
})
