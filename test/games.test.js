const app = require('../app')
const supertest = require('supertest')

describe('Creating new games', () => {
    it('returns 201 on default options', (done) => {
        supertest(app).get('/api/new').expect(201).end(done)
    })
})
