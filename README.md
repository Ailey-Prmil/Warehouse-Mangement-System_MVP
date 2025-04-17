## 🧪 Setup Instructions

1. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

2. Run `docker-compose -f docker/docker-compose.yaml up --build`

If one want to remove all the data in the date base, run `docker-compose -f docker/docker-compose.yaml down -v`

If one want to keep the data, remove the tag `-v`

> This command will remove the volume of db_data for consistent data.
>
> The database only run the init.sql file only when the volume/image first created.

> [!NOTE]
>
> 1. The wms container is removed from the compose file
> 2. This is to allow the feature of hot reloading in the development phase. The docker mounting does not fully support this feature.

To set up:

1. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

2. Run `docker-compose -f docker/docker-compose.yaml up --build -d`
   > Run the container in the detached mode -- only run the database
   > The app service has been commented
3. Run `npm run dev`

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
