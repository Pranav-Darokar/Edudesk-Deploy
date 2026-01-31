# Railway Deployment Guide for EduDesk

This guide explains how to deploy the EduDesk application (Spring Boot + React + PostgreSQL) to Railway.

## 1. Prepare Your Database
1.  Log in to [Railway](https://railway.app/).
2.  Click **New Project** > **Provision PostgreSQL**.
3.  Once created, click on the PostgreSQL service and go to the **Connect** tab to find the following values:
    - `MYSQL_URL` (Railway often provides these, but for Postgres it will be `DATABASE_URL` or individual components)
    - `PGHOST`
    - `PGPORT`
    - `PGDATABASE`
    - `PGUSER`
    - `PGPASSWORD`

## 2. Deploy the Backend (Spring Boot)
1.  Click **New** > **GitHub Repo** and select your EduDesk repository.
2.  Go to the **Variables** tab for the backend service and add:
    - `SPRING_DATASOURCE_URL`: Use the value from Railway (e.g., `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}`)
    - `SPRING_DATASOURCE_USERNAME`: `${{Postgres.PGUSER}}`
    - `SPRING_DATASOURCE_PASSWORD`: `${{Postgres.PGPASSWORD}}`
    - `APP_FRONTEND_URL`: The URL of your frontend (e.g., `https://edudesk-frontend.railway.app`)

## 3. Deploy the Frontend (React/Vite) to Vercel
1.  Go to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
2.  Import your GitHub repository.
3.  Configure the project:
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4.  Add **Environment Variables**:
    - `VITE_API_BASE_URL`: The URL of your backend + `/api` (e.g., `https://edudesk-backend.railway.app/api`).
    
    > **How to add this in Vercel:**
    > 1. Go to your Project Settings.
    > 2. Click **Environment Variables** in the sidebar.
    > 3. Key: `VITE_API_BASE_URL`
    > 4. Value: `https://edudesk-application-production.up.railway.app/api`
    > 5. Click **Save**.
    > 6. Go to **Deployments** and click **Redeploy** on your latest commit for changes to take effect.

## 4. Final Steps
1.  Ensure your backend's `APP_FRONTEND_URL` variable on Railway matches your Vercel deployment URL (e.g., `https://edudesk-frontend.vercel.app`).
2.  Railway will handle the backend with the multi-stage `Dockerfile`.
3.  Vercel will handle the frontend with the `vercel.json` for SPA routing.
