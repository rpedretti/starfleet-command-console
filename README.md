# 🖖 Starfleet Command Console – Step-by-Step Build Guide

This document captures **all steps so far** to build the Starfleet Command Console using **Next.js App Router**, **Prisma**, and **Turso (SQLite-compatible)** — without GraphQL.

You can keep this as a living checklist.

---

## 🎯 Project Goal

Build a Star Trek–themed app to learn **modern Next.js the right way**:

* App Router
* Server Components by default
* Server Actions for mutations
* Prisma ORM
* Turso (SQLite over HTTP)
* Clean client/server separation

---

## 🧱 Tech Stack

* **Next.js (App Router)**
* **TypeScript**
* **Prisma**
* **Turso (libSQL)**
* **Tailwind CSS**
* **Vercel**

No GraphQL. No tRPC.

---

## 🗂️ App Router Structure

```
app/
├─ (auth)/
│  └─ login/
│
├─ (fleet)/
│  ├─ layout.tsx        // LCARS shell
│  ├─ page.tsx          // Dashboard (later)
│  │
│  ├─ ships/
│  │  ├─ actions/
│  │  │  └─ createShip.ts
│  │  ├─ page.tsx
│  │  ├─ loading.tsx
│  │  └─ CreateShipForm.tsx
│  │
│  └─ crew/
│
└─ layout.tsx
```

---

## 🗄️ Database Setup (Turso from Day One)

### Environment Variables

**Local (`.env.local`)**

```env
TURSO_DATABASE_URL="file:./dev.db"
```

**Vercel Preview / Production**

```env
TURSO_DATABASE_URL="libsql://<db-name>.turso.io?authToken=..."
```

✔ Same variable name everywhere (`TURSO_DATABASE_URL`)
✔ No `NODE_ENV` branching in code

---

## 1️⃣ Install & Initialize Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

---

## 2️⃣ Prisma Schema (Initial)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("TURSO_DATABASE_URL")
}

model Ship {
  id        String   @id @default(cuid())
  registry  String   @unique
  name      String
  class     String
  status    String
  createdAt DateTime @default(now())
}

model Officer {
  id        String   @id @default(cuid())
  name      String
  rank      String
  shipId    String?
  ship      Ship?    @relation(fields: [shipId], references: [id])
}
```

---

## 3️⃣ Run First Migration

```bash
npx prisma migrate dev --name init
```

This:

* Connects to Turso
* Creates tables
* Generates Prisma Client

---

## 4️⃣ Prisma Client Singleton

**`lib/db.ts`**

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
```

---

## 5️⃣ Ships Page (Server Component)

**`app/(fleet)/ships/page.tsx`**

```tsx
import { db } from '@/lib/db'
import CreateShipForm from './CreateShipForm'

export const runtime = 'nodejs'

export default async function ShipsPage() {
  const ships = await db.ship.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Starfleet Ships</h1>

      <CreateShipForm />

      <div className="space-y-4">
        {ships.map((ship) => (
          <div key={ship.id} className="p-4 border rounded">
            <strong>{ship.name}</strong> ({ship.registry}) — {ship.class}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 6️⃣ Loading State

**`app/(fleet)/ships/loading.tsx`**

```tsx
export default function Loading() {
  return <div>Loading ships...</div>
}
```

---

## 7️⃣ Server Action (Separate File)

**`app/(fleet)/ships/actions/createShip.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface CreateShipData {
  name: string
  registry: string
  shipClass: string
}

export async function createShip(data: CreateShipData) {
  await db.ship.create({
    data: {
      name: data.name,
      registry: data.registry,
      class: data.shipClass,
      status: 'ACTIVE',
    },
  })

  revalidatePath('/ships')
}
```

---

## 8️⃣ Create Ship Form (Client Component)

**`app/(fleet)/ships/CreateShipForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { createShip } from './actions/createShip'

export default function CreateShipForm() {
  const [name, setName] = useState('')
  const [registry, setRegistry] = useState('')
  const [shipClass, setShipClass] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await createShip({ name, registry, shipClass })
    setName('')
    setRegistry('')
    setShipClass('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 flex flex-col sm:flex-row items-start">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ship Name" required />
      <input value={registry} onChange={(e) => setRegistry(e.target.value)} placeholder="Registry" required />
      <select value={shipClass} onChange={(e) => setShipClass(e.target.value)}>
        <option>Explorer</option>
        <option>Science</option>
        <option>Warship</option>
      </select>
      <button type="submit">Create Ship</button>
    </form>
  )
}
```

---

## 🛑 Core Rules (Do Not Break)

1. Server Components by default
2. Reads → Server Components
3. Writes → Server Actions
4. No client-side fetch to your own API
5. Prisma only runs in Node runtime
6. Use `revalidatePath` intentionally

---

## ➡️ Next Steps

* Ship detail page (`/ships/[registry]`)
* Crew assignment
* Dashboard with streaming panels
* LCARS layout polish
* Auth

## ✅ Completed Steps

* Next.js App Router project created
* Turso database created and linked (local + Vercel)
* Environment variables configured per environment
* Prisma installed and initialized
* Prisma schema defined (Ship, Officer)
* Initial migration applied to Turso
* Prisma client singleton configured
* Ships registry page implemented (Server Component)
* Create Ship Server Action (separate file)
* Create Ship form (Client Component)
* Loading state for Ships page
* Server Actions + revalidation working

---

## ⏳ Pending / Planned Steps

### Fleet Core

* Ship detail page (`/ships/[registry]`)
* Edit ship status (ACTIVE / IN_REPAIR / DECOMMISSIONED)
* Crew management pages
* Assign officers to ships

### Dashboard

* Command dashboard overview
* Streaming panels with `Suspense`
* Alerts & mission summaries

### Captain’s Logs

* MDX-based logs
* Public vs classified logs
* Metadata & OG images

### Telemetry

* Edge ingestion route
* Rate limiting
* Basic anomaly summaries

### UI / UX

* LCARS-style layout
* Persistent navigation via layouts
* Loading skeletons

### Auth & Security

* Auth.js / Clerk integration
* Role-based access control
* Middleware protection

### Deployment & Polish

* Vercel production deployment
* Preview DB support
* Seed data
* Error handling & empty states

---

🖖 End of current build steps
