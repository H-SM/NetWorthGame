This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Things TO DO

Application Description for Developer: Net Worth Game
```We are looking to develop a web application focusing on a net worth game. Here are the specific requirements and functionalities needed:```

- [x] Authentication: 
```Integrate dynamic.xyz as the Web3 authentication provider for secure and efficient user login.```

- [x] Net Worth Game:
```Implement a feature where every time a user signs in, their multiplier increases by 1. This multiplier will then be applied to their net worth. Net worth should be calculated by summing up the value of their Ethereum holdings and the value of all their tokens.```

- [x] Leaderboard:
```Create a leaderboard that ranks users based on their net worth. Ensure that access to the leaderboard is gated, requiring users to be authenticated via dynamic.xyz to view it.```

- [x] Smart Contract Interactions:
```Utilize wagmi/viem libraries to facilitate interactions with smart contracts. These tools will manage and execute all necessary smart contract calls within the application.```

- [x] Data Storage and Management:
    - [x] Supabase as the primary database solution in conjunction with Prisma for ORM
    - [x] Redis for caching
    - [ ] CRON JOB
```Implement Supabase as the primary database solution in conjunction with Prisma for ORM to store user settings and scores. Use Redis for caching to enhance performance of the leaderboard by reducing load times and managing data more effectively. Set up a cron job to revalidate the cached data if more than 40 minutes have passed since the last update to ensure user data remains fresh and accurate.```

- [ ] Deployment:
```Deploy the final application to Vercel for hosting to ensure smooth deployment and scalability.```

If there are any questions or further clarifications required, please let us know.
