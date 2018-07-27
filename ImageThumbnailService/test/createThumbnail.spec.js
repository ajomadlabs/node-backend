/*eslint-disable */
// Require test dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import 'chai/register-should'

chai.use(chaiHttp)

// Test for Create Thumbnail
describe('/POST createthumb', () => {
  it('it should return resized image', (done) => {
    let imageDetails = {
      url: 'https://i.imgur.com/vpST9Ar.jpg'
    }
    chai.request(server).post('/createthumb').send(imageDetails).end((err, res) => {
      console.log(res)
      res.should.have.status(200)
      done()
    })
  })
  it('it should return image format wrong', (done) => {
    let imageDetails = {
      url: 'https://i.imgur.com/vpST9Ar.pdf'
    }
    chai.request(server).post('/createthumb').send(imageDetails).end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.be.property('error')
      done()
    })
  })
})
