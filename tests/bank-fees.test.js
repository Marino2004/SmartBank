import { describe, it, expect } from '@jest/globals'
import { calculateFee } from '../index.js'

describe('calculateFee - withdrawal standard', () => {
  it('should return 1 for amount < 100', () => {
    expect(calculateFee({ amount: 50, type: 'withdrawal', accountType: 'standard' })).toBe(1)
  })

  it('should return 5 for amount between 100 and 999', () => {
    expect(calculateFee({ amount: 500, type: 'withdrawal', accountType: 'standard' })).toBe(5)
  })

  it('should return 10 for amount >= 1000', () => {
    expect(calculateFee({ amount: 1000, type: 'withdrawal', accountType: 'standard' })).toBe(10)
  })

  it('should add 15 for international non-EUR', () => {
    expect(calculateFee({ amount: 50, type: 'withdrawal', accountType: 'standard', isInternational: true, currency: 'USD' })).toBe(16)
  })

  it('should add 10 for international EUR', () => {
    expect(calculateFee({ amount: 50, type: 'withdrawal', accountType: 'standard', isInternational: true, currency: 'EUR' })).toBe(11)
  })

  it('should add 2 for weekend', () => {
    expect(calculateFee({ amount: 50, type: 'withdrawal', accountType: 'standard', isInternational: false, currency: 'EUR', isWeekend: true })).toBe(3)
  })
})

describe('calculateFee - withdrawal premium', () => {
  it('should return 0 for amount < 500', () => {
    expect(calculateFee({ amount: 100, type: 'withdrawal', accountType: 'premium' })).toBe(0)
  })

  it('should return 2 for amount >= 500', () => {
    expect(calculateFee({ amount: 500, type: 'withdrawal', accountType: 'premium' })).toBe(2)
  })

  it('should add 5 for international non-EUR', () => {
    expect(calculateFee({ amount: 100, type: 'withdrawal', accountType: 'premium', isInternational: true, currency: 'USD' })).toBe(5)
  })

  it('should add 3 for international EUR', () => {
    expect(calculateFee({ amount: 100, type: 'withdrawal', accountType: 'premium', isInternational: true, currency: 'EUR' })).toBe(3)
  })

  it('should add 1 for weekend with amount > 1000', () => {
    expect(calculateFee({ amount: 1500, type: 'withdrawal', accountType: 'premium', isInternational: false, currency: 'EUR', isWeekend: true })).toBe(3)
  })

  it('should add 0.5 for weekend with amount <= 1000', () => {
    expect(calculateFee({ amount: 500, type: 'withdrawal', accountType: 'premium', isInternational: false, currency: 'EUR', isWeekend: true })).toBe(2.5)
  })
})

describe('calculateFee - deposit', () => {
  it('should return 0 for standard account', () => {
    expect(calculateFee({ amount: 100, type: 'deposit', accountType: 'standard' })).toBe(0)
  })

  it('should return 0 for premium account', () => {
    expect(calculateFee({ amount: 100, type: 'deposit', accountType: 'premium' })).toBe(0)
  })

  it('should add 7 for international non-EUR', () => {
    expect(calculateFee({ amount: 100, type: 'deposit', accountType: 'standard', isInternational: true, currency: 'USD' })).toBe(7)
  })

  it('should add 3 for international EUR', () => {
    expect(calculateFee({ amount: 100, type: 'deposit', accountType: 'standard', isInternational: true, currency: 'EUR' })).toBe(3)
  })
})

describe('calculateFee - transfer', () => {
  it('should return 2 for standard account with amount < 200', () => {
    expect(calculateFee({ amount: 100, type: 'transfer', accountType: 'standard' })).toBe(2)
  })

  it('should return 4 for standard account with amount >= 200', () => {
    expect(calculateFee({ amount: 500, type: 'transfer', accountType: 'standard' })).toBe(4)
  })

  it('should return 1 for premium account', () => {
    expect(calculateFee({ amount: 100, type: 'transfer', accountType: 'premium' })).toBe(1)
  })

  it('should add 20 for international non-EUR', () => {
    expect(calculateFee({ amount: 100, type: 'transfer', accountType: 'standard', isInternational: true, currency: 'USD' })).toBe(22)
  })

  it('should add 8 for international EUR', () => {
    expect(calculateFee({ amount: 100, type: 'transfer', accountType: 'standard', isInternational: true, currency: 'EUR' })).toBe(10)
  })

  it('should add 1 for weekend', () => {
    expect(calculateFee({ amount: 100, type: 'transfer', accountType: 'standard', isInternational: false, currency: 'EUR', isWeekend: true })).toBe(3)
  })
})

describe('calculateFee - unknown type', () => {
  it('should return -1 for unknown type', () => {
    expect(calculateFee({ amount: 100, type: 'unknown', accountType: 'standard' })).toBe(-1)
  })
})
