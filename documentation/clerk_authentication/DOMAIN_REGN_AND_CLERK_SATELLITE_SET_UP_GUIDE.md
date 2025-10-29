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

### Sign-In Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              Cross-App Authentication Flow (SIGN IN)                 │
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
```

### Sign-Out Flow (Cross-Domain Cookie Clearing)

**CRITICAL CHALLENGE**: Due to browser security (SameSite/HttpOnly cookies), the satellite domain CANNOT clear authentication cookies set by the primary domain. This requires a special redirect-based sign-out flow.

```
┌─────────────────────────────────────────────────────────────────────┐
│              Cross-App Sign-Out Flow (SIGN OUT)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. User on www.mosc-temp.com clicks "Sign Out"                    │
│     → Satellite domain detects it's NOT the primary domain          │
│                                                                       │
│  2. Satellite redirects to primary's sign-out handler:              │
│     → https://www.adwiise.com/auth/signout-redirect?                │
│       redirect_url=https://www.mosc-temp.com                        │
│                                                                       │
│  3. Primary domain receives sign-out request                        │
│     → /auth/signout-redirect page loads                             │
│     → Calls Clerk's signOut() method                                │
│     → ONLY primary domain can clear its own cookies!                │
│                                                                       │
│  4. Clerk clears cookies on primary domain                          │
│     → __session, __clerk_db_jwt, __client_uat, etc.                │
│     → Session revoked in Clerk backend                              │
│                                                                       │
│  5. Primary domain redirects back to satellite with flag:           │
│     → https://www.mosc-temp.com?clerk_signout=true                 │
│                                                                       │
│  6. Satellite domain detects clerk_signout=true flag               │
│     → Header.tsx useEffect triggers on mount                        │
│     → Clears ALL local Clerk state:                                 │
│       • localStorage (Clerk SDK cache)                              │
│       • sessionStorage (Clerk temporary data)                       │
│       • Attempts to clear cookies (best effort)                     │
│                                                                       │
│  7. Satellite forces hard page reload                               │
│     → window.location.replace() with flag removed                   │
│     → Clerk SDK re-initializes with cleared state                   │
│     → User appears logged out                                       │
│                                                                       │
│  8. Cross-tab synchronization (bonus)                               │
│     → localStorage.setItem('clerk_signout_broadcast')               │
│     → All other open tabs detect sign-out via storage event         │
│     → All tabs reload to clear their auth state                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

WHY THIS IS NEEDED:
  ❌ Satellite cannot call Clerk signOut() - would fail with:
     "This operation is not allowed on a satellite domain"

  ❌ Satellite cannot clear primary's cookies - browser security prevents:
     • Cross-domain cookie access (SameSite policy)
     • HttpOnly cookies cannot be accessed by JavaScript
     • Secure cookies require HTTPS and same domain

  ✅ Solution: Redirect to primary domain for sign-out
     • Only primary domain can call Clerk's signOut()
     • Only primary domain can clear its own cookies
     • Flag-based state clearing ensures satellite is also logged out
     • Hard reload prevents cached auth state issues
```

### Architecture Summary

Primary App (www.adwiise.com - Amplify App #1):
  - Separate codebase
  - Handles ALL authentication (sign-in AND sign-out)
  - OAuth flows happen here
  - Users see Clerk UI on this domain
  - Has dedicated sign-out redirect page at `/auth/signout-redirect`

Satellite App (www.mosc-temp.com - Amplify App #2):
  - Separate codebase
  - Redirects to primary for auth operations (sign-in AND sign-out)
  - Receives session via Clerk ticket exchange
  - Clears local state when receiving sign-out flag
  - Users work here after authentication

Key Point: Session transfer via Clerk backend (NOT cookies)
  - Sessions stored in Clerk's backend
  - Each domain gets its own session cookie
  - Both cookies point to SAME Clerk session
  - Sign-out requires coordinated cross-domain flow
  - Flag-based state management ensures consistent logout across domains

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

### STEP 7A: Implement Cross-Domain Sign-Out (CRITICAL - 30 min)

**This is the most complex and critical part of multi-domain authentication setup.**

Due to browser security, satellite domains cannot clear cookies set by the primary domain. This requires implementing a redirect-based sign-out flow where the satellite redirects to the primary domain for sign-out, then redirects back with a flag.

#### Part 1: Create Sign-Out Redirect Page on Primary Domain

**In www.adwiise.com repo** (Primary App), create `src/app/auth/signout-redirect/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

/**
 * Dedicated sign-out page for handling satellite domain sign-outs
 *
 * This page should ONLY be accessed on the PRIMARY domain (www.adwiise.com)
 * Flow:
 * 1. Satellite domain redirects here with ?redirect_url=satellite-url
 * 2. This page calls Clerk's signOut() on primary domain (clears cookies)
 * 3. Redirects back to satellite domain with clerk_signout=true flag
 */
export default function SignOutRedirect() {
  const { signOut } = useClerk();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const performSignOut = async () => {
      try {
        console.log('[SignOut Redirect] Starting sign-out process...');

        // Get redirect URL from query params
        const redirectUrl = searchParams.get('redirect_url') || '/';
        console.log('[SignOut Redirect] Redirect URL:', redirectUrl);

        // Validate redirect URL (security check)
        if (redirectUrl && !redirectUrl.startsWith('http')) {
          // Relative URL, use as-is
        } else if (redirectUrl) {
          // Absolute URL - validate it's one of our domains
          const allowedDomains = ['mosc-temp.com', 'adwiise.com'];
          const url = new URL(redirectUrl);
          const isAllowed = allowedDomains.some(domain => url.hostname.includes(domain));

          if (!isAllowed) {
            console.error('[SignOut Redirect] Invalid redirect URL:', redirectUrl);
            setError('Invalid redirect URL');
            setStatus('error');
            return;
          }
        }

        console.log('[SignOut Redirect] Calling Clerk signOut...');

        // Sign out (without redirect parameter - Clerk handles it differently)
        await signOut();

        console.log('[SignOut Redirect] Sign out complete, manually redirecting to:', redirectUrl);

        // Add a flag to indicate sign-out was successful
        // This helps the satellite domain know to clear its local Clerk state
        const separator = redirectUrl.includes('?') ? '&' : '?';
        const redirectWithFlag = `${redirectUrl}${separator}clerk_signout=true`;

        console.log('[SignOut Redirect] Redirecting with flag:', redirectWithFlag);

        // Add a small delay to ensure sign-out completed
        await new Promise(resolve => setTimeout(resolve, 500));

        // Manually redirect after sign out completes
        window.location.href = redirectWithFlag;
      } catch (err) {
        console.error('[SignOut Redirect] Error during sign-out:', err);
        setError(String(err));
        setStatus('error');

        // Even on error, try to redirect after a delay
        const redirectUrl = searchParams.get('redirect_url') || '/';
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    };

    performSignOut();
  }, [signOut, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {status === 'processing' && (
          <>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Signing out...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we sign you out.
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Sign out error
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {error || 'An error occurred while signing out.'}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting back in a moment...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

**File Location**: `src/app/auth/signout-redirect/page.tsx` in PRIMARY domain repo

**Commit and push** to deploy this page on www.adwiise.com.

#### Part 2: Update Primary Domain layout.tsx

**In www.adwiise.com repo** (Primary App), ensure `src/app/layout.tsx` has satellite domain detection:

```typescript
// In layout.tsx

import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get hostname to detect satellite vs primary
  const headersList = await headers();
  const hostname = headersList.get('host') || '';

  // Detect if this is a satellite domain
  const isSatellite = hostname.includes('mosc-temp.com');

  // Configure Clerk based on domain type
  const clerkProps = isSatellite
    ? {
        isSatellite: true,
        domain: 'mosc-temp.com', // Bare domain without www
        signInUrl: 'https://www.adwiise.com/sign-in',
        signUpUrl: 'https://www.adwiise.com/sign-up',
      }
    : {
        // Primary domain allows redirects from satellites
        allowedRedirectOrigins: ['https://www.mosc-temp.com'],
      };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      {...clerkProps}
    >
      {/* ... rest of app */}
    </ClerkProvider>
  );
}
```

**File Location**: `src/app/layout.tsx` in PRIMARY domain repo (lines 27-44)

**Key Points**:
- Uses `headers()` to detect hostname server-side
- Dynamically configures Clerk based on domain
- Adds `allowedRedirectOrigins` for primary domain to accept redirects from satellites
- Uses bare domain (`mosc-temp.com`) without `www` for satellite `domain` prop

#### Part 3: Update Header Component with Sign-Out Logic

**In BOTH repos** (Primary AND Satellite), update `src/components/Header.tsx`:

```typescript
// In Header.tsx

'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function Header({ /* props */ }) {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // CRITICAL: Check for sign-out flag IMMEDIATELY on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const clerkSignedOut = urlParams.get('clerk_signout');

    console.log('[Header] Checking for clerk_signout flag:', clerkSignedOut);

    if (clerkSignedOut === 'true') {
      console.log('[Header] ===== DETECTED clerk_signout=true FLAG! =====');
      console.log('[Header] Clearing Clerk state and forcing reload...');

      // Clear any Clerk-related storage on satellite domain
      try {
        // Clear localStorage items that contain Clerk data
        const localStorageKeys = Object.keys(localStorage);
        localStorageKeys.forEach(key => {
          if (key.includes('clerk') || key.includes('__clerk')) {
            console.log('[Header] Clearing localStorage key:', key);
            localStorage.removeItem(key);
          }
        });

        // Clear sessionStorage items
        const sessionStorageKeys = Object.keys(sessionStorage);
        sessionStorageKeys.forEach(key => {
          if (key.includes('clerk') || key.includes('__clerk')) {
            console.log('[Header] Clearing sessionStorage key:', key);
            sessionStorage.removeItem(key);
          }
        });

        // Attempt to clear cookies (best effort - HttpOnly cookies can't be cleared)
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          if (cookieName.includes('clerk') || cookieName.includes('__session')) {
            const domains = [window.location.hostname, '.mosc-temp.com', 'mosc-temp.com'];
            domains.forEach(domain => {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
            });
          }
        });

        console.log('[Header] Cleared Clerk-related storage');
      } catch (e) {
        console.error('[Header] Error clearing storage:', e);
      }

      // Remove the flag from URL
      urlParams.delete('clerk_signout');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');

      console.log('[Header] Forcing hard reload with URL:', newUrl);

      // Force a HARD reload (clears cache)
      window.location.replace(newUrl);
    }
  }, []); // Empty deps = runs once on mount

  // Cross-tab sign-out synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clerk_signout_broadcast' && e.newValue) {
        console.log('[Header] Sign-out detected from another tab, reloading...');
        setTimeout(() => window.location.reload(), 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sign-out handler
  const handleSignOut = async () => {
    console.log('[Header] ===== SIGN OUT STARTED =====');
    setIsSigningOut(true);

    // Broadcast sign-out to other tabs
    try {
      localStorage.setItem('clerk_signout_broadcast', Date.now().toString());
      console.log('[Header] Broadcasted sign-out to other tabs');
    } catch (e) {
      console.error('[Header] Failed to broadcast:', e);
    }

    // Detect if we're on satellite domain
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isSatellite = hostname.includes('mosc-temp.com');

    if (isSatellite) {
      console.log('[Header] Satellite domain - redirecting to primary for sign-out...');

      // Redirect to primary domain's sign-out handler
      const primarySignOutUrl = 'https://www.adwiise.com/auth/signout-redirect';
      const returnUrl = encodeURIComponent(window.location.origin);

      console.log('[Header] Redirecting to:', `${primarySignOutUrl}?redirect_url=${returnUrl}`);

      // Redirect to primary domain for sign out
      window.location.href = `${primarySignOutUrl}?redirect_url=${returnUrl}`;
      return;
    }

    // For primary domain, use normal Clerk sign out
    try {
      console.log('[Header] Primary domain - using Clerk signOut()...');
      await signOut();
      console.log('[Header] Sign out successful');
      window.location.href = '/';
    } catch (error) {
      console.error('[Header] Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  // ... rest of component
  return (
    <header>
      {/* ... */}
      <button onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? 'Signing out...' : 'Sign Out'}
      </button>
      {/* ... */}
    </header>
  );
}
```

**File Location**: `src/components/Header.tsx` in BOTH repos (lines 114-370)

**Key Implementation Details**:

1. **Flag Detection (lines 117-214)**:
   - Runs IMMEDIATELY on component mount (before Clerk loads)
   - Detects `?clerk_signout=true` query parameter
   - Clears all localStorage/sessionStorage with 'clerk' in the key
   - Attempts to clear cookies (best effort)
   - Forces hard page reload with flag removed

2. **Cross-Tab Sync (lines 216-240)**:
   - Uses localStorage 'storage' event
   - Broadcasts sign-out to all open tabs
   - Other tabs detect broadcast and reload

3. **Sign-Out Handler (lines 326-370)**:
   - Detects if running on satellite vs primary domain
   - **Satellite**: Redirects to `https://www.adwiise.com/auth/signout-redirect?redirect_url=<origin>`
   - **Primary**: Calls Clerk's `signOut()` directly

#### Part 4: Optional Server-Side Sign-Out API (Backup)

**In www.adwiise.com repo** (Primary App), create `src/app/api/clerk-signout/route.ts`:

This provides a server-side backup sign-out method if Clerk's client-side JS fails to load.

```typescript
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Server-side Clerk sign-out endpoint
 * Backup method when client-side JavaScript fails
 */
export async function POST() {
  try {
    const { userId, sessionId } = await auth();

    if (!userId || !sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Revoke session on Clerk servers
    try {
      const client = await clerkClient();
      await client.sessions.revokeSession(sessionId);
    } catch (revokeError) {
      console.error('[Clerk Sign Out API] Failed to revoke session:', revokeError);
    }

    // Clear Clerk cookies
    const response = NextResponse.json({ success: true });
    const cookiesToClear = ['__session', '__clerk_db_jwt', '__client_uat'];

    cookiesToClear.forEach(cookieName => {
      response.cookies.delete(cookieName);
      response.cookies.delete({ name: cookieName, path: '/' });
    });

    return response;
  } catch (error) {
    console.error('[Clerk Sign Out API] Error:', error);
    return NextResponse.json({ error: 'Sign out error' }, { status: 500 });
  }
}
```

**File Location**: `src/app/api/clerk-signout/route.ts` in PRIMARY domain repo

**Usage**: Call via `fetch('/api/clerk-signout', { method: 'POST' })` if Clerk client-side SDK is unavailable.

#### Testing the Sign-Out Flow

After implementing all parts:

1. **Deploy both domains** (wait for Amplify builds to complete)
2. **Test on satellite domain**:
   - Sign in on www.mosc-temp.com
   - Click "Sign Out"
   - Watch browser console for logs:
     ```
     [Header] Satellite domain - redirecting to primary for sign-out...
     [SignOut Redirect] Starting sign-out process...
     [SignOut Redirect] Calling Clerk signOut...
     [SignOut Redirect] Redirecting with flag: https://www.mosc-temp.com?clerk_signout=true
     [Header] DETECTED clerk_signout=true FLAG!
     [Header] Clearing Clerk state and forcing reload...
     [Header] Cleared Clerk-related storage
     ```
   - Page should reload and show signed-out state
3. **Open multiple tabs** and test cross-tab sync
4. **Test on primary domain**:
   - Sign in on www.adwiise.com
   - Click "Sign Out"
   - Should use Clerk's normal sign-out flow

**Expected Behavior**:
- Satellite domain: Brief redirect to primary, then back with clean state
- Primary domain: Normal sign-out without redirect
- All tabs: Sync sign-out automatically
- No residual Clerk state in browser storage

**Troubleshooting**:
- If sign-out doesn't work, check browser console for errors
- Verify `/auth/signout-redirect` page exists on primary domain
- Check that `allowedRedirectOrigins` includes satellite domain
- Ensure both domains use same Clerk publishable key
- Clear browser cache and try in incognito mode

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

### Sign-Out Doesn't Work on Satellite Domain

**Issue**: Clicking "Sign Out" on www.mosc-temp.com doesn't sign the user out

**Symptoms**:
- User clicks sign out button but remains logged in
- Page reload shows user still authenticated
- Browser console shows Clerk errors like "This operation is not allowed on a satellite domain"

**Root Cause**:
Satellite domains CANNOT call Clerk's `signOut()` method directly. They must redirect to the primary domain for sign-out.

**Fix**:
1. **Verify sign-out redirect page exists** on primary domain:
   - Check that `src/app/auth/signout-redirect/page.tsx` exists in www.adwiise.com repo
   - Deploy primary domain if missing

2. **Check Header.tsx has satellite detection**:
   ```typescript
   const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
   const isSatellite = hostname.includes('mosc-temp.com');

   if (isSatellite) {
     // Should redirect to primary domain
     window.location.href = `https://www.adwiise.com/auth/signout-redirect?redirect_url=${encodeURIComponent(window.location.origin)}`;
   }
   ```

3. **Verify allowedRedirectOrigins** in primary domain's layout.tsx:
   ```typescript
   const clerkProps = {
     allowedRedirectOrigins: ['https://www.mosc-temp.com'],
   };
   ```

4. **Test the flow manually**:
   - Open browser console on www.mosc-temp.com
   - Click "Sign Out"
   - Watch for logs: `[Header] Satellite domain - redirecting to primary for sign-out...`
   - Should redirect to: `https://www.adwiise.com/auth/signout-redirect?redirect_url=https://www.mosc-temp.com`
   - Then redirect back to: `https://www.mosc-temp.com?clerk_signout=true`

5. **Check flag detection** in Header.tsx:
   - Verify useEffect runs on mount
   - Look for log: `[Header] DETECTED clerk_signout=true FLAG!`
   - Should clear localStorage/sessionStorage and force reload

6. **Clear browser cache completely**:
   ```
   Chrome: Ctrl+Shift+Delete → "All time" → Check "Cached images and files" and "Cookies"
   ```

7. **Test in incognito mode** to rule out cached state

### Sign-Out Flag Not Detected

**Issue**: After redirect from primary domain, satellite domain doesn't detect the `clerk_signout=true` flag

**Symptoms**:
- URL shows `?clerk_signout=true` but nothing happens
- User still appears logged in after redirect
- Console doesn't show "DETECTED clerk_signout=true FLAG!" message

**Fix**:
1. **Check useEffect is at top of Header component**:
   - Flag detection useEffect must run BEFORE Clerk initializes
   - Should be FIRST useEffect in component (lines 117-214 in reference implementation)
   - Empty dependency array `[]` ensures it runs once on mount

2. **Verify useEffect is not conditional**:
   ```typescript
   // ✅ CORRECT - Always runs
   useEffect(() => {
     if (typeof window === 'undefined') return;
     const urlParams = new URLSearchParams(window.location.search);
     const clerkSignedOut = urlParams.get('clerk_signout');
     if (clerkSignedOut === 'true') {
       // Clear state and reload
     }
   }, []);

   // ❌ WRONG - Runs too late
   useEffect(() => {
     if (isLoaded && userId) {  // Don't wait for Clerk!
       // ...
     }
   }, [isLoaded, userId]);
   ```

3. **Check component is 'use client'**:
   - Header.tsx must have `'use client';` at the top
   - Server components can't detect URL params on mount

4. **Verify hard reload is happening**:
   - Look for `window.location.replace(newUrl)` call
   - Should force reload, not soft navigation

### User Appears Logged In After Sign-Out

**Issue**: User signed out but still sees authenticated content on satellite domain

**Symptoms**:
- Flag was detected and page reloaded
- LocalStorage/sessionStorage were cleared
- But Clerk SDK still shows user as authenticated

**Fix**:
1. **Check cookies are being cleared**:
   ```typescript
   // In Header.tsx flag detection
   const cookies = document.cookie.split(';');
   cookies.forEach(cookie => {
     const cookieName = cookie.split('=')[0].trim();
     if (cookieName.includes('clerk') || cookieName.includes('__session')) {
       // Try all domain variations
       document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
       document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.mosc-temp.com`;
     }
   });
   ```

2. **HttpOnly cookies can't be cleared by JavaScript**:
   - These can only be cleared by the server that set them (primary domain)
   - Verify sign-out actually happened on primary domain
   - Check primary domain's `/auth/signout-redirect` page logs

3. **Session may be cached by Clerk SDK**:
   - Hard reload should fix this
   - Verify `window.location.replace()` is being used (not `window.location.href =`)
   - Try closing and reopening browser

4. **Check for service workers**:
   - Service workers can cache auth state
   - Unregister service workers in browser DevTools → Application → Service Workers

5. **Verify both domains use SAME Clerk publishable key**:
   - Primary and satellite MUST share the same Clerk instance
   - Check `.env` files in both repos

### Sign-Out Works But Other Tabs Stay Logged In

**Issue**: User signs out in one tab but remains logged in on other open tabs

**Fix**:
1. **Verify cross-tab broadcast is implemented**:
   ```typescript
   // In handleSignOut function
   localStorage.setItem('clerk_signout_broadcast', Date.now().toString());
   ```

2. **Check storage event listener exists**:
   ```typescript
   // In Header.tsx
   useEffect(() => {
     const handleStorageChange = (e: StorageEvent) => {
       if (e.key === 'clerk_signout_broadcast' && e.newValue) {
         window.location.reload();
       }
     };
     window.addEventListener('storage', handleStorageChange);
     return () => window.removeEventListener('storage', handleStorageChange);
   }, []);
   ```

3. **LocalStorage events only fire on OTHER tabs**:
   - Tab that sets localStorage value doesn't receive the event
   - This is expected browser behavior
   - Signing-out tab handles its own sign-out

4. **Check browser privacy settings**:
   - Some browsers block localStorage in private/incognito mode
   - Cross-tab sync won't work in this case

### Redirect URL Validation Error

**Issue**: Sign-out redirect page shows "Invalid redirect URL" error

**Symptoms**:
- URL: `https://www.adwiise.com/auth/signout-redirect?redirect_url=https://www.mosc-temp.com`
- Error message displayed on sign-out redirect page
- Console shows: `[SignOut Redirect] Invalid redirect URL`

**Fix**:
1. **Check allowedDomains array** in sign-out redirect page:
   ```typescript
   // In src/app/auth/signout-redirect/page.tsx
   const allowedDomains = ['mosc-temp.com', 'adwiise.com'];  // Add your satellite domains
   ```

2. **Add new satellite domains to array**:
   ```typescript
   const allowedDomains = [
     'mosc-temp.com',
     'adwiise.com',
     'your-new-satellite.com',  // Add here
   ];
   ```

3. **Check redirect_url parameter format**:
   - Should be full URL: `https://www.mosc-temp.com`
   - Not path only: `/` (this would fail validation)
   - Encoded properly: `encodeURIComponent(window.location.origin)`

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

To add future tenants (e.g., `www.tenant2.com`, `www.tenant3.com`), follow this checklist:

### Step-by-Step Process for New Satellite Domain

#### 1. Update Primary Domain Code (www.adwiise.com repo)

**File: `src/app/layout.tsx`** - Add new satellite domain to detection logic:
```typescript
// Before:
const isSatellite = hostname.includes('mosc-temp.com');

// After:
const isSatellite = hostname.includes('mosc-temp.com') ||
                     hostname.includes('tenant2.com') ||
                     hostname.includes('tenant3.com');

// Update allowedRedirectOrigins:
const clerkProps = isSatellite
  ? { /* satellite config */ }
  : {
      allowedRedirectOrigins: [
        'https://www.mosc-temp.com',
        'https://www.tenant2.com',    // Add new domain
        'https://www.tenant3.com',    // Add new domain
      ],
    };
```

**File: `src/app/auth/signout-redirect/page.tsx`** - Add to allowed domains:
```typescript
// Update allowedDomains array:
const allowedDomains = [
  'mosc-temp.com',
  'adwiise.com',
  'tenant2.com',     // Add new domain
  'tenant3.com',     // Add new domain
];
```

**File: `src/components/Header.tsx`** - No changes needed (uses dynamic hostname detection)

#### 2. Update Satellite Domain Code (tenant2.com repo)

**File: `src/app/layout.tsx`**:
```typescript
const isSatellite = hostname.includes('tenant2.com');  // Your new domain

const clerkProps = isSatellite
  ? {
      isSatellite: true,
      domain: 'tenant2.com',  // Bare domain without www
      signInUrl: 'https://www.adwiise.com/sign-in',
      signUpUrl: 'https://www.adwiise.com/sign-up',
    }
  : {
      allowedRedirectOrigins: ['https://www.tenant2.com'],
    };
```

**File: `src/components/Header.tsx`** - Update satellite detection:
```typescript
const isSatellite = hostname.includes('tenant2.com');  // Your new domain

if (isSatellite) {
  // Redirect to primary for sign-out
  window.location.href = `https://www.adwiise.com/auth/signout-redirect?redirect_url=${encodeURIComponent(window.location.origin)}`;
}

// In flag detection useEffect, update cookie clearing domains:
const domains = [
  window.location.hostname,
  '.tenant2.com',   // Your new domain
  'tenant2.com',    // Your new domain
];
```

#### 3. DNS and Clerk Dashboard Setup

1. **Register or configure domain** (tenant2.com)
2. **Create hosted zone** in Route53
3. **Add to AWS Amplify** (new app or branch)
4. **Add CNAME records**:
   - `www.tenant2.com` → Amplify app URL
   - `clerk.www.tenant2.com` → `frontend-api.clerk.services` (from Clerk Dashboard)
5. **Add to Clerk Dashboard** → Satellite domains → "Add satellite domain"
6. **Verify satellite domain** in Clerk Dashboard

#### 4. OAuth Configuration

**Google OAuth** (or other OAuth providers):
- Add `https://www.tenant2.com` to **Authorized JavaScript origins**
- Add `https://www.tenant2.com/sso-callback` to **Authorized redirect URIs**

#### 5. Deploy and Test

1. **Deploy primary domain** (www.adwiise.com) with updated code
2. **Deploy new satellite domain** (www.tenant2.com)
3. **Test sign-in flow**:
   - Visit www.tenant2.com
   - Click "Sign in" → Should redirect to www.adwiise.com
   - Sign in → Should redirect back to www.tenant2.com
4. **Test sign-out flow**:
   - Click "Sign out" on www.tenant2.com
   - Should redirect to www.adwiise.com/auth/signout-redirect
   - Should redirect back to www.tenant2.com with `?clerk_signout=true`
   - Page should reload and show logged-out state

### Quick Reference: Files to Update

**Primary Domain (www.adwiise.com) - 2 files**:
- [ ] `src/app/layout.tsx` - Add to `isSatellite` detection and `allowedRedirectOrigins`
- [ ] `src/app/auth/signout-redirect/page.tsx` - Add to `allowedDomains` array

**New Satellite Domain (tenant2.com) - 2 files**:
- [ ] `src/app/layout.tsx` - Configure satellite with new domain
- [ ] `src/components/Header.tsx` - Update satellite detection and cookie domains

**External Services**:
- [ ] Route53 DNS records (2 CNAMEs)
- [ ] Clerk Dashboard (add and verify satellite domain)
- [ ] Google OAuth (add authorized origins and redirects)
- [ ] AWS Amplify (deploy changes)

### Automated Setup Script (Optional)

For multiple satellite domains, consider creating a setup script:

```typescript
// scripts/add-satellite-domain.ts

const satelliteDomains = [
  'mosc-temp.com',
  'tenant2.com',
  'tenant3.com',
  // Add more domains here
];

// This array can be imported in layout.tsx and sign-out redirect page
export const SATELLITE_DOMAINS = satelliteDomains;

export const isHostnameSatellite = (hostname: string): boolean => {
  return satelliteDomains.some(domain => hostname.includes(domain));
};

export const getAllowedRedirectOrigins = (): string[] => {
  return satelliteDomains.map(domain => `https://www.${domain}`);
};
```

Then in `layout.tsx`:
```typescript
import { isHostnameSatellite, getAllowedRedirectOrigins } from '@/scripts/add-satellite-domain';

const isSatellite = isHostnameSatellite(hostname);
const allowedRedirectOrigins = getAllowedRedirectOrigins();
```

This centralizes satellite domain configuration and reduces errors when adding new domains.

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
