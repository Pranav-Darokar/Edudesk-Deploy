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

## 3. Deploy the Frontend (React/Vite)
1.  Click **New** > **GitHub Repo** and select your EduDesk repository.
2.  In the **Settings** tab, change the **Root Directory** to `frontend`.
3.  In the **Variables** tab, add:
    - `VITE_API_BASE_URL`: The URL of your backend + `/api` (e.g., `https://edudesk-backend.railway.app/api`)

## 4. Final Steps
1.  Railway will automatically detect the build commands (`mvn package` for backend and `npm run build` for frontend).
2.  Ensure your `pom.xml` has the `spring-boot-maven-plugin`.
3.  If Maven build fails, check if you need to set `MAVEN_OPTS` or `JAVA_VERSION` (21).
