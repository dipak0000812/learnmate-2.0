# 🔐 LearnMate Secrets Management Guide

> [!CAUTION]
> **SECURITY INCIDENT RESPONSE REQUIRED**
> 
> The `.env` files containing production secrets were previously committed to this repository.
> All credentials listed below **MUST be rotated immediately**.

---

## 📋 Credentials Requiring Rotation

### 1. MongoDB Atlas
- **Location**: MongoDB Atlas Dashboard → Database Access
- **Action**: Change password for `learnmateUser`
- **Update**: `learnmate-backend/.env` → `MONGO_URI`

### 2. JWT Secrets
- **Action**: Generate new secrets using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **Update**: 
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`

### 3. Google OAuth
- **Location**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Action**: Delete current OAuth 2.0 Client ID and create new one
- **Update**:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

### 4. GitHub OAuth
- **Location**: [GitHub Developer Settings](https://github.com/settings/developers)
- **Action**: Revoke current OAuth App and create new one
- **Update**:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`

### 5. Gmail SMTP (App Password)
- **Location**: [Google App Passwords](https://myaccount.google.com/apppasswords)
- **Action**: Revoke current app password and generate new one
- **Update**: `SMTP_PASS`

### 6. AI API Keys
- **Internal Key**: Generate new secure key
- **Gemini API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey) → Revoke and regenerate
- **Update**:
  - `AI_API_KEY` (in both backend and AI-Model)
  - `GEMINI_API_KEY`

---

## 🧹 Scrubbing Git History

After rotating credentials, remove the `.env` files from Git history:

### Option 1: BFG Repo Cleaner (Recommended)

```bash
# Install BFG (requires Java)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/dipak0000812/learnmate-2.0.git

# Remove .env files from history
java -jar bfg.jar --delete-files .env learnmate-2.0.git

# Clean up
cd learnmate-2.0.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Force push (DANGEROUS - coordinates with team first!)
git push --force
```

### Option 2: git filter-repo

```bash
# Install: pip install git-filter-repo

# Remove specific files
git filter-repo --path learnmate-backend/.env --invert-paths
git filter-repo --path learnmate-frontend/.env --invert-paths
git filter-repo --path AI-Model/.env --invert-paths

# Force push
git push origin --force --all
```

> [!WARNING]
> Force pushing rewrites history. All team members must re-clone the repository after this operation.

---

## ✅ Post-Rotation Checklist

- [ ] MongoDB Atlas password rotated
- [ ] JWT_SECRET regenerated
- [ ] JWT_REFRESH_SECRET regenerated  
- [ ] Google OAuth credentials rotated
- [ ] GitHub OAuth credentials rotated
- [ ] Gmail App Password rotated
- [ ] AI_API_KEY regenerated
- [ ] GEMINI_API_KEY rotated
- [ ] Git history scrubbed
- [ ] Team notified to re-clone
- [ ] Deployment platforms updated (Vercel, Render, etc.)

---

## 🛡️ Preventing Future Incidents

### 1. Pre-commit Hook
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
if git diff --cached --name-only | grep -q "\.env$"; then
    echo "❌ ERROR: Attempting to commit .env file!"
    echo "Remove it with: git reset HEAD <file>"
    exit 1
fi
```

### 2. GitHub Secret Scanning
Enable in repository settings → Security → Code security and analysis → Secret scanning

### 3. Environment Variable Management
- **Development**: Use `.env` files (gitignored)
- **Production**: Use platform secrets (Vercel, Render, AWS Secrets Manager)
- **Never**: Commit secrets to version control

---

## 📁 File Structure

```
learnmate-2.0/
├── .gitignore              # Root gitignore (ignores all .env)
├── SECRETS.md              # This file
├── learnmate-backend/
│   ├── .env                # Your local secrets (NEVER COMMIT)
│   ├── .env.example        # Template with placeholders
│   └── .gitignore
├── learnmate-frontend/
│   ├── .env                # Your local secrets (NEVER COMMIT)
│   ├── .env.example        # Template with placeholders
│   └── .gitignore
└── AI-Model/
    ├── .env                # Your local secrets (NEVER COMMIT)
    ├── .env.example        # Template with placeholders
    └── .gitignore
```

---

*Last Updated: 2026-01-22*
