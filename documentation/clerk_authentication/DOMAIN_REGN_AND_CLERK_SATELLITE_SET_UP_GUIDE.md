# Satellite Domain Setup Guide - www.mosc-temp.com

**Date**: 2025-01-23
**Updated**: 2025-01-25 (Clarified for separate Amplify apps)

**Primary Domain**: www.adwiise.com (Amplify App #1 - ALREADY EXISTS)
**New Satellite Domain**: www.mosc-temp.com (Amplify App #2 - Separate deployment)

---

## Overview

This guide sets up `www.mosc-temp.com` as a **Clerk satellite domain** that uses `www.adwiise.com` for authentication.

### Architecture: Two Separate Applications

**IMPORTANT**: This setup uses **TWO SEPARATE**:
- ✅ Git repositories (different codebases)
- ✅ AWS Amplify apps (separate deployments)
- ✅ Domain names (different root domains)
- ✅ But shares **ONE** Clerk instance (same user database)

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Primary App (www.adwiise.com)                              │
│  • Separate Amplify App #1                                  │
│  • Separate Git Repo #1                                     │
│  • Handles ALL authentication                               │
│  • Clerk instance: ins_***         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Satellite App (www.mosc-temp.com)                          │
│  • Separate Amplify App #2                                  │
│  • Separate Git Repo #2                                     │
│  • Redirects to primary for auth                            │
│  • Same Clerk instance (shared users)                       │
└─────────────────────────────────────────────────────────────┘
```

### Benefits

- ✅ Users authenticate on `www.adwiise.com` (primary)
- ✅ After auth, redirected back to `www.mosc-temp.com` (satellite)
- ✅ **Shared user database** across both apps
- ✅ Each app can have completely different codebase
- ✅ Multi-tenant architecture (add more satellite domains later)

**Total Time**: ~1 hour (including DNS propagation)

---

## Prerequisites

### Required
- ✅ Primary app `www.adwiise.com` already deployed (Amplify App #1)
- ✅ Satellite app `www.mosc-temp.com` already deployed (Amplify App #2)
- ✅ Clerk account with Pro plan (required for satellite domains)
- ✅ Domain name `mosc-temp.com` (registered and pointing to Amplify App #2)
- ✅ AWS CLI configured with credentials
- ✅ Both apps use **SAME** Clerk publishable key

### Domain Registration & Setup

If you don't already have `mosc-temp.com`, you need to either:
1. **Register it** (if unregistered), OR
2. **Transfer it to Route53** (if registered elsewhere)

See **"Domain Setup Steps"** section below for detailed instructions.

---

## Authentication Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              Cross-App Authentication Flow                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. User visits www.mosc-temp.com                                   │
│     → Amplify App #2, Repo #2                                       │
│                                                                       │
│  2. Clicks "Sign in"                                                │
│     → Frontend redirects to www.adwiise.com/sign-in                 │
│                                                                       │
│  3. Arrives at www.adwiise.com/sign-in                             │
│     → Amplify App #1, Repo #1 (different app!)                     │
│                                                                       │
│  4. User authenticates (email/OAuth)                                │
│     → Clerk creates session in backend                              │
│                                                                       │
│  5. Clerk redirects back with special token:                        │
│     → www.mosc-temp.com?__clerk_ticket=xxxx                        │
│     → Back to Amplify App #2                                        │
│                                                                       │
│  6. mosc-temp.com exchanges ticket for session                      │
│     → Clerk API validates ticket                                    │
│     → Creates session cookie for mosc-temp.com                      │
│                                                                       │
│  7. User now signed in on www.mosc-temp.com                         │
│     → Different app, same user account!                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

Primary App (www.adwiise.com - Amplify App #1):
  - Separate codebase
  - Handles ALL authentication
  - OAuth flows happen here
  - Users see Clerk UI on this domain

Satellite App (www.mosc-temp.com - Amplify App #2):
  - Separate codebase
  - Redirects to primary for auth
  - Receives session via Clerk ticket exchange
  - Users work here after authentication

Key Point: Session transfer via Clerk backend (NOT cookies)
  - Sessions stored in Clerk's backend
  - Each domain gets its own session cookie
  - Both cookies point to SAME Clerk session
  - No cookie sharing needed!
```

---

## Domain Setup Steps (Complete Before Main Setup)

If you already own `mosc-temp.com` and it's in Route53, **skip to "Step-by-Step Setup"** below.

### Option A: Register New Domain in Route53 (30 min)

If `mosc-temp.com` is available and unregistered:

#### 1. Check Domain Availability

```powershell
# Check if domain is available
aws route53domains check-domain-availability --domain-name mosc-temp.com
```

Expected response if available:
```json
{
    "Availability": "AVAILABLE"
}
```

#### 2. Register Domain via AWS Console (Recommended)

1. **Go to Route53 Console**:
   - URL: https://console.aws.amazon.com/route53/
   - Click "Registered domains" in left sidebar
   - Click "Register domain"

2. **Search for Domain**:
   - Enter: `mosc-temp.com`
   - Click "Check"
   - If available, click "Add to cart"

3. **Configure Domain**:
   - Duration: 1 year (or more)
   - Auto-renew: Enable (recommended)
   - Privacy protection: Enable (recommended)

4. **Enter Contact Information**:
   - Fill in registrant details
   - Use valid email (you'll need to verify it)

5. **Review and Purchase**:
   - Review details
   - Accept terms
   - Click "Complete purchase"
   - Cost: ~$12-15/year

6. **Wait for Registration**:
   - Takes 10-30 minutes
   - You'll receive confirmation email
   - Hosted zone automatically created

7. **Verify Email**:
   - Check email for verification link
   - Click to verify domain ownership
   - Required within 15 days

#### 3. Get Hosted Zone ID

After registration completes:

```powershell
# Get your hosted zone ID
aws route53 list-hosted-zones --query "HostedZones[?Name=='mosc-temp.com.'].Id" --output text
```

**Copy this Zone ID** - you'll need it for DNS setup.

---

### Option B: Transfer Existing Domain to Route53 (1-5 days)

If you already own `mosc-temp.com` at another registrar:

#### 1. Prepare Domain at Current Registrar

1. **Unlock domain** (remove registrar lock)
2. **Get authorization code** (EPP code/transfer code)
3. **Disable WHOIS privacy** temporarily
4. **Verify contact email** is current

#### 2. Initiate Transfer in Route53

1. **Go to Route53 Console**:
   - URL: https://console.aws.amazon.com/route53/
   - Click "Registered domains"
   - Click "Transfer domain"

2. **Enter Domain and Auth Code**:
   - Domain: `mosc-temp.com`
   - Authorization code: [from current registrar]
   - Click "Check"

3. **Configure Transfer**:
   - Auto-renew: Enable
   - Privacy protection: Enable
   - Review and complete purchase

4. **Approve Transfer**:
   - Check email for transfer approval
   - Approve transfer request
   - Transfer takes 5-7 days

#### 3. Create Hosted Zone (During Transfer)

While waiting for transfer, create hosted zone:

```powershell
# Create hosted zone
aws route53 create-hosted-zone --name mosc-temp.com --caller-reference $(date +%s)
```

Get the nameservers from output and update at current registrar.

---

### Option C: Use Existing Domain (Keep at Current Registrar)

If you want to keep `mosc-temp.com` at current registrar:

#### 1. Create Hosted Zone in Route53

```powershell
# Create hosted zone
aws route53 create-hosted-zone --name mosc-temp.com --caller-reference $(date +%s)
```

#### 2. Get Route53 Nameservers

```powershell
# Get nameservers
aws route53 get-hosted-zone --id <ZONE_ID> --query "DelegationSet.NameServers" --output json
```

Example output:
```json
[
    "ns-123.awsdns-12.com",
    "ns-456.awsdns-45.net",
    "ns-789.awsdns-78.org",
    "ns-012.awsdns-01.co.uk"
]
```

#### 3. Update Nameservers at Current Registrar

1. Log in to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS or Nameserver settings for `mosc-temp.com`
3. Replace existing nameservers with Route53 nameservers
4. Save changes
5. Wait 24-48 hours for propagation

#### 4. Verify Delegation

After 24-48 hours:

```powershell
# Check if nameservers updated
nslookup -type=NS mosc-temp.com
```

Should show Route53 nameservers.

---

### Verification: Domain Ready for Setup

Before proceeding to main setup, verify:

- [ ] Domain `mosc-temp.com` is registered
- [ ] Route53 hosted zone exists for `mosc-temp.com`
- [ ] You have the hosted zone ID
- [ ] Domain nameservers point to Route53
- [ ] Domain is unlocked (if recently transferred)

**Get your hosted zone ID**:

```powershell
aws route53 list-hosted-zones --query "HostedZones[?Name=='mosc-temp.com.'].Id" --output text
```

**Example output**: `Z0123456789ABCDEFGHIJ`

---

## Step-by-Step Setup

### STEP 1: Verify Both Amplify Apps Are Deployed (5 min)

**Important**: Ensure both applications are deployed and accessible.

#### Check Primary App (www.adwiise.com)

1. **Go to AWS Amplify Console**:
   - URL: https://console.aws.amazon.com/amplify/
   - Select your **www.adwiise.com Amplify app** (App #1)

2. **Verify Deployment**:
   - Check Domain management → `www.adwiise.com` should show "Available" (green)
   - Visit https://www.adwiise.com in browser
   - Confirm site loads correctly

#### Check Satellite App (www.mosc-temp.com)

1. **Go to AWS Amplify Console**:
   - Select your **www.mosc-temp.com Amplify app** (App #2)
   - This is a **SEPARATE** app from adwiise.com

2. **Verify Deployment**:
   - Check Domain management → `www.mosc-temp.com` should show "Available" (green)
   - If domain not configured yet, add it:
     ```
     Domain: mosc-temp.com
     Branch: [your branch name]
     Subdomain: www
     ```
   - Visit https://www.mosc-temp.com in browser
   - Confirm site loads (authentication won't work until Clerk setup complete)

3. **Verify Environment Variables** (CRITICAL):
   ```bash
   # In www.mosc-temp.com Amplify app, verify these are set:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_***
   NEXT_PUBLIC_APP_URL=https://www.mosc-temp.com
   AMPLIFY_API_JWT_USER=YOUR_JWT_USER
   AMPLIFY_API_JWT_PASS=YOUR_JWT_PASSWORD
   NEXT_PUBLIC_API_BASE_URL=https://event-site-manager-dev.com

   # Remove these if they exist:
   # CLERK_DOMAIN
   # NEXT_PUBLIC_CLERK_FRONTEND_API
   ```

**Checkpoint**: Both domains should be accessible before proceeding.

---

### STEP 2: Verify DNS Configuration (2 min)

Confirm DNS is correctly pointing to respective Amplify apps.

#### For www.adwiise.com

```powershell
nslookup www.adwiise.com
```

Should return the Amplify App #1 domain (e.g., `main.xxxxx.amplifyapp.com`).

#### For www.mosc-temp.com

```powershell
nslookup www.mosc-temp.com
```

Should return the Amplify App #2 domain (e.g., `main.yyyyy.amplifyapp.com`).

**Note**: These should be DIFFERENT Amplify domains since they're separate apps.

---

### STEP 3: Add Satellite Domain in Clerk Dashboard (5 min)

**Important**: You're adding `www.mosc-temp.com` as a satellite to your **existing** Clerk instance.

1. **Go to Clerk Dashboard**:
   - URL: https://dashboard.clerk.com/
   - Select your production instance: `ins_***`

2. **Navigate to Satellite Domains**:
   - Go to: Configure → Domains → Satellite domains
   - You should see: "No satellite domains" (or existing satellites)
   - Click "Add satellite domain"

3. **Enter Domain**:
   ```
   Domain: www.mosc-temp.com
   ```

4. **Choose Verification Method**:
   - Select: **DNS verification** (NOT proxy)
   - Clerk supports different root domains with DNS verification

5. **Copy Clerk's CNAME Values**:
   - Clerk will display something like:
   ```
   Name: _clerk.www.mosc-temp.com
   Type: CNAME
   Value: verify.clerk.services (or similar)
   ```
   - **Write down these EXACT values** - you'll need them for mosc-temp.com DNS

---

### STEP 4: Add Clerk Verification CNAME (2 min)

Add the Clerk verification record to **mosc-temp.com's hosted zone**.

**IMPORTANT**: Clerk Dashboard will show you the exact CNAME values. Common formats:
- **Frontend API**: `clerk.www.mosc-temp.com` → `frontend-api.clerk.services`
- **Verification**: `_clerk.www.mosc-temp.com` → `verify.clerk.services`

Use the **exact values** shown in your Clerk Dashboard.

#### Option A: Using PowerShell with JSON File (Recommended)

This method works reliably with PowerShell's JSON handling:

```powershell
# Step 1: Create JSON file with CNAME configuration
# Replace values with EXACT values from Clerk Dashboard
@'
{
  "Comment": "Add Clerk CNAME for satellite domain",
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "clerk.www.mosc-temp.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": [{"Value": "frontend-api.clerk.services"}]
    }
  }]
}
'@ | Set-Content -NoNewline -Path .\clerk-cname.json

# Step 2: Apply the CNAME record to Route53
# Replace Z07785143III9YRMM9SJG with your mosc-temp.com hosted zone ID
aws route53 change-resource-record-sets --hosted-zone-id Z07785143III9YRMM9SJG --change-batch file://clerk-cname.json

# Step 3: Verify the record was created
aws route53 list-resource-record-sets --hosted-zone-id Z07785143III9YRMM9SJG --query "ResourceRecordSets[?Name=='clerk.www.mosc-temp.com.']"
```

**Example for your setup**:
```powershell
# Your actual values (from Clerk Dashboard screenshot):
# Name: clerk.www.mosc-temp.com
# Value: frontend-api.clerk.services
# Zone ID: Z07785143III9YRMM9SJG

@'
{
  "Comment": "Add Clerk CNAME",
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "clerk.www.mosc-temp.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": [{"Value": "frontend-api.clerk.services"}]
    }
  }]
}
'@ | Set-Content -NoNewline -Path .\clerk-cname.json

aws route53 change-resource-record-sets --hosted-zone-id Z07785143III9YRMM9SJG --change-batch file://clerk-cname.json
```

#### Option B: Using PowerShell Script

```powershell
powershell -ExecutionPolicy Bypass -File "scripts\add-clerk-verification-mosc-temp.ps1"
```

The script will prompt you for:
- mosc-temp.com hosted zone ID: `Z07785143III9YRMM9SJG`
- CNAME name: `clerk.www.mosc-temp.com`
- CNAME value: `frontend-api.clerk.services`

**Note**: If the script fails with JSON parsing errors, use Option A instead.

#### Verify DNS Record Created

After adding the CNAME, verify it was created:

```powershell
# Check via AWS CLI
aws route53 list-resource-record-sets --hosted-zone-id Z07785143III9YRMM9SJG --query "ResourceRecordSets[?Name=='clerk.www.mosc-temp.com.']"

# Check via nslookup (wait 2-5 minutes for propagation)
nslookup clerk.www.mosc-temp.com
```

Expected result from nslookup:
```
Name:    frontend-api.clerk.services
Addresses:  [IP addresses]
Aliases:  clerk.www.mosc-temp.com
```

---

### STEP 5: Verify Satellite Domain in Clerk (2-10 min)

1. Go back to Clerk Dashboard → Satellite domains
2. Find `www.mosc-temp.com` in the list
3. Click "Verify domain" button
4. Wait 2-10 minutes for verification
5. Status should change to: ✅ **Verified** (green checkmark)

**If verification fails**:
- Wait longer (DNS can take time)
- Double-check CNAME values match exactly
- Try "Verify" button again after 5 minutes

---

### STEP 6: Configure Primary App to Allow Satellite (3 min)

Update the **www.adwiise.com** app's layout.tsx to allow redirects from satellite.

**In www.adwiise.com repo** (Amplify App #1), ensure `src/app/layout.tsx` has:

```typescript
// Primary domain configuration
const clerkProps = {
  allowedRedirectOrigins: ['https://www.mosc-temp.com'],  // ← Add satellite domain
};

return (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    {...clerkProps}
  >
    {/* ... rest of app */}
  </ClerkProvider>
);
```

**Commit and push** to deploy the change.

---

### STEP 7: Configure Satellite App with isSatellite (3 min)

Update the **www.mosc-temp.com** app's layout.tsx for satellite mode.

**In www.mosc-temp.com repo** (Amplify App #2), ensure `src/app/layout.tsx` has:

```typescript
// Satellite domain configuration
const clerkProps = {
  isSatellite: true,
  domain: 'www.mosc-temp.com',
  signInUrl: 'https://www.adwiise.com/sign-in',
  signUpUrl: 'https://www.adwiise.com/sign-up',
};

return (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    telemetry={false}
    {...clerkProps}
  >
    {/* ... rest of app */}
  </ClerkProvider>
);
```

**Commit and push** to deploy the change.

**IMPORTANT**: The `domain` prop should only be added AFTER the satellite domain is verified in Clerk Dashboard (STEP 5 complete).

---

### STEP 8: Update Google OAuth (3 min)

Add `www.mosc-temp.com` to your Google OAuth configuration.

1. **Go to Google Cloud Console**:
   - URL: https://console.cloud.google.com/apis/credentials
   - Select OAuth 2.0 Client ID: `303554160954-0nkuttb13bjlfkpsu02sbm5dr3r5bp1m`

2. **Add to Authorized JavaScript origins**:
   ```
   https://www.mosc-temp.com
   ```

3. **Add to Authorized redirect URIs**:
   ```
   https://www.mosc-temp.com/sso-callback
   ```

4. **Click "Save"**

**Note**: You do NOT need to add mosc-temp.com to the actual OAuth flow URLs - all OAuth still happens on `www.adwiise.com`. This is just for CORS/redirect validation.

---

### STEP 9: Wait for Amplify Deployments (5-10 min)

After pushing code changes to both repos, wait for Amplify to deploy.

**Check www.adwiise.com deployment** (Amplify App #1):
1. Go to AWS Amplify Console → Select App #1
2. Check recent builds
3. Wait for "Deployment completed successfully"

**Check www.mosc-temp.com deployment** (Amplify App #2):
1. Go to AWS Amplify Console → Select App #2
2. Check recent builds
3. Wait for "Deployment completed successfully"

**Note**: These are **separate deployments** from separate repos.

---

### STEP 10: Test Authentication Flow (5 min)

#### Test on www.mosc-temp.com

1. **Visit**: `https://www.mosc-temp.com`

2. **Click "Sign in"**

3. **Expected behavior**:
   - Browser redirects to `https://www.adwiise.com/sign-in`
   - You see Clerk sign-in page on adwiise.com domain
   - URL bar shows: `www.adwiise.com`

4. **Sign in** (use email or Google OAuth)

5. **Expected after sign-in**:
   - Browser redirects back to `https://www.mosc-temp.com`
   - You are now signed in on mosc-temp.com
   - URL bar shows: `www.mosc-temp.com`

6. **Verify session**:
   - Navigate to different pages on www.mosc-temp.com
   - Session should persist
   - You should remain signed in

#### Test OAuth Flow

1. **Visit**: `https://www.mosc-temp.com`
2. **Click "Sign in with Google"**
3. **Expected**:
   - Redirects to `www.adwiise.com/sign-in`
   - Click "Sign in with Google" on adwiise.com
   - Google OAuth completes
   - Redirects back to `www.mosc-temp.com`
   - You are signed in with Google account

---

## Configuration Summary

### DNS Records

**mosc-temp.com hosted zone** (separate Route53 zone):
```
www.mosc-temp.com              CNAME  [Amplify App #2].amplifyapp.com
_clerk.www.mosc-temp.com       CNAME  verify.clerk.services (from Clerk Dashboard)
```

**adwiise.com hosted zone** (separate Route53 zone):
```
www.adwiise.com                CNAME  [Amplify App #1].amplifyapp.com
```

### AWS Amplify Configuration

**Amplify App #1** (www.adwiise.com):
- Repository: [Your primary repo]
- Branch: [Your primary branch]
- Domain: www.adwiise.com
- Environment Variables:
  ```bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_***
  NEXT_PUBLIC_APP_URL=https://www.adwiise.com
  NEXT_PUBLIC_API_BASE_URL=https://event-site-manager-dev.com
  ```

**Amplify App #2** (www.mosc-temp.com):
- Repository: [Your satellite repo]
- Branch: [Your satellite branch]
- Domain: www.mosc-temp.com
- Environment Variables:
  ```bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_***  # SAME key!
  NEXT_PUBLIC_APP_URL=https://www.mosc-temp.com
  NEXT_PUBLIC_API_BASE_URL=https://event-site-manager-dev.com
  AMPLIFY_API_JWT_USER=YOUR_JWT_USER
  AMPLIFY_API_JWT_PASS=YOUR_JWT_PASSWORD
  ```

### Clerk Configuration

**Clerk Instance**: `ins_***` (shared by both apps)

**Primary Domain** (`www.adwiise.com` - App #1):
```typescript
// layout.tsx in www.adwiise.com repo
const clerkProps = {
  allowedRedirectOrigins: ['https://www.mosc-temp.com'],
};
```
- Handles all authentication
- Users see Clerk UI here
- OAuth flows happen here

**Satellite Domain** (`www.mosc-temp.com` - App #2):
```typescript
// layout.tsx in www.mosc-temp.com repo
const clerkProps = {
  isSatellite: true,
  domain: 'www.mosc-temp.com',
  signInUrl: 'https://www.adwiise.com/sign-in',
  signUpUrl: 'https://www.adwiise.com/sign-up',
};
```
- Verified in Clerk Dashboard (DNS)
- Redirects to primary for auth
- Receives session via Clerk ticket exchange

### Google OAuth

**Client ID**: `303554160954-0nkuttb13bjlfkpsu02sbm5dr3r5bp1m`

**Authorized JavaScript origins**:
- https://www.adwiise.com ✅ (existing)
- https://humble-monkey-3.clerk.accounts.dev ✅ (existing)
- http://localhost:3000 ✅ (existing)
- **https://www.mosc-temp.com** ← Added for mosc-temp.com

**Authorized redirect URIs**:
- https://clerk.adwiise.com/v1/oauth_callback ✅ (existing)
- https://humble-monkey-3.clerk.accounts.dev/v1/oauth_callback ✅ (existing)
- **https://www.mosc-temp.com/sso-callback** ← Added for mosc-temp.com

---

## Key Differences from preview.adwiise.com Setup

| Aspect | preview.adwiise.com | www.mosc-temp.com |
|--------|---------------------|-------------------|
| Domain relation | Subdomain of adwiise.com | Completely different domain |
| Cookie sharing | Shares `.adwiise.com` cookies | NO cookie sharing (different domains) |
| DNS zone | adwiise.com hosted zone | mosc-temp.com hosted zone (separate) |
| Satellite config | Required | Required |
| Session transfer | Via Clerk redirect | Via Clerk redirect |
| Complexity | Simpler (same parent domain) | More complex (different domains) |

---

## Troubleshooting

### DNS Not Resolving

**Issue**: `nslookup www.mosc-temp.com` returns error

**Fix**:
1. Verify you added CNAME to **mosc-temp.com** hosted zone (not adwiise.com)
2. Check Zone ID is correct for mosc-temp.com
3. Wait longer (DNS can take up to 48 hours)
4. Try: `nslookup www.mosc-temp.com 8.8.8.8` (use Google DNS)

### Amplify Domain Not Verifying

**Issue**: Amplify shows "Verifying" for > 1 hour for www.mosc-temp.com

**Fix**:
1. Check DNS propagation: https://dnschecker.org/?domain=www.mosc-temp.com
2. Verify CNAME points to correct Amplify URL
3. Make sure you own mosc-temp.com domain
4. Delete and re-add domain in Amplify if stuck

### Clerk Verification Fails

**Issue**: Clerk says "Unable to verify www.mosc-temp.com"

**Fix**:
1. Verify `_clerk.www.mosc-temp.com` CNAME exists in mosc-temp.com zone
2. Check CNAME value matches Clerk Dashboard exactly
3. Wait 10 minutes and click "Verify" again
4. Check for typos in domain name

### Redirect Loop

**Issue**: Keeps redirecting between mosc-temp.com and adwiise.com

**Fix**:
1. Clear all browser cookies for both domains
2. Try in incognito window
3. Verify Amplify deployment completed
4. Check browser console for JavaScript errors

### OAuth Still Fails

**Issue**: OAuth returns error even after setup

**Fix**:
1. Verify satellite domain shows "Verified" in Clerk Dashboard
2. Check Google OAuth includes www.mosc-temp.com in authorized origins
3. Make sure `allowedRedirectOrigins` includes mosc-temp.com in layout.tsx
4. Clear browser cache and cookies
5. Try different browser

### "Not Authorized" Error

**Issue**: Error after OAuth callback

**Fix**:
1. Verify www.mosc-temp.com is in Clerk allowed origins (via API or Dashboard)
2. Check that both domains use same Clerk publishable key
3. Verify satellite domain is verified (not just added)

---

## Verification Checklist

Before testing, verify ALL of these:

- [ ] www.mosc-temp.com resolves to Amplify app (nslookup)
- [ ] AWS Amplify shows www.mosc-temp.com "Available" (green)
- [ ] Clerk satellite domain shows "Verified" (green)
- [ ] Google OAuth includes www.mosc-temp.com
- [ ] Amplify deployment for feature_Common_Clerk branch completed
- [ ] Can access https://www.mosc-temp.com without errors
- [ ] www.adwiise.com still works (primary domain unaffected)

---

## Important Notes

### About Cookie Domains

Since `www.mosc-temp.com` and `www.adwiise.com` are **different root domains**, cookies CANNOT be shared between them. This is browser security by design.

**How it works instead**:
- Clerk stores sessions in its backend
- When you authenticate on www.adwiise.com, Clerk creates session
- When redirected to www.mosc-temp.com, Clerk transfers session via secure token
- Each domain gets its own session cookie, but they refer to same Clerk session

### About Primary Domain

`www.adwiise.com` continues to work exactly as before:
- Users can still sign in directly on www.adwiise.com
- OAuth flows work on www.adwiise.com
- No changes needed to existing users
- **Primary domain is NOT affected by adding satellites**

### About Multi-Tenant Architecture

This setup enables true multi-tenant:
- Each tenant can have completely different domain
- All tenants share same Clerk user database
- Users authenticate once, can access any tenant they have permission for
- Central authentication on www.adwiise.com

---

## Next Steps: Adding More Tenant Domains

To add future tenants (e.g., `www.tenant2.com`, `www.tenant3.com`):

1. **Update layout.tsx**:
```typescript
const isSatellite = hostname.includes('mosc-temp.com') || hostname.includes('tenant2.com');
```

2. **Follow same DNS setup process** for new domain
3. **Add to Clerk Dashboard** as satellite domain
4. **Add to Google OAuth** authorized origins
5. **Update `allowedRedirectOrigins`** in layout.tsx

---

## Support

If issues persist:

**Clerk Support**:
- Discord: https://clerk.com/discord
- Email: Via Clerk Dashboard → Support
- Provide: Instance ID `ins_***`, domain name, trace ID

**AWS Support**:
- Amplify Console → Support
- Provide: App ID, domain name, error messages

---

**Created**: 2025-01-23
**Status**: Ready to implement
**Next Action**: Start with STEP 1 (AWS Amplify Console)
