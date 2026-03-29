# Deploying EduDesk to Render.com

This guide explains how to deploy the EduDesk project (Spring Boot + React + PostgreSQL) to [Render](https://render.com/).

## Prerequisites
1.  A [GitHub](https://github.com/) account.
2.  A [Render](https://render.com/) account.

## Step 1: Push Code to Your GitHub Repository
If you haven't already, push these files to a NEW GitHub repository:
1.  Initialize a git repo (if not already done): `git init` (The project you cloned may already have one).
2.  Add your new repository as a remote: `git remote add origin YOUR_GITHUB_REPO_URL`
3.  Commit and push:
    ```bash
    git add .
    git commit -m "added render deployment config"
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy Using Render Blueprints (Recommended)
Render Blueprints allow you to deploy all services (Database, Backend, and Frontend) at once using the `render.yaml` file I created.

1.  Log in to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New** > **Blueprint**.
3.  Connect your GitHub repository.
4.  Choose a group name (e.g., `edudesk-application`).
5.  Render will automatically detect the `render.yaml` file.
6.  Click **Apply**.

## Step 3: Wait for Deployment
-   **Database:** Will be provisioned first.
-   **Backend:** Will build using Docker and wait for the database.
-   **Frontend:** Will build and publish.

---

## Alternative: Manual Deployment on Render

If you prefer manual setup, follow these steps:

### 1. Create a PostgreSQL Database
1.  In Render, go to **New** > **Database**.
2.  Name: `edudesk-db`
3.  Database: `studentsDB`
4.  User: `postgres`
5.  Region: Choose the same region for all services.
6.  Take note of the **Internal Database URL**.

### 2. Create the Backend Web Service
1.  Go to **New** > **Web Service**.
2.  Select your GitHub repo.
3.  **Name:** `edudesk-backend`
4.  **Environment:** `Docker`
5.  **Environment Variables:**
    -   `PORT`: `10000`
    -   `SPRING_DATASOURCE_URL`: (Your Internal Database URL)
    -   `SPRING_DATASOURCE_USERNAME`: `postgres`
    -   `SPRING_DATASOURCE_PASSWORD`: (From your Render DB dashboard)
    -   `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`

### 3. Create the Frontend Static Site
1.  Go to **New** > **Static Site**.
2.  Select your GitHub repo.
3.  **Name:** `edudesk-frontend`
4.  **Root Directory:** `frontend`
5.  **Build Command:** `npm install && npm run build`
6.  **Publish Directory:** `dist`
7.  **Environment Variables:**
    -   `VITE_API_BASE_URL`: The URL of your backend service + `/api` (e.g., `https://edudesk-backend-xxxx.onrender.com/api`)
8.  In **Settings** > **Redirects/Rewrites**, add:
    -   **Source:** `/*`
    -   **Destination:** `/index.html`
    -   **Type:** `Rewrite`
