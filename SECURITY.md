# 🔒 Security Guidelines

## Overview
This document outlines security best practices for the India Local Problems Portal application.

---

## 🚨 Critical: Never Commit These Files

### Backend
- `application.yml` (if it contains real credentials)
- `application-prod.yml`
- `application-local.yml`
- Any `.env` files (except `.env.example`)
- `twilio.properties`
- SSL certificates (*.pem, *.key, *.crt)
- Database dumps with real data

### Frontend
- `.env.local`
- `.env.production`
- Any config files with API keys

### General
- Any file containing:
  - Database passwords
  - JWT secret keys
  - Twilio Account SID and Auth Token
  - WhatsApp API credentials
  - API keys
  - OAuth client secrets

---

## 🔐 Securing Sensitive Configuration

### 1. Database Credentials

**❌ NEVER DO THIS:**
```yaml
spring:
  datasource:
    password: myRealPassword123
```

**✅ DO THIS INSTEAD:**
```yaml
spring:
  datasource:
    password: ${DB_PASSWORD}
```

Then set `DB_PASSWORD` as:
- Environment variable (production)
- `.env` file (development, not committed)
- Secret manager (AWS Secrets Manager, HashiCorp Vault)

### 2. JWT Secret

**Current location:** `application.yml`
```yaml
app:
  jwt:
    secret: ${JWT_SECRET:your-secret-key-change-this}
```

**Production requirement:**
- Minimum 256 bits (32 characters)
- Random, cryptographically secure
- Different for each environment
- Rotated periodically

**Generate strong secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3. Twilio Credentials

**Current location:** `application.yml`
```yaml
app:
  twilio:
    account-sid: ${TWILIO_ACCOUNT_SID:your_account_sid_here}
    auth-token: ${TWILIO_AUTH_TOKEN:your_auth_token_here}
```

**Where to get:**
1. Sign up at https://www.twilio.com
2. Go to Console Dashboard
3. Copy Account SID and Auth Token
4. **NEVER commit these values**

**Store as:**
- Environment variables in production
- `.env` file locally (not committed)

---

## 📋 Environment Setup Checklist

### Development Setup

1. **Copy example files:**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/.env.example frontend/.env
```

2. **Update backend/.env with real values:**
```env
DB_PASSWORD=your_actual_password
JWT_SECRET=generate_with_openssl_rand
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+919876543210
```

3. **Update frontend/.env:**
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. **Verify .gitignore:**
```bash
git status
# Should NOT see .env files in the list
```

### Production Deployment

1. **Use environment variables (not files)**
```bash
export DB_PASSWORD="strong_prod_password"
export JWT_SECRET="long_random_256bit_key"
export TWILIO_ACCOUNT_SID="AC..."
export TWILIO_AUTH_TOKEN="your_token"
```

2. **Use secret management service:**
- AWS Secrets Manager
- Azure Key Vault
- Google Cloud Secret Manager
- HashiCorp Vault

3. **Enable HTTPS only:**
```yaml
server:
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}
```

---

## 🛡️ Security Best Practices

### Application Security

1. **Password Storage**
   - ✅ Bcrypt with salt (currently implemented)
   - ✅ Never store plain text passwords
   - ✅ Minimum 8 characters, complexity requirements

2. **JWT Tokens**
   - ✅ Short expiration (24 hours currently)
   - ✅ HTTPS only in production
   - ✅ HttpOnly cookies (if using cookies)
   - Consider: Refresh token mechanism

3. **OTP Security**
   - ✅ 6-digit random OTP
   - ✅ 5-minute expiration
   - ✅ Max 3 attempts
   - ✅ Rate limiting on OTP requests

4. **API Security**
   - ✅ JWT authentication required
   - ✅ Role-based access control (RBAC)
   - ✅ Input validation
   - Consider: Rate limiting, CORS configuration

5. **File Uploads**
   - ✅ File type validation
   - ✅ Size limits (5MB)
   - ✅ Virus scanning (recommended)
   - ✅ Separate storage from application

### Database Security

1. **Connection Security**
   - ✅ Use connection pooling (HikariCP)
   - ✅ SSL/TLS for database connections in production
   - ✅ Least privilege principle (separate read/write users)

2. **Data Protection**
   - ✅ Encrypt sensitive fields (phone numbers, addresses)
   - ✅ Regular backups
   - ✅ Backup encryption
   - Consider: Field-level encryption for PII

### Network Security

1. **HTTPS Everywhere**
   - Production: HTTPS only
   - Development: HTTP acceptable
   - Certificate: Let's Encrypt or commercial

2. **CORS Configuration**
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://yourproductiondomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
```

---

## 🚦 Security Testing

### Before Deployment

1. **Check for secrets in code:**
```bash
# Install git-secrets
git secrets --scan

# Or use truffleHog
trufflehog filesystem . --json
```

2. **Dependency vulnerabilities:**
```bash
# Backend (Maven)
mvn dependency-check:check

# Frontend (npm)
npm audit
npm audit fix
```

3. **Static code analysis:**
```bash
# Use SonarQube, Checkmarx, or similar
```

### Regular Security Tasks

- [ ] Rotate JWT secret every 90 days
- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Audit user permissions quarterly
- [ ] Penetration testing annually

---

## 🔍 Detecting Leaked Secrets

### If secrets are committed to git:

1. **Immediately rotate ALL credentials**
2. **Remove from git history:**
```bash
# Use BFG Repo-Cleaner
java -jar bfg.jar --delete-files application.yml
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

3. **Force push (WARNING: coordinate with team):**
```bash
git push origin --force --all
```

### Prevention:

1. **Pre-commit hooks:**
```bash
# Install git-secrets
git secrets --install
git secrets --register-aws
```

2. **GitHub/GitLab secret scanning:**
   - Enable in repository settings
   - Receive alerts for leaked secrets

---

## 📞 Security Contacts

### Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@localproblems.in (set up dedicated email)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- Acknowledgment: Within 24 hours
- Initial assessment: Within 3 days
- Fix timeline: Depends on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2 weeks
  - Low: Next release cycle

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Twilio Security Best Practices](https://www.twilio.com/docs/usage/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## ✅ Security Checklist

### Development
- [ ] `.env` files not committed
- [ ] `.gitignore` properly configured
- [ ] Example files (`.env.example`) committed
- [ ] No hardcoded credentials in code
- [ ] Dependencies up to date

### Staging
- [ ] HTTPS enabled
- [ ] Environment variables configured
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled

### Production
- [ ] All secrets in secret manager
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Logging and monitoring enabled
- [ ] Backup strategy in place
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Maintained by:** Development Team
