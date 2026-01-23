This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

my-app
├─ app
│  ├─ admin
│  │  └─ page.tsx
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ route.ts
│  │  │  ├─ logout
│  │  │  │  └─ route.ts
│  │  │  ├─ me
│  │  │  │  └─ route.ts
│  │  │  └─ register
│  │  │     └─ route.ts
│  │  ├─ cart
│  │  │  └─ route.ts
│  │  ├─ categories
│  │  │  └─ route.ts
│  │  ├─ products
│  │  │  └─ route.ts
│  │  └─ uploadthing
│  │     ├─ core.ts
│  │     └─ route.ts
│  ├─ blog
│  │  └─ page.tsx
│  ├─ cart
│  │  └─ page.tsx
│  ├─ category
│  │  ├─ case
│  │  │  └─ page.tsx
│  │  ├─ cooling
│  │  │  └─ page.tsx
│  │  ├─ cpu
│  │  │  └─ page.tsx
│  │  ├─ gpu
│  │  │  └─ page.tsx
│  │  ├─ keyboard
│  │  │  └─ page.tsx
│  │  ├─ mainboard
│  │  │  └─ page.tsx
│  │  ├─ monitor
│  │  │  └─ page.tsx
│  │  ├─ mouse
│  │  │  └─ page.tsx
│  │  ├─ psu
│  │  │  └─ page.tsx
│  │  ├─ ram
│  │  │  └─ page.tsx
│  │  └─ storage
│  │     └─ page.tsx
│  ├─ Components
│  │  ├─ admin
│  │  │  ├─ AddProductModal.tsx
│  │  │  ├─ CustomerManagement.tsx
│  │  │  ├─ DashboardHome.tsx
│  │  │  ├─ OrderManagement.tsx
│  │  │  ├─ ProductManagement.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ StatCard.tsx
│  │  │  ├─ StatusBadge.tsx
│  │  │  └─ Topbar.tsx
│  │  ├─ AlertToast.tsx
│  │  ├─ banner
│  │  │  └─ banner.tsx
│  │  ├─ bg.tsx
│  │  ├─ blog
│  │  │  ├─ BlogCard.tsx
│  │  │  └─ index.ts
│  │  ├─ ConfirmDialog.tsx
│  │  ├─ Footer.tsx
│  │  ├─ login.tsx
│  │  ├─ logo
│  │  │  ├─ logoloop.tsx
│  │  │  └─ logoset.tsx
│  │  ├─ navbar.tsx
│  │  ├─ product.tsx
│  │  ├─ RegisterModal.tsx
│  │  └─ StatusPage.tsx
│  ├─ context
│  │  ├─ AuthContext.tsx
│  │  └─ ClientLayout.tsx
│  ├─ data
│  │  ├─ footerConfig.ts
│  │  └─ mockData.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ not-found.tsx
│  ├─ page.tsx
│  ├─ spec
│  │  └─ page.tsx
│  └─ type
│     ├─ customer.ts
│     ├─ order.ts
│     └─ product.ts
├─ bun.lock
├─ components.json
├─ eslint.config.mjs
├─ lib
│  ├─ auth.ts
│  ├─ image-utils.ts
│  ├─ prisma.ts
│  ├─ uploadthing.ts
│  └─ validation.ts
├─ middleware.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  └─ schema.prisma
├─ prisma.config.ts
├─ public
│  ├─ s1.png
│  ├─ s2.png
│  └─ s3.png
├─ README.md
├─ scripts
│  └─ check-categories.js
└─ tsconfig.json

```