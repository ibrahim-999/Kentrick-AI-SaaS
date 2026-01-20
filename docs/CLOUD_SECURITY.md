# Cloud Deployment & Security Guide

This document covers deployment strategies and security best practices for both AWS and Azure.

## AWS Deployment Strategy

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud                                │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────────────────────┐    │
│  │   Route 53      │    │         CloudFront (CDN)        │    │
│  │   (DNS)         │───►│     Static Assets + API Cache   │    │
│  └─────────────────┘    └──────────────┬──────────────────┘    │
│                                        │                        │
│                         ┌──────────────┴──────────────┐        │
│                         ▼                              ▼        │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │      S3 Bucket              │  │     API Gateway         │  │
│  │   (Frontend Static)         │  │   (REST API)            │  │
│  └─────────────────────────────┘  └───────────┬─────────────┘  │
│                                               │                 │
│                                               ▼                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    VPC (Private Network)                 │   │
│  │                                                          │   │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐ │   │
│  │  │  ALB            │───►│     ECS Fargate             │ │   │
│  │  │  (Load Balancer)│    │   (Backend Containers)      │ │   │
│  │  └─────────────────┘    └─────────────┬───────────────┘ │   │
│  │                                       │                  │   │
│  │         ┌─────────────────────────────┼──────────────┐  │   │
│  │         ▼                             ▼              │  │   │
│  │  ┌─────────────┐    ┌─────────────┐   ┌───────────┐ │  │   │
│  │  │ RDS         │    │ S3 Bucket   │   │ Secrets   │ │  │   │
│  │  │ PostgreSQL  │    │ (Uploads)   │   │ Manager   │ │  │   │
│  │  └─────────────┘    └─────────────┘   └───────────┘ │  │   │
│  │                                                      │  │   │
│  └──────────────────────────────────────────────────────┘  │   │
└─────────────────────────────────────────────────────────────────┘
```

### AWS Services

| Component | AWS Service | Purpose |
|-----------|-------------|---------|
| Frontend Hosting | S3 + CloudFront | Static site hosting with CDN |
| Backend | ECS Fargate | Containerized backend |
| Database | RDS PostgreSQL | Managed database |
| File Storage | S3 | User file uploads |
| API Gateway | API Gateway | REST API management |
| Load Balancer | ALB | Traffic distribution |
| Secrets | Secrets Manager | API keys, credentials |
| DNS | Route 53 | Domain management |

### AWS Security Configuration

#### S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBackendAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:role/backend-role"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::kentrick-uploads/*"
    }
  ]
}
```

#### IAM Role for Backend

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::kentrick-uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:kentrick/*"
    }
  ]
}
```

---

## Azure Deployment Strategy

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud                              │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────────────────────┐    │
│  │   Azure DNS     │    │      Azure CDN                  │    │
│  │                 │───►│   Static Assets + Caching       │    │
│  └─────────────────┘    └──────────────┬──────────────────┘    │
│                                        │                        │
│                         ┌──────────────┴──────────────┐        │
│                         ▼                              ▼        │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │   Blob Storage              │  │   API Management        │  │
│  │   (Frontend Static)         │  │   (REST API Gateway)    │  │
│  └─────────────────────────────┘  └───────────┬─────────────┘  │
│                                               │                 │
│                                               ▼                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    VNet (Virtual Network)                │   │
│  │                                                          │   │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐ │   │
│  │  │  App Gateway    │───►│     AKS / Container Apps    │ │   │
│  │  │  (Load Balancer)│    │   (Backend Containers)      │ │   │
│  │  └─────────────────┘    └─────────────┬───────────────┘ │   │
│  │                                       │                  │   │
│  │         ┌─────────────────────────────┼──────────────┐  │   │
│  │         ▼                             ▼              │  │   │
│  │  ┌─────────────┐    ┌─────────────┐   ┌───────────┐ │  │   │
│  │  │ Azure SQL   │    │ Blob Storage│   │ Key Vault │ │  │   │
│  │  │ PostgreSQL  │    │ (Uploads)   │   │           │ │  │   │
│  │  └─────────────┘    └─────────────┘   └───────────┘ │  │   │
│  │                                                      │  │   │
│  └──────────────────────────────────────────────────────┘  │   │
└─────────────────────────────────────────────────────────────────┘
```

### Azure Services

| Component | Azure Service | Purpose |
|-----------|---------------|---------|
| Frontend Hosting | Blob Storage + CDN | Static site hosting |
| Backend | AKS / Container Apps | Containerized backend |
| Database | Azure Database for PostgreSQL | Managed database |
| File Storage | Blob Storage | User file uploads |
| API Gateway | API Management | REST API management |
| Load Balancer | Application Gateway | Traffic distribution |
| Secrets | Key Vault | API keys, credentials |
| DNS | Azure DNS | Domain management |

### Azure Security Configuration

#### Blob Storage Access Policy

```json
{
  "properties": {
    "permissions": "rwdl",
    "services": "b",
    "resourceTypes": "o",
    "protocols": "https",
    "ipRules": [
      {
        "value": "BACKEND_IP_RANGE"
      }
    ]
  }
}
```

#### Managed Identity for Backend

```bash
az role assignment create \
  --role "Storage Blob Data Contributor" \
  --assignee <managed-identity-id> \
  --scope /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<storage>
```

---

## Security Best Practices

### Authentication & Access Control

| Practice | Implementation |
|----------|----------------|
| JWT Expiration | Set short token lifetime (1h-24h) |
| Refresh Tokens | Implement token refresh mechanism |
| Password Policy | Minimum 8 chars, complexity requirements |
| Rate Limiting | Limit login attempts per IP |
| MFA | Add multi-factor authentication |

### Network Security

| Practice | AWS | Azure |
|----------|-----|-------|
| Private Subnets | VPC with private subnets | VNet with private subnets |
| Security Groups | EC2 Security Groups | Network Security Groups |
| WAF | AWS WAF | Azure WAF |
| DDoS Protection | AWS Shield | Azure DDoS Protection |
| Private Endpoints | VPC Endpoints | Private Link |

### Data Security

| Practice | Implementation |
|----------|----------------|
| Encryption at Rest | S3/Blob server-side encryption |
| Encryption in Transit | TLS 1.2+ everywhere |
| Key Management | AWS KMS / Azure Key Vault |
| Data Classification | Tag sensitive data |
| Backup | Automated daily backups |

### API Security

| Practice | Implementation |
|----------|----------------|
| Input Validation | Validate all user inputs |
| Output Encoding | Prevent XSS attacks |
| SQL Injection | Use parameterized queries (Prisma) |
| CORS | Restrict allowed origins |
| Rate Limiting | Implement API rate limits |
| API Versioning | Version your APIs |

### Container Security

| Practice | Implementation |
|----------|----------------|
| Base Images | Use official, minimal images |
| Vulnerability Scanning | Scan images regularly |
| Non-root User | Run containers as non-root |
| Read-only FS | Mount filesystem as read-only |
| Resource Limits | Set CPU/memory limits |

### Monitoring & Logging

| Practice | AWS | Azure |
|----------|-----|-------|
| Application Logs | CloudWatch Logs | Azure Monitor |
| Metrics | CloudWatch Metrics | Application Insights |
| Alerts | CloudWatch Alarms | Azure Alerts |
| Audit Logs | CloudTrail | Azure Activity Log |
| Security Monitoring | GuardDuty | Microsoft Defender |

---

## Compliance Considerations

### Data Privacy

- Implement data retention policies
- Provide data export/deletion capabilities
- Document data processing activities
- Obtain user consent for data collection

### Security Standards

| Standard | Relevance |
|----------|-----------|
| OWASP Top 10 | Web application security |
| SOC 2 | Service organization controls |
| GDPR | European data protection |
| HIPAA | Healthcare data (if applicable) |

---

## Deployment Checklist

### Pre-Deployment

- [ ] Enable encryption at rest for database
- [ ] Enable encryption at rest for file storage
- [ ] Configure TLS certificates
- [ ] Set up secrets management
- [ ] Configure network security rules
- [ ] Enable logging and monitoring

### Post-Deployment

- [ ] Verify TLS configuration
- [ ] Test authentication flow
- [ ] Verify file upload/download security
- [ ] Check API rate limiting
- [ ] Review security group rules
- [ ] Enable alerts for security events
