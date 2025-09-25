# Postez

A full-stack social media application for sharing posts and connecting with a community. This project was developed as a portfolio piece to demonstrate full-stack architecture, user authentication, real-time data handling, and media management.

## 🚧 Status Update

The **Direct Messaging** feature is currently in active development. Core functionality, including sending and viewing conversations, is now complete.

My current focus is on implementing **real-time updates** with WebSockets. This will allow new messages to instantly appear in the UI for all participants, creating a seamless chat experience.

Edit profile is up! The Edit Profile feature is up! Users can upload an avatar and cover image with crop and zoom. I'll be making improvements to this new feature.

- **Live Site**: [https://movemakersny.com](https://www.google.com/search?q=https://movemakersny.com)

- **Expected Behavior**: The live application will be available at the domain above once DNS propagation is complete.

- **Immediate Access**: For a consistent experience, you can view the live site via a direct Vercel URL. This URL is provided in the project's settings, but for security, it is not shared publicly. Please use the main domain as the primary point of access.

Thank you for your patience and understanding!

## ✨ Features

- **User Authentication**: Secure user registration, sign-in, and sign-out powered by Clerk.

- **Social Posting**: Users can create, view, and interact with posts.

- **Image Uploads**: Image uploads and management using ImageKit.io.

- **Real-time Updates**: Post updates and other events are handled in real time with WebSockets deployed via separate Node back-end.

- **Responsive UI**: Adaptive user interface built with Next.js and Tailwind CSS.

- **Database**: Data management using Prisma with a PostgreSQL database.

## 🚀 Technologies Used

- **Frontend**: [Next.js], [React], [Tailwind CSS]

- **Backend**: [Next.js API Routes], [node]

- **Database**: [PostgreSQL]managed by [Prisma]

- **Authentication**: [Clerk]

- **Media Management**: [ImageKit.io]

- **Real-time Communication**: [WebSockets]

- **Deployment**: [Vercel]

## ⚙️ Project Setup

To run this project locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18 or higher)

- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

- A PostgreSQL database instance

### 1. Clone the repository

```
git clone
cd postez

```

### 2. Install dependencies

```
npm install
# or
yarn install

```

### 3. Configure environment variables

Create a `.env` file in the root of the project and add your configurations. This project uses the following services:

```
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=[https://ik.imagekit.io/](https://ik.imagekit.io/)...
IMAGEKIT_PRIVATE_KEY=private_...

# WebSockets
# Add your WebSocket connection URL here
WEBSOCKET_URL=ws://localhost:3001

```

### 4. Run database migrations

Use Prisma to push your database schema and seed data.

```
npx prisma migrate dev --name init

```

### 5. Run the development server

```
npm run dev
# or
yarn dev

```

The application will be running at `http://localhost:3000`.

## 🤝 Contact

- **\[Lawrence McConneughey\]**

- **\[(https://www.linkedin.com/in/lawrence-mcconneughey/)\]**
