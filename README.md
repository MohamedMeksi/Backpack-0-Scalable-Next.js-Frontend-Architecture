# 🚀 My Next App

Application Next.js 15 construite avec l'App Router, TypeScript, Tailwind CSS et une architecture **Feature-Driven** (orientée domaines métier).

---

## 📋 Table des matières

- [Stack technique](#-stack-technique)
- [Architecture générale](#-architecture-générale)
- [Structure détaillée](#-structure-détaillée)
  - [1. `src/app/` — Routing](#1-srcapp--routing)
  - [2. `src/features/` — Domaines métier](#2-srcfeatures--domaines-métier)
  - [3. `src/services/` — Logique backend](#3-srcservices--logique-backend)
  - [4. `src/actions/` — Server Actions](#4-srcactions--server-actions)
  - [5. `src/components/` — UI partagée](#5-srccomponents--ui-partagée)
  - [6. `src/lib/` — Configurations](#6-srclib--configurations)
  - [7. `src/hooks/` — Hooks globaux](#7-srchooks--hooks-globaux)
  - [8. `src/store/` — État global](#8-srcstore--état-global)
  - [9. `src/types/` — Types globaux](#9-srctypes--types-globaux)
  - [10. Fichiers racine](#10-fichiers-racine)
- [Alias d'import](#-alias-dimport)
- [Variables d'environnement](#-variables-denvironnement)
- [Conventions de nommage](#-conventions-de-nommage)
- [Démarrage rapide](#-démarrage-rapide)

---

## 🛠 Stack technique

| Technologie | Rôle |
|---|---|
| [Next.js 15](https://nextjs.org) | Framework React avec App Router |
| [TypeScript](https://www.typescriptlang.org) | Typage statique |
| [Tailwind CSS](https://tailwindcss.com) | Styles utilitaires |
| [Shadcn/ui](https://ui.shadcn.com) | Composants UI primitifs |
| [Prisma / Drizzle](https://www.prisma.io) | ORM et accès base de données |
| [Zod](https://zod.dev) | Validation des schémas et des env vars |
| [Zustand](https://zustand-demo.pmnd.rs) | État global léger côté client |
| [Stripe](https://stripe.com) | Paiements en ligne |
| [Resend](https://resend.com) | Envoi d'emails transactionnels |

---

## 🏗 Architecture générale

L'architecture suit le pattern **Feature-Driven Development** :

```
src/app/         → Routing UNIQUEMENT (pages, layouts, API routes)
src/features/    → Logique métier par domaine (auth, dashboard, etc.)
src/services/    → Accès base de données et logique backend partagée
src/actions/     → Server Actions Next.js (mutations)
src/components/  → Composants UI réutilisables globalement
src/lib/         → Configurations, instances et utilitaires
src/hooks/       → Hooks React globaux partagés
src/store/       → État global (Zustand)
src/types/       → Types TypeScript globaux
```

> **Règle d'or** : `src/app/` ne contient **que du routing**. Toute la logique métier vit dans `src/features/`.

---

## 📁 Structure détaillée

```
my-next-app/
├── public/                        # Fichiers statiques servis directement
│   ├── images/                    # Images publiques
│   └── fonts/                     # Polices locales (si non Google Fonts)
│
├── src/
│   ├── app/                       # 1. ROUTING (App Router Next.js)
│   ├── features/                  # 2. DOMAINES MÉTIER
│   ├── services/                  # 3. LOGIQUE BACKEND
│   ├── actions/                   # 4. SERVER ACTIONS
│   ├── components/                # 5. UI GLOBALE PARTAGÉE
│   ├── lib/                       # 6. CONFIGURATIONS
│   ├── hooks/                     # 7. HOOKS GLOBAUX
│   ├── store/                     # 8. ÉTAT GLOBAL
│   └── types/                     # 9. TYPES GLOBAUX
│
├── .env                           # Variables d'environnement locales (non commité)
├── .env.example                   # Modèle des variables (commité)
├── middleware.ts                  # Middleware Next.js
├── next.config.ts                 # Configuration Next.js
├── tailwind.config.ts             # Configuration Tailwind CSS
└── tsconfig.json                  # Configuration TypeScript
```

---

### 1. `src/app/` — Routing

> **Responsabilité unique** : définir les routes, layouts et endpoints API. **Aucune logique métier ici.**

```
src/app/
├── (auth)/                        # Groupe de routes auth (n'affecte pas l'URL)
│   ├── login/
│   │   └── page.tsx               # → /login
│   └── register/
│       └── page.tsx               # → /register
│
├── api/                           # Route Handlers (endpoints API / webhooks)
│   └── webhooks/
│       └── stripe/
│           └── route.ts           # POST /api/webhooks/stripe
│
├── dashboard/                     # Section protégée (authentification requise)
│   ├── layout.tsx                 # Layout commun au dashboard
│   └── page.tsx                  # → /dashboard
│
├── globals.css                    # Styles globaux + variables CSS Tailwind
├── layout.tsx                     # Layout racine (html, body, providers)
└── page.tsx                       # → / (Landing page / Homepage)
```

**Bonnes pratiques :**
- Les `page.tsx` importent leurs composants depuis `src/features/<domaine>/components/`
- Les `layout.tsx` gèrent les providers (Session, Theme, etc.)
- Les `route.ts` délèguent la logique vers `src/services/`

---

### 2. `src/features/` — Domaines métier

> Le **cœur du frontend**. Chaque domaine métier est autonome et contient ses propres composants, hooks, types et utilitaires.

```
src/features/
├── auth/                          # Tout ce qui concerne l'authentification
│   ├── components/                # Composants propres à l'auth
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthProvider.tsx
│   ├── hooks/                     # Hooks propres à l'auth
│   │   └── useSession.ts
│   ├── types/                     # Types TypeScript liés à l'auth
│   │   └── index.ts               # User, Session, AuthError...
│   └── utils.ts                   # isValidEmail(), isStrongPassword()...
│
└── dashboard/                     # Tout ce qui concerne le tableau de bord
    └── components/
        ├── StatCards.tsx
        └── RecentActivity.tsx
```

**Règle** : Un composant dans `features/auth/` ne doit **jamais** importer depuis `features/dashboard/` et inversement. La communication passe par `src/store/` ou les Server Actions.

---

### 3. `src/services/` — Logique backend

> Fonctions pures d'accès à la base de données et logique backend partagée. Utilisées par les Server Actions et les Route Handlers.

```
src/services/
├── user.service.ts                # getUserById(), createUser(), updateUser()
├── auth.service.ts                # validateCredentials(), generateToken()
└── mail.service.ts                # sendWelcomeEmail(), sendPasswordReset()
```

**Règle** : Les services ne sont **jamais importés côté client** (composants). Ils sont appelés uniquement depuis `src/actions/` ou `src/app/api/`.

---

### 4. `src/actions/` — Server Actions

> Mutations et écritures serveur Next.js (`"use server"`). Point d'entrée des formulaires et mutations côté client.

```
src/actions/
├── auth.actions.ts                # loginAction(), registerAction(), logoutAction()
└── user.actions.ts                # updateUserProfileAction(), deleteAccountAction()
```

**Flux typique :**
```
Composant client → Server Action → Service → Base de données
```

---

### 5. `src/components/` — UI partagée

> Composants réutilisables dans **plusieurs domaines** ou **toute l'application**.

```
src/components/
├── ui/                            # Composants "primitifs" (Shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   └── ...
│
└── common/                        # Composants de mise en page globaux
    ├── Navbar.tsx
    ├── Footer.tsx
    └── Sidebar.tsx
```

**Distinction avec `features/` :**
| `src/components/` | `src/features/<x>/components/` |
|---|---|
| Utilisé partout dans l'app | Propre à un seul domaine |
| Pas de logique métier | Peut contenir de la logique métier |
| Ex: `Button`, `Input`, `Modal` | Ex: `LoginForm`, `StatCard` |

---

### 6. `src/lib/` — Configurations

> Instances de clients tiers, configurations et utilitaires purement techniques.

```
src/lib/
├── db.ts                          # Instance singleton Prisma/Drizzle/Mongoose
├── env.ts                         # Validation des variables d'env avec Zod
└── utils.ts                       # cn() pour fusionner les classes Tailwind, etc.
```

**Exemple `env.ts` (Zod) :**
```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

---

### 7. `src/hooks/` — Hooks globaux

> Hooks React réutilisables dans **toute l'application** (non liés à un domaine).

```
src/hooks/
└── use-media-query.ts             # Détection de la taille d'écran
```

---

### 8. `src/store/` — État global

> Stores [Zustand](https://zustand-demo.pmnd.rs) pour l'état UI global (thème, menus, modals...).

```
src/store/
└── ui-store.ts                    # Thème dark/light, sidebar ouverte, etc.
```

**À ne pas stocker ici** : les données serveur (préférer React Query ou les Server Components).

---

### 9. `src/types/` — Types globaux

> Types TypeScript génériques utilisés dans toute l'application.

```
src/types/
└── index.d.ts                     # ApiResponse<T>, PaginatedResult<T>, etc.
```

---

### 10. Fichiers racine

| Fichier | Rôle |
|---|---|
| `middleware.ts` | Protection des routes, redirections auth, i18n |
| `next.config.ts` | Configuration Next.js (images, redirects, headers...) |
| `tailwind.config.ts` | Thème, couleurs, typographie Tailwind |
| `tsconfig.json` | Options TypeScript + alias `@/*` → `src/*` |
| `.env` | Variables locales (**ne jamais commiter**) |
| `.env.example` | Modèle des variables (commiter ce fichier) |

---

## 📦 Alias d'import

Configuré dans `tsconfig.json` :

```json
"paths": {
  "@/*": ["./src/*"]
}
```

**Utilisation :**

```ts
// ✅ Avec alias (recommandé)
import { Button } from "@/components/ui/button";
import { getUserById } from "@/services/user.service";
import { cn } from "@/lib/utils";

// ❌ Chemin relatif (à éviter)
import { Button } from "../../components/ui/button";
```

---

## 🔐 Variables d'environnement

Copiez `.env.example` en `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL de connexion à la base de données |
| `AUTH_SECRET` | Clé secrète pour NextAuth/Auth.js |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (backend uniquement) |
| `STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe (frontend) |
| `STRIPE_WEBHOOK_SECRET` | Secret de vérification des webhooks Stripe |
| `RESEND_API_KEY` | Clé API pour l'envoi d'emails |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'application |

> **Important** : Les variables préfixées `NEXT_PUBLIC_` sont exposées côté client.

---

## 📐 Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants React | `PascalCase` | `LoginForm.tsx` |
| Hooks | `camelCase` avec préfixe `use-` | `use-media-query.ts` |
| Services | `camelCase` avec suffixe `.service` | `user.service.ts` |
| Actions | `camelCase` avec suffixe `.actions` | `auth.actions.ts` |
| Stores | `camelCase` avec suffixe `-store` | `ui-store.ts` |
| Dossiers | `kebab-case` | `features/auth/` |
| Variables CSS | `--kebab-case` | `--color-background` |

---

## ⚡ Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env

# 3. Initialiser la base de données (si Prisma)
npx prisma migrate dev

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).
