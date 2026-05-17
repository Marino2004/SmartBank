import { describe, it, expect } from '@jest/globals'
import request from 'supertest'
import { app } from '../index.js'

const PERFORMANCE_THRESHOLD_MS = 200

describe('API Performance', () => {
  it('should respond within performance threshold', async () => {
    const samples = 10
    const times = []

    for (let i = 0; i < samples; i++) {
      const start = performance.now()
      await request(app)
        .post('/api/bank-fees')
        .send({ amount: 500, type: 'withdrawal', accountType: 'standard' })
      const end = performance.now()
      times.push(end - start)
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length

    expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS)
  })
})
