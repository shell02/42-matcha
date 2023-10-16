import { createApp } from '../app'
import supertest = require('supertest')
import { Application } from 'express'

describe('Auth', () => {
  let app: Application

  beforeAll(() => {
    app = createApp() // Create and configure your Express app
  })

  describe('Register route', () => {
    describe('Incomplete body params', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/register').send({
          username: 'test',
          email: '',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Invalid body parameters',
          status: 400,
        })
      })
    })
    describe('Invalid body params - email', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/register').send({
          username: 'test',
          email: 'test.com',
          password: 'test',
          firstName: 'test',
          lastName: 'test',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Invalid email',
          status: 400,
        })
      })
    })
    describe('Invalid body params - username', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/register').send({
          username: 90,
          email: 'test@test.com',
          password: 'test',
          firstName: 'test',
          lastName: 'test',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Invalid username',
          status: 400,
        })
      })
    })
    describe('Invalid body params - password', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/register').send({
          username: 'test',
          email: 'test@email.com',
          password: /test/,
          firstName: 'test',
          lastName: 'test',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Invalid password',
          status: 400,
        })
      })
    })
    describe('Invalid body params - firstName', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/register').send({
          username: 'test',
          email: 'test@email.com',
          password: 'test',
          firstName: 1.23,
          lastName: 'test',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Invalid firstName',
          status: 400,
        })
      })
    })
    describe('Invalid body params - lastName', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/register').send({
          username: 'test',
          email: 'test@email.com',
          password: 'test',
          firstName: 'test',
          lastName: '		   		',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Invalid lastName',
          status: 400,
        })
      })
    })
    describe('Too many body params', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/register').send({
          username: 'test',
          email: 'test@email.com',
          password: 'test',
          firstName: 'test',
          lastName: 'test',
          dog: 'dog',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Invalid body parameters',
          status: 400,
        })
      })
    })
  })

  describe('Verify route', () => {
    describe('No token', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/verify').send({
          usernmae: 'test',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Missing token',
          status: 400,
        })
      })
    })

    describe('Fake token', () => {
      it('should return 403', async () => {
        const response = await supertest(app).post('/auth/verify').send({
          token: 'test',
        })

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
          message: expect.any(String),
          status: 403,
        })
      })
    })
  })

  describe('ForgotPassword route', () => {
    describe('No email', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/verify').send({
          usernmae: 'test',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Missing or invalid email',
          status: 400,
        })
      })
    })

    describe('Invalid email', () => {
      it('should return 400', async () => {
        const response = await supertest(app).post('/auth/verify').send({
          email: 'test',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          message: 'Missing or invalid email',
          status: 400,
        })
      })
    })
  })
})
