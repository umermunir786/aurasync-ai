# 🚀 AuraSync Backend - AWS Deployment Guide (Step-by-Step)

This document provides a comprehensive record of the steps taken to deploy the AuraSync backend on AWS. It covers infrastructure setup, server configuration, code transfer, and troubleshooting.

---

## 🏗️ 1. Infrastructure Setup (AWS Console)

### EC2 Instance (Server)

- **Operating System:** Ubuntu 24.04 LTS.
- **Instance Type:** `t3.micro` (Free Tier).
- **Key Pair:** `aurasync-key.pem` (Security key required for SSH access).
- **Security Group (EC2):**
  - Port 22 (SSH): For administrative access.
  - Port 8000 (Custom TCP): For the **FastAPI** application.
  - Port 80/443: Reserved for future web traffic (HTTP/HTTPS).

### RDS Database (PostgreSQL)

- **Engine:** PostgreSQL (Managed RDS instance for automated backups and scaling).
- **Master Username:** `postgres` (AWS default master user).
- **Endpoint:** `aurasync-backend.c5wcuq8weuaj.eu-north-1.rds.amazonaws.com`
- **Database Name:** `postgres` (Default initial database).
- **Connectivity:** Linked to the EC2 instance via Security Groups to allow internal traffic on Port 5432.

---

## 🛠️ 2. Server Configuration (EC2 Terminal)

### Docker Installation

The application is containerized, requiring Docker on the host server.

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

_Note: Permissions were applied by reconnecting to the terminal after the `usermod` command._

### Environment Configuration (`.env`)

A `.env` file was created in the project root to manage sensitive credentials and configurations.

- **Database URL:** `postgresql://postgres:<password>@<endpoint>:5432/postgres?sslmode=require`
- **Key Settings:** `SECRET_KEY`, `GEMINI_API_KEY`, `PROJECT_NAME`, and `BACKEND_CORS_ORIGINS`.

---

## 📦 3. Code Transfer (Mac to EC2)

Since the code was not hosted on a Git repository, it was transferred manually from the local Mac:

1. **Local Packaging (Mac):**
   ```bash
   zip -r aurasync.zip . -x "venv/*" "__pycache__/*" ".git/*" ".env" "sql_app.db"
   ```
2. **Private Key Permissions:**
   Securing the `.pem` file to meet SSH requirements:
   ```bash
   chmod 400 ~/Downloads/aurasync-key.pem
   ```
3. **Secure Copy (SCP):**
   Transferring the package to the server:
   ```bash
   scp -i ~/Downloads/aurasync-key.pem aurasync.zip ubuntu@13.60.51.32:/home/ubuntu/
   ```

---

## 🚀 4. Application Launch

### Extraction and Build (EC2 Terminal)

```bash
unzip aurasync.zip -d aurasync-app
cd aurasync-app
docker build -t aurasync-api .
```

### Database Migrations

Tables were initialized using Alembic (SSL mode required for RDS):

```bash
docker run --rm --env-file .env aurasync-api alembic upgrade head
```

### Final Deployment (Container Start)

The application was started in detached mode with an automatic restart policy:

```bash
docker run -d --name aurasync-api -p 8000:8000 --env-file .env --restart unless-stopped aurasync-api
```

---

## 🛡️ 5. Troubleshooting Log

| Issue                            | Root Cause                                        | Resolution                                             |
| :------------------------------- | :------------------------------------------------ | :----------------------------------------------------- |
| `apt: command not found`         | Running Linux commands on local Mac terminal.     | Switched to AWS Browser (EC2 Connect) terminal.        |
| `Permission denied (publickey)`  | Key file permissions were too open (0644).        | Applied `chmod 400` to the `.pem` file.                |
| `Password authentication failed` | Incorrect master username used (`aurasync_user`). | Corrected username to `postgres` based on RDS console. |
| `Connection loading / Timeout`   | Port 8000 was blocked by EC2 Security Group.      | Added Custom TCP Rule for Port 8000 in AWS Console.    |

---

## ✅ Live Endpoints

- **API Documentation:** [http://13.60.51.32:8000/docs](http://13.60.51.32:8000/docs)
- **API Root:** [http://13.60.51.32:8000/api/v1/](http://13.60.51.32:8000/api/v1/)

---

## 🖥️ 6. Database Management (Viewing Tables)

To view your tables in a GUI (like MongoDB Compass), we recommend using **TablePlus** on your Mac.

### Step 1: Install TablePlus

Download and install [TablePlus](https://tableplus.com/) for macOS.

### Step 2: Allow Local Access in AWS Security Group

By default, AWS blocks external connections to RDS. You must allow your Mac's IP:

1. Go to **RDS Console** -> **Databases** -> `aurasync-backend`.
2. Click the **VPC security groups** link.
3. Select the Security Group and click **Edit inbound rules**.
4. Add a new rule:
   - **Type:** PostgreSQL
   - **Port:** 5432
   - **Source:** **My IP** (This automatically detects your Mac's current IP).
5. Click **Save rules**.

### Step 3: Connect via TablePlus

1. Open TablePlus and create a **New Connection** -> **PostgreSQL**.
2. Use the credentials from your `.env` file:
   - **Host:** `aurasync-backend.c5wcuq8weuaj.eu-north-1.rds.amazonaws.com`
   - **User:** `postgres`
   - **Password:** `<your_password>`
   - **Database:** `postgres`
   - **SSL Mode:** `require` or `verify-full`.
3. Click **Connect**. You will see your tables (e.g., `user`, `activity_goal`) on the left sidebar.

---

_Generated by AuraSync AI Deployment Assistant_ 🚀
