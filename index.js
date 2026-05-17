import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { fileURLToPath } from 'url'

const STANDARD_WITHDRAWAL_TIER_1_FEE = 1
const STANDARD_WITHDRAWAL_TIER_2_FEE = 5
const STANDARD_WITHDRAWAL_TIER_3_FEE = 10
const STANDARD_WITHDRAWAL_TIER_1_MAX = 100
const STANDARD_WITHDRAWAL_TIER_2_MAX = 1000
const STANDARD_WITHDRAWAL_INTERNATIONAL_NON_EUR = 15
const STANDARD_WITHDRAWAL_INTERNATIONAL_EUR = 10
const STANDARD_WITHDRAWAL_WEEKEND = 2
const PREMIUM_WITHDRAWAL_THRESHOLD = 500
const PREMIUM_WITHDRAWAL_FEE_LOW = 0
const PREMIUM_WITHDRAWAL_FEE_HIGH = 2
const PREMIUM_WITHDRAWAL_INTERNATIONAL_NON_EUR = 5
const PREMIUM_WITHDRAWAL_INTERNATIONAL_EUR = 3
const PREMIUM_WITHDRAWAL_WEEKEND_HIGH_THRESHOLD = 1000
const PREMIUM_WITHDRAWAL_WEEKEND_HIGH = 1
const PREMIUM_WITHDRAWAL_WEEKEND_LOW = 0.5
const DEPOSIT_INTERNATIONAL_NON_EUR = 7
const DEPOSIT_INTERNATIONAL_EUR = 3
const STANDARD_TRANSFER_THRESHOLD = 200
const STANDARD_TRANSFER_FEE_LOW = 2
const STANDARD_TRANSFER_FEE_HIGH = 4
const PREMIUM_TRANSFER_FEE = 1
const TRANSFER_INTERNATIONAL_NON_EUR = 20
const TRANSFER_INTERNATIONAL_EUR = 8
const TRANSFER_WEEKEND = 1
const PORT = 3000
const BAD_REQUEST = 400

const app = express()

app.use(express.json())

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartBank API',
      version: '1.0.0',
      description: 'Documentation API pour le calcul des frais bancaires'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./index.js']
}

const swaggerSpec = swaggerJsdoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @param {Object} opts
 * @param {number} opts.amount
 * @param {boolean} [opts.isInternational]
 * @param {string} [opts.currency]
 * @param {boolean} [opts.isWeekend]
 * @returns {number}
 */
function calculatePremiumWithdrawalFee({ amount, isInternational, currency, isWeekend }) {
  let fee = amount < PREMIUM_WITHDRAWAL_THRESHOLD ? PREMIUM_WITHDRAWAL_FEE_LOW : PREMIUM_WITHDRAWAL_FEE_HIGH

  if (isInternational) {
    fee += currency !== 'EUR' ? PREMIUM_WITHDRAWAL_INTERNATIONAL_NON_EUR : PREMIUM_WITHDRAWAL_INTERNATIONAL_EUR
  }

  if (isWeekend) {
    fee += amount > PREMIUM_WITHDRAWAL_WEEKEND_HIGH_THRESHOLD ? PREMIUM_WITHDRAWAL_WEEKEND_HIGH : PREMIUM_WITHDRAWAL_WEEKEND_LOW
  }

  return fee
}

/**
 * @param {Object} opts
 * @param {number} opts.amount
 * @param {boolean} [opts.isInternational]
 * @param {string} [opts.currency]
 * @param {boolean} [opts.isWeekend]
 * @returns {number}
 */
function calculateStandardWithdrawalFee({ amount, isInternational, currency, isWeekend }) {
  let fee = STANDARD_WITHDRAWAL_TIER_1_FEE

  if (amount >= STANDARD_WITHDRAWAL_TIER_2_MAX) {
    fee = STANDARD_WITHDRAWAL_TIER_3_FEE
  } else if (amount >= STANDARD_WITHDRAWAL_TIER_1_MAX) {
    fee = STANDARD_WITHDRAWAL_TIER_2_FEE
  }

  if (isInternational) {
    fee += currency !== 'EUR' ? STANDARD_WITHDRAWAL_INTERNATIONAL_NON_EUR : STANDARD_WITHDRAWAL_INTERNATIONAL_EUR
  }

  if (isWeekend) {
    fee += STANDARD_WITHDRAWAL_WEEKEND
  }

  return fee
}

/**
 * @param {Object} opts
 * @param {number} opts.amount
 * @param {string} opts.accountType
 * @param {boolean} [opts.isInternational]
 * @param {string} [opts.currency]
 * @param {boolean} [opts.isWeekend]
 * @returns {number}
 */
function calculateWithdrawalFee({ amount, accountType, isInternational, currency, isWeekend }) {
  if (accountType === 'premium') {
    return calculatePremiumWithdrawalFee({ amount, isInternational, currency, isWeekend })
  }

  return calculateStandardWithdrawalFee({ amount, isInternational, currency, isWeekend })
}

/**
 * @param {Object} opts
 * @param {boolean} [opts.isInternational]
 * @param {string} [opts.currency]
 * @returns {number}
 */
function calculateDepositFee({ isInternational, currency }) {
  let fee = 0

  if (isInternational) {
    fee += currency !== 'EUR' ? DEPOSIT_INTERNATIONAL_NON_EUR : DEPOSIT_INTERNATIONAL_EUR
  }

  return fee
}

/**
 * @param {Object} opts
 * @param {number} opts.amount
 * @param {string} opts.accountType
 * @param {boolean} [opts.isInternational]
 * @param {string} [opts.currency]
 * @param {boolean} [opts.isWeekend]
 * @returns {number}
 */
function calculateTransferFee({ amount, accountType, isInternational, currency, isWeekend }) {
  let fee = PREMIUM_TRANSFER_FEE

  if (accountType === 'standard') {
    fee = amount < STANDARD_TRANSFER_THRESHOLD ? STANDARD_TRANSFER_FEE_LOW : STANDARD_TRANSFER_FEE_HIGH
  }

  if (isInternational) {
    fee += currency !== 'EUR' ? TRANSFER_INTERNATIONAL_NON_EUR : TRANSFER_INTERNATIONAL_EUR
  }

  if (isWeekend) {
    fee += TRANSFER_WEEKEND
  }

  return fee
}

/**
 * @param {Object} params
 * @param {number} params.amount
 * @param {string} params.type
 * @param {string} params.accountType
 * @param {boolean} [params.isInternational]
 * @param {string} [params.currency]
 * @param {boolean} [params.isWeekend]
 * @returns {number}
 */
function calculateFee({ amount, type, accountType, isInternational, currency, isWeekend }) {
  if (type === 'withdrawal') {
    return calculateWithdrawalFee({ amount, accountType, isInternational, currency, isWeekend })
  }

  if (type === 'deposit') {
    return calculateDepositFee({ isInternational, currency })
  }

  if (type === 'transfer') {
    return calculateTransferFee({ amount, accountType, isInternational, currency, isWeekend })
  }

  return -1
}

/**
 * @swagger
 * /api/bank-fees:
 *   post:
 *     summary: Calcul des frais bancaires
 *     description: Retourne les frais selon les paramètres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *               accountType:
 *                 type: string
 *               isInternational:
 *                 type: boolean
 *               currency:
 *                 type: string
 *               isWeekend:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Frais calculés
 *       400:
 *         description: Données invalides
 */
app.post('/api/bank-fees', (req, res) => {
  const { amount, type, accountType, isInternational, currency, isWeekend } = req.body

  if (amount == null || !type || !accountType) {
    return res.status(BAD_REQUEST).json({ error: 'Invalid input' })
  }

  const fee = calculateFee({
    amount: Number(amount),
    type,
    accountType,
    isInternational: Boolean(isInternational),
    currency,
    isWeekend: Boolean(isWeekend)
  })

  return res.json({ fee })
})

/* istanbul ignore next */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.log('Server running on http://localhost:3000')
    console.log('Swagger docs available at http://localhost:3000/api-docs')
    /* eslint-enable no-console */
  })
}

export { app, calculateFee }
