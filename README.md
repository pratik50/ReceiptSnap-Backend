# 📷 ReceiptSnap Backend  

Backend service for **ReceiptSnap**, an Android app that allows users to securely upload, process, and manage receipts/documents with smart categorization using AWS Services and scalable cloud infrastructure.  

This repository contains the **Backend** of the ReceiptSnap project.  
The Android Fronted is developed separately and can be found here:  
👉 **ReceiptSnap Frontend:** https://github.com/pratik50/ReceiptSnap-Frontend-Android

---

## 🚀 Features  
- 🔐 **Authentication** with JWT  
- 📂 **Secure File Uploads** (images, videos, PDFs) with **Presigned URLs**  
- ⚡ **Async File Processing** via **SQS + Lambda + Bedrock**  
- 🗄️ **PostgreSQL with Prisma ORM** for structured data storage  
- 🐳 **Containerized Deployment** with Docker + EC2  
- 🔄 **CI/CD Pipeline** using GitHub Actions + Docker Hub + EC2 Runner  
- 📊 **Monitoring & Logging** with CloudWatch  

## 🏗️ System Design  

Here’s the high-level architecture of **ReceiptSnap Backend**:  
<p align="center">
  <img src="https://github.com/user-attachments/assets/a6ac091c-5c21-4e9f-92f4-a84fc9534af3" alt="IMG_20250926_134440" width="800"/>
</p>

**Flow Highlights:**  
- Android app uploads receipts → API (Express + Node.js) → File Storage (S3).  
- Presigned URLs for secure uploads.  
- Processing via SQS → Lambda → Bedrock → Results stored back in DB + S3.  
- CI/CD pipeline automates build, push, and deployment via Docker.  
- CloudWatch monitors logs and health.  

## 🛠️ Tech Stack  

- **Backend:** Node.js + Express  
- **Database:** PostgreSQL (Neon) + Prisma ORM  
- **Storage:** AWS S3 (Raw Uploads, Processed)  
- **Queue & Processing:** AWS SQS, Lambda, Bedrock  
- **Deployment:** Docker, EC2, GitHub Actions CI/CD  
- **Monitoring:** CloudWatch  

## ⚙️ Setup & Installation  

1. Clone Repository  
```bash
  git clone https://github.com/pratik50/ReceiptSnap-Backend.git
  cd ReceiptSnap-Backend
```
2. Install Dependencies
```bash
  npm install
```
3. Setup Environment Variables
```bash
  DATABASE_URL=<postgresql_url>
  JWT_SECRET=<your_secret_key>
  AWS_ACCESS_KEY_ID=<aws_key>
  AWS_SECRET_ACCESS_KEY=<aws_secret>
  S3_BUCKET_NAME=<bucket_name>
```
4. Run Migrations
```bash
  npx prisma migrate dev
```
5. Start Development Server
```bash
  npm run dev
```

## 🔄 CI/CD Pipeline
	-	Code pushed to main → GitHub Actions triggers build.
	-	Docker image built & pushed to Docker Hub.
	-	EC2 Runner pulls latest image and deploys container.
	-	Health checks ensure service uptime.

## 📊 Monitoring & Logging
	-	CloudWatch collects logs, metrics, and alerts.
	-	Processing & API logs stored for debugging.

## 🔗 Related Repositories

- **Frontend (Android App):** [ReceiptSnap-Frontend-Android](https://github.com/pratik50/ReceiptSnap-Frontend-Android)  
- **Backend (this repo):** [ReceiptSnap-Backend](https://github.com/pratik50/ReceiptSnap-Backend)

## 🤝 Contributing
	1.	Fork the repo
	2.	Create a feature branch (git checkout -b feature-name)
	3.	Commit changes (git commit -m "Added new feature")
	4.	Push branch (git push origin feature-name)
	5.	Open a Pull Request 🚀  

## 🆓 End Note  

This project is **open-source and free to use**.  
You are welcome to **modify, distribute, and learn** from it.  

Made with ❤️ by **Pratik Jadhav**  
