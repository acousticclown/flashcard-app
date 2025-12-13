# FlashCard App

A beautiful, modern flashcard application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🔐 User authentication (Sign up / Login)
- 📁 Project organization - Create and manage project folders
- 🎴 Flashcards - Create question/answer flashcards with beautiful 3D flip animations
- 🎨 Customizable themes - Each project can have its own color
- ✨ Smooth animations and transitions
- 🌙 Dark mode support

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Prisma** - Database ORM
- **NextAuth v5** - Authentication
- **Framer Motion** - Animations
- **SQLite** - Database

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository and navigate to the project:

```bash
cd flashcard-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Sign in to your account
3. **Create Projects**: Click "New Project" to create a project folder with a custom color
4. **Add Flashcards**: Open a project and click "New Flashcard" to add question/answer pairs
5. **Study**: Click on any flashcard to flip it and see the answer

## Project Structure

```
flashcard-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── project/           # Project detail pages
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── project/           # Project components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   └── prisma.ts          # Prisma client
├── prisma/                # Prisma schema and migrations
└── types/                 # TypeScript type definitions
```

## Future Features

- 🎯 Quiz mode - Test your knowledge with interactive quizzes
- 📊 Difficulty levels - Mark flashcards as easy, medium, or hard
- 📈 Progress tracking - Track your learning progress
- 🔍 Search - Search through your flashcards
- 📱 Mobile app - Native mobile application

## License

MIT
