# SmartBank

Projet de démonstration pour la **qualimétrie logicielle** — analyse et amélioration de la qualité d'un code legacy.

## Description

SmartBank expose une API REST (`POST /api/bank-fees`) qui calcule des frais bancaires selon différents critères : montant, type d'opération (retrait, dépôt, virement), type de compte (standard, premium), devise, caractère international, et jour ouvré/week-end.

Le code initial est volontairement **spaghetti** avec une logique complexe et non factorisée, servant de support à l'application de métriques de qualité et de refactoring.

## Stack technique

- **Runtime** : Node.js 22+
- **Framework** : Express 5
- **Tests** : Jest 30 + Supertest
- **Type-check** : TypeScript 6 (mode `checkJs`)
- **Linting** : ESLint 9 (règles custom : complexité, dette technique, testabilité)
- **Hooks git** : Husky + lint-staged
- **CI** : GitHub Actions

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur (port 3000) |
| `npm run build` | Type-check (tsc --noEmit) |
| `npm test` | Exécute les tests unitaires |
| `npm run test:coverage` | Tests + couverture (seuil 80%) |
| `npm run lint` | ESLint sur tout le projet |
| `npm run typecheck` | Vérification de types |

## Qualimétrie

- **Pre-commit** : lint + type-check sur les fichiers modifiés (lint-staged)
- **Pre-push** : build + tests avec couverture ≥ 80%
- **GitHub Actions (MR)** : build → lint → tests → couverture → performances

## Documentation API

Swagger UI disponible sur `http://localhost:3000/api-docs` (en local).
