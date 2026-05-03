const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

app.use(express.json())

// Configuration Swagger
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
  apis: ['./index.js'] // ⚠️ adapte si ton fichier a un autre nom
}

const swaggerSpec = swaggerJsdoc(options)

// 🌐 Route Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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

  let fee = 0

  // UNE SEULE FONCTION LOGIQUE (volontairement complexe)
  if (amount != null && type && accountType) {
    if (type === 'withdrawal') {
      if (accountType === 'standard') {
        if (amount < 100) {
          fee = 1
        } else {
          if (amount < 1000) {
            fee = 5
          } else {
            fee = 10
          }
        }

        if (isInternational) {
          if (currency !== 'EUR') {
            fee += 15
          } else {
            fee += 10
          }
        } else {
          fee += 0
        }

        if (isWeekend) {
          fee += 2
        }

      } else {
        if (accountType === 'premium') {
          if (amount < 500) {
            fee = 0
          } else {
            fee = 2
          }

          if (isInternational) {
            if (currency !== 'EUR') {
              fee += 5
            } else {
              fee += 3
            }
          }

          if (isWeekend) {
            if (amount > 1000) {
              fee += 1
            } else {
              fee += 0.5
            }
          }
        }
      }

    } else {
      if (type === 'deposit') {
        if (accountType === 'standard') {
          fee = 0
        } else {
          fee = 0
        }

        if (isInternational) {
          if (currency !== 'EUR') {
            fee += 7
          } else {
            fee += 3
          }
        }

      } else {
        if (type === 'transfer') {
          if (accountType === 'standard') {
            if (amount < 200) {
              fee = 2
            } else {
              fee = 4
            }
          } else {
            fee = 1
          }

          if (isInternational) {
            if (currency !== 'EUR') {
              fee += 20
            } else {
              fee += 8
            }
          }

          if (isWeekend) {
            fee += 1
          }
        } else {
          fee = -1 // type inconnu
        }
      }
    }

  } else {
    return res.status(400).json({ error: 'Invalid input' })
  }

  res.json({ fee })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
  console.log('Swagger docs available at http://localhost:3000/api-docs')
})