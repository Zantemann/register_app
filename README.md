# Register App

Register App is a web application designed to simplify event management and attendance tracking. It enables users to authenticate securely using their phone numbers, manage their own and their additional guests' attendance status, and specify dietary requirements or preferences.

## Features

- Passwordless authentication via SMS.
- Secure session management.
- User-friendly interface for displaying event information and allowing users to register themselves and their additional guests for the event.

## Technologies

- Next.js
- MongoDB
- Twilio Verify API

## Security documentation

For detailed security information, refer to the [Security.md](./Security.md) file in the root folder.

## Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/Zantemann/register_app
```

```bash
   cd register_app
```

2. Install dependecies:

```bash
   npm install
```

3. Set up environment variables:

- Copy the .env.example file to .env.local:

```bash
   cp .env.example .env.local
```

- Update the `.env.local` file with your Twilio API keys and MongoDB connection string.

## Running the Application

Start the development server:

```bash
   npm run dev
```

Open http://localhost:3000 in your browser to view the application.

## Deployment

To deploy the application, use the [Vercel Platform](https://vercel.com) . Follow these steps:

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Configure environment variables in the Vercel dashboard.
4. Deploy your application.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Twilio Verify API Documentation](https://www.twilio.com/docs/verify/api) - Learn about Twilio's passwordless authentication.
- [MongoDB Documentation](https://www.mongodb.com/docs/) - Learn about MongoDB for data storage.
