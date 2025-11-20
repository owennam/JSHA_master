# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8cbe4c62-dcef-4293-b61a-ee287188bd6b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8cbe4c62-dcef-4293-b61a-ee287188bd6b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Email Service Setup

This project uses [Resend](https://resend.com) for sending emails. To set up the email service:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your API Key from [Resend API Keys](https://resend.com/api-keys)

3. Update your `.env` file with Resend credentials:
   ```env
   # Resend Email Service
   RESEND_API_KEY=re_123456789
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ADMIN_EMAIL=admin_email@example.com
   ```

**Note:** You can use `onboarding@resend.dev` for testing without verifying a domain. For production, you should verify your own domain in Resend dashboard.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8cbe4c62-dcef-4293-b61a-ee287188bd6b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
