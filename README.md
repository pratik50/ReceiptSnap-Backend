# 📷 ReceiptSnap Backend

Backend service for **ReceiptSnap**, an Android app that allows users to securely upload, process, and manage receipts/documents with smart categorization using AWS Services and scalable cloud infrastructure.

This repository contains the **Backend** of the ReceiptSnap project.
The Android Frontend is developed separately and can be found here:
👉 **ReceiptSnap Frontend:** https://github.com/pratik50/ReceiptSnap-Frontend-Android

> **Branch:** `prod` — Production Kubernetes deployment on DigitalOcean DOKS.
> The `main` branch runs the original EC2 + Docker setup.

---

## 🚀 Features

- 🔐 **Authentication** with JWT
- 📂 **Secure File Uploads** (images, videos, PDFs) with **Presigned URLs**
- ⚡ **Async File Processing** via **SQS + Lambda + Bedrock**
- 🗄️ **PostgreSQL with Prisma ORM** (Neon Serverless)
- 🐳 **Containerized Deployment** with Docker
- ☸️ **Kubernetes Orchestration** on DigitalOcean DOKS
- 🔄 **CI/CD Pipeline** using GitHub Actions + Docker Hub + kubectl
- 📊 **Observability** with OpenTelemetry + Prometheus + Grafana
- ⚖️ **Autoscaling** with Horizontal Pod Autoscaler (HPA)
- 🔁 **Zero Downtime Deployments** via Rolling Updates

---

## 🏗️ System Architecture

### Application Flow
```
Android App
    ↓
API (Express + Node.js)
    ↓              ↓
AWS S3         Neon PostgreSQL
    ↓
SQS → Lambda → Bedrock → Results → DB + S3
```

### Production Infrastructure (prod branch)
<img width="1456" height="736" alt="1772631759146" src="https://github.com/user-attachments/assets/58e54b8a-a313-4ea1-9fae-3e3beeaa9269" />


---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL (Neon Serverless) + Prisma ORM |
| **Storage** | AWS S3 |
| **Queue & Processing** | AWS SQS + Lambda + Bedrock |
| **Containerization** | Docker + Docker Hub |
| **Orchestration** | Kubernetes (DigitalOcean DOKS) |
| **Ingress** | Traefik |
| **Package Manager** | Helm |
| **CI/CD** | GitHub Actions |
| **Instrumentation** | OpenTelemetry SDK |
| **Monitoring** | Prometheus + Grafana |
| **Autoscaling** | HPA (Horizontal Pod Autoscaler) |

---

## ☸️ Kubernetes Setup

### Cluster Details

| Setting | Value |
|---|---|
| Provider | DigitalOcean DOKS |
| Region | Bangalore (BLR1) |
| Nodes | 3 × (2GB RAM / 1 vCPU) |
| Kubernetes Version | v1.34.1 |
| Namespace | `backend-team` |
| Load Balancer IP | `146.190.11.108` |

### Folder Structure

```
.
├── k8s/
│   ├── deployment.yaml          # App deployment (2 replicas, health checks, resource limits)
│   ├── service.yaml             # ClusterIP service
│   ├── ingress.yaml             # Traefik ingress routing
│   ├── hpa.yaml                 # Autoscaler (2–6 pods, CPU 70%, Memory 80%)
│   └── secret.yaml              # ⚠️ gitignored — apply manually
├── k8s/monitoring/
│   └── service-monitor.yaml     # Prometheus scrape config for OTel Collector
├── helm-values/
│   └── otel-collector-values.yaml  # OTel Collector Helm config
├── .github/workflows/
│   ├── ci.yml                   # main branch — EC2 pipeline (untouched)
│   ├── cd.yml                   # main branch — EC2 pipeline (untouched)
│   └── k8s-deploy.yml           # prod branch — K8s pipeline
└── src/
    └── instrumentation.ts       # OpenTelemetry SDK setup
```

### Key Kubernetes Concepts Used

| Resource | Purpose |
|---|---|
| `Deployment` | Maintains desired pod count, rolling updates |
| `Service` | Stable internal address for pods |
| `Ingress` | Routes external traffic via Traefik |
| `Secret` | Secure env variables (not in image) |
| `HPA` | Auto scales pods based on CPU/Memory |
| `ServiceMonitor` | Tells Prometheus where to scrape metrics |

---

## 🔄 CI/CD Pipeline

### Branch Strategy

| Branch | Deploy Target | Method |
|---|---|---|
| `main` | EC2 (Docker) | Self-hosted runner, docker run |
| `prod` | DOKS (K8s) | kubectl rolling update |

### prod Branch Pipeline Steps

```yaml
1. Checkout code
2. Docker build + push (SHA tag + latest)
3. Configure kubectl with KUBE_CONFIG secret
4. kubectl apply -f k8s/          # Apply all manifests
5. kubectl apply -f k8s/monitoring/
6. kubectl set image               # Update to new SHA image
7. kubectl rollout status          # Wait for zero-downtime rollout
```

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password |
| `KUBE_CONFIG` | Base64 encoded DOKS kubeconfig |

---

## 📊 Observability

### Metrics Pipeline

```
Express App
    ↓  OTLP HTTP (:4318)
OTel Collector
    ↓  Prometheus exporter (:8889)
Prometheus
    ↓  PromQL
Grafana Dashboards
```

### Grafana Dashboard Queries

**Request Rate (RPS):**
```promql
sum(rate(http_server_duration_milliseconds_count{job="otel-collector-opentelemetry-collector"}[1m]))
```

**P95 Latency:**
```promql
histogram_quantile(0.95, sum by(le) (rate(http_server_duration_milliseconds_bucket{job="otel-collector-opentelemetry-collector"}[5m])))
```

**Error Rate:**
```promql
sum(rate(http_server_duration_milliseconds_count{job="otel-collector-opentelemetry-collector", http_status_code=~"5.."}[1m])) or vector(0)
```

---

## ⚖️ Autoscaling

HPA automatically scales pods between 2 and 6 based on resource usage:

```
Normal traffic   →  2 pods  (CPU ~1%)
Traffic spike    →  6 pods  (CPU >70%)
Spike ends       →  2 pods  (5 min cooldown)
```

Load test result:
```
T+0s    →  cpu: 1%    →  2 pods (normal)
T+75s   →  cpu: 391%  →  3 pods (scaling)
T+90s   →  cpu: 271%  →  6 pods (max scale)
T+420s  →  cpu: 1%    →  2 pods (scaled down)
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- Docker
- kubectl
- kind (`brew install kind`)
- helm (`brew install helm`)

### 1. Clone Repository
```bash
git clone -b prod https://github.com/pratik50/ReceiptSnap-Backend.git
cd ReceiptSnap-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
DATABASE_URL=<postgresql_url>
JWT_SECRET=<your_secret_key>
AWS_ACCESS_KEY_ID=<aws_key>
AWS_SECRET_ACCESS_KEY=<aws_secret>
AWS_REGION=<region>
AWS_BUCKET_NAME=<bucket_name>
PORT=8080
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318/v1/metrics
```

### 4. Run Migrations
```bash
npx prisma migrate dev
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 🧪 Local Kubernetes Testing (Kind)

### Setup Local Cluster
```bash
# Create cluster
kind create cluster --name receiptsnap

# Create namespace
kubectl create namespace backend-team

# Apply secrets (fill real values first)
kubectl apply -f k8s/secret.yaml

# Apply manifests
kubectl apply -f k8s/

# Install Traefik
helm repo add traefik https://traefik.github.io/charts
helm install traefik traefik/traefik --namespace traefik --create-namespace

# Apply ingress
kubectl apply -f k8s/ingress.yaml

# Port forward and test
kubectl port-forward svc/traefik -n traefik 8080:80
curl -H "Host: receiptsnap.local" http://localhost:8080/health
```

---

## 🚢 Deploying to a New Cluster

If migrating to a different cloud provider:

```bash
# 1. Point kubectl to new cluster
kubectl config use-context <new-cluster>

# 2. Create namespace
kubectl create namespace backend-team

# 3. Install Traefik
helm repo add traefik https://traefik.github.io/charts
helm install traefik traefik/traefik --namespace traefik --create-namespace --skip-crds

# 4. Install monitoring stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace

# 5. Install OTel Collector
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm install otel-collector open-telemetry/opentelemetry-collector \
  --namespace monitoring --skip-crds \
  -f helm-values/otel-collector-values.yaml

# 6. Apply secrets manually (fill real values)
kubectl apply -f k8s/secret.yaml

# 7. Apply all manifests
kubectl apply -f k8s/
kubectl apply -f k8s/monitoring/
```

---

## 🔮 Roadmap

| Feature | Status |
|---|---|
| TLS/SSL (cert-manager) | ⏳ Pending — needs real domain |
| Loki (log aggregation) | ⏳ Pending — needs larger cluster |
| ArgoCD (full GitOps) | ⏳ Pending — needs larger cluster |
| Sealed Secrets | ⏳ Pending — for committing secrets safely to Git |
| Network Policies | ⏳ Not yet configured |
| RBAC | ⏳ Default config only |

---

## 🔗 Related Repositories

- **Frontend (Android App):** [ReceiptSnap-Frontend-Android](https://github.com/pratik50/ReceiptSnap-Frontend-Android)
- **Backend (this repo):** [ReceiptSnap-Backend](https://github.com/pratik50/ReceiptSnap-Backend)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push branch (`git push origin feature-name`)
5. Open a Pull Request 🚀

---

## 🆓 End Note

This project is **open-source and free to use**.
You are welcome to **modify, distribute, and learn** from it.

Made with ❤️ by **Pratik Jadhav**
