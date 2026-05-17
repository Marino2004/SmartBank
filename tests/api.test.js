import { describe, it, expect } from '@jest/globals'
import request from 'supertest'
import { app } from '../index.js'

describe('POST /api/bank-fees', () => {
  it('should return 400 when amount is missing', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({ type: 'withdrawal', accountType: 'standard' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid input' })
  })

  it('should return 400 when type is missing', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({ amount: 100, accountType: 'standard' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid input' })
  })

  it('should return 400 when accountType is missing', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({ amount: 100, type: 'withdrawal' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid input' })
  })

  it('should calculate fee for a valid withdrawal', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({ amount: 50, type: 'withdrawal', accountType: 'standard' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ fee: 1 })
  })

  it('should calculate fee for a deposit', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({ amount: 500, type: 'deposit', accountType: 'premium' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ fee: 0 })
  })

  it('should calculate fee for a transfer', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({ amount: 300, type: 'transfer', accountType: 'premium' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ fee: 1 })
  })

  it('should handle unknown type gracefully', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({ amount: 100, type: 'unknown', accountType: 'standard' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ fee: -1 })
  })

  it('should handle international and weekend flags', async () => {
    const res = await request(app)
      .post('/api/bank-fees')
      .send({
        amount: 100,
        type: 'withdrawal',
        accountType: 'standard',
        isInternational: true,
        currency: 'USD',
        isWeekend: true
      })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ fee: 22 })
  })
})
