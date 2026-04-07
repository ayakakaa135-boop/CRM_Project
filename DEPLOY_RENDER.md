# Render Deployment Guide

This project can be deployed live with:

- API service: Django + Gunicorn
- Frontend: React/Vite static site
- Database: PostgreSQL

## 1. Push the project to GitHub

Render Blueprints require a Git repository.

1. Create a new GitHub repository.
2. Push this project to it.
3. Make sure `render.yaml` exists at the repo root.

## 2. Create the Blueprint on Render

1. Open Render Dashboard.
2. Choose `New` -> `Blueprint`.
3. Select your GitHub repository.
4. Render will detect [render.yaml](C:/Users/haama/Desktop/PycharmProjects/django/crm_project/render.yaml).

## 3. Fill the required environment variables

For `mayan-crm-api`:

- `DEMO_ADMIN_PASSWORD`
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`

For `mayan-crm-web`:

- `VITE_API_URL`

## 4. Recommended values

After Render creates the two services, set:

- `VITE_API_URL=https://YOUR-API-SERVICE.onrender.com/api/v1`
- `CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-SERVICE.onrender.com`
- `CSRF_TRUSTED_ORIGINS=https://YOUR-FRONTEND-SERVICE.onrender.com`

## 5. Deploy order

1. Deploy the Blueprint.
2. Wait until the API service becomes healthy.
3. Copy the API URL.
4. Set `VITE_API_URL` in the static frontend service.
5. Redeploy the frontend once.

## 6. First login

Use the demo admin credentials you configured:

- username: `admin`
- password: the value of `DEMO_ADMIN_PASSWORD`

## Notes

- The local Docker setup remains unchanged.
- The frontend uses SPA rewrites, so direct route refreshes still work.
- Background workers are not required for the first live demo deployment.
