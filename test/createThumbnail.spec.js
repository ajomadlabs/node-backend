// Require test dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import 'chai/register-should'

chai.use(chaiHttp)

// Test for Create Thumbnail
describe('/POST applyjsonpatch', () => {
  it('it should return resized image', (done) => {
    let imageDetails = {
      url: 'https://i.imgur.com/vpST9Ar.jpg'
    }
    chai.request(server)
    .post('/createthumb')
    .send(imageDetails)
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })
})
