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

This project uses Gmail OAuth2 for sending emails. To set up the email service:

### Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Follow the detailed OAuth2 setup guide:
   ```bash
   # See server/OAUTH2_SETUP.md for complete instructions
   ```

3. Update your `.env` file with OAuth2 credentials:
   ```env
   OAUTH_CLIENT_ID=your_client_id_here
   OAUTH_CLIENT_SECRET=your_client_secret_here
   OAUTH_REFRESH_TOKEN=your_refresh_token_here
   EMAIL_USER=your_email@gmail.com
   ADMIN_EMAIL=admin_email@example.com
   ```

### Legacy App Password Method

If you prefer using app passwords (not recommended):

1. Enable 2-Step Verification in your Google Account
2. Generate an app password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Add to `.env`:
   ```env
   EMAIL_PASSWORD=your_16_digit_app_password
   ```

**Note:** OAuth2 is the recommended and more secure method. See `server/OAUTH2_SETUP.md` for detailed setup instructions.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8cbe4c62-dcef-4293-b61a-ee287188bd6b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
