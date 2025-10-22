# Clerk Production Domain Whitelist Configuration

## Research Results: How to Whitelist Domains in Clerk

Based on official Clerk documentation research, here are **THREE methods** to configure allowed domains for production:

---

## Method 1: Using Clerk API (RECOMMENDED - Works Immediately) ⭐

Clerk provides an API endpoint to configure allowed origins programmatically.

### API Endpoint
```bash
PATCH https://api.clerk.com/v1/instance
```

### How to Use It

**Step 1: Get Your Clerk Secret Key**
You already have it: `stripe_apikey_with_sklive_prefix`

**Step 2: Run This Command**

```bash
curl -X PATCH https://api.clerk.com/v1/instance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer stripe_apikey_with_sklive_prefix" \
  -d '{
    "allowed_origins": [
      "https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com",
      "https://www.adwiise.com",
      "http://localhost:3000"
    ]
  }'
```

**For Windows PowerShell:**
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer stripe_apikey_with_sklive_prefix"
}

$body = @{
    allowed_origins = @(
        "https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com",
        "https://www.adwiise.com",
        "http://localhost:3000"
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.clerk.com/v1/instance" -Method PATCH -Headers $headers -Body $body
```

**Step 3: Test**
After running this command, your Amplify domain will be whitelisted immediately. Test your app!

---

## Method 2: Using authorizedParties in Code (For Same Root Domain)

If your Amplify domain and production domain share the same root domain, use `authorizedParties`.

### In Your Middleware

Update `src/middleware.ts`:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware({
  // Whitelist authorized origins
  authorizedParties: [
    'https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com',
    'https://www.adwiise.com',
    'http://localhost:3000',
  ],

  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/sso-callback(.*)',
    '/api/webhooks(.*)',
    '/api/public(.*)',
    '/mosc(.*)',
    '/events(.*)',
    '/gallery(.*)',
    '/about(.*)',
    '/contact(.*)',
  ],

  afterAuth(auth, req) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', req.nextUrl.pathname);
    return response;
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[\\w]+$).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**Note:** This protects against CSRF attacks by explicitly whitelisting allowed origins.

---

## Method 3: Using allowedRedirectOrigins in ClerkProvider

For multi-domain setups, configure allowed redirect origins.

### In Your Root Layout

Update `src/app/layout.tsx`:

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      allowedRedirectOrigins={[
        'https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com',
        'https://www.adwiise.com',
        'http://localhost:3000',
      ]}
    >
      <html lang="en" suppressHydrationWarning>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Method 4: Check Clerk Dashboard - Domains Section

Based on documentation, domain configuration should be in:

### Location in Clerk Dashboard:
1. Go to: **Clerk Dashboard** → **Domains**
2. Look for: **"Satellites"** tab or **"Frontend API"** section
3. There should be an **"Advanced"** dropdown
4. Or look for **"Allowed Origins"** or **"Redirect URLs"** settings

### If You Can't Find It:
The API method (Method 1) is the official way to configure this when dashboard UI is not available.

---

## Recommended Implementation Strategy

### For Your Production Setup:

**Step 1: Use API to Whitelist Immediately (Method 1)**
```bash
# Run this now to whitelist your Amplify domain
curl -X PATCH https://api.clerk.com/v1/instance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer stripe_apikey_with_sklive_prefix" \
  -d '{"allowed_origins": ["https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com", "https://www.adwiise.com", "http://localhost:3000"]}'
```

**Step 2: Add authorizedParties to Middleware (Method 2)**
Update your middleware.ts to include `authorizedParties` for CSRF protection.

**Step 3: Test**
- Clear browser cache
- Visit: `https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com/sign-in`
- Should work with no 400 errors!

---

## Understanding the Configuration

### What Each Method Does:

**allowed_origins (API)**:
- Tells Clerk: "Accept requests from these domains"
- Works at the Clerk API level
- Applies immediately after API call

**authorizedParties (Middleware)**:
- Validates that session tokens are from authorized origins
- Protects against CSRF attacks
- Works at your application level

**allowedRedirectOrigins (ClerkProvider)**:
- Controls where Clerk can redirect after authentication
- Important for multi-domain setups
- Works at the React component level

### Why All Three?

For maximum security and flexibility:
1. **API** whitelists at Clerk's server level
2. **Middleware** validates at your app's server level
3. **ClerkProvider** controls at your app's client level

But you can start with just the **API method** to get it working.

---

## Testing the Configuration

After configuring allowed origins:

```bash
# Test the API endpoint directly
curl https://clerk.adwiise.com/v1/client?_clerk_js_version=4.73.14 \
  -H "Origin: https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com" \
  -H "User-Agent: Mozilla/5.0" \
  -v
```

Should return **200 OK** instead of **400 Bad Request**.

---

## Complete Configuration Checklist

### ✅ DNS Configuration (Already Done):
```
clerk.adwiise.com → CNAME → frontend-api.clerk.services
accounts.adwiise.com → CNAME → accounts.clerk.services
```

### ✅ Whitelist Domains via API:
```bash
curl -X PATCH https://api.clerk.com/v1/instance \
  -H "Authorization: Bearer stripe_apikey_with_sklive_prefix" \
  -H "Content-Type: application/json" \
  -d '{"allowed_origins": ["https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com", "https://www.adwiise.com"]}'
```

### ✅ Update Middleware (Optional but Recommended):
Add `authorizedParties` to `clerkMiddleware()` configuration.

### ✅ Test:
Visit your Amplify URL and verify no 400 errors.

---

## Why This is Better Than TEST Keys

**Using TEST Keys**:
- ❌ Not suitable for production
- ❌ Test data, not real users
- ❌ May have rate limits
- ❌ Can't use custom domains

**Using LIVE Keys with Whitelisting**:
- ✅ Production-ready
- ✅ Real user data
- ✅ Custom domains (clerk.adwiise.com)
- ✅ Professional setup
- ✅ Better security

---

## Troubleshooting

### If API Call Fails:

**Error: "Invalid API key"**
- Check that secret key is correct
- Ensure it's the LIVE key (starts with `sk_live_`)

**Error: "Unauthorized"**
- Secret key might be for different instance
- Try regenerating keys in Clerk Dashboard

### If Still Getting 400 Errors:

**Wait 2-5 minutes** after API call for changes to propagate.

**Clear browser cache** completely.

**Check browser console** - make sure it's calling `clerk.adwiise.com` not some other domain.

---

## Summary

**BEST APPROACH FOR PRODUCTION:**

1. **Run the API command** (Method 1) to whitelist your domains
2. **Add `authorizedParties`** to your middleware (Method 2) for security
3. **Test with your LIVE keys** - should work immediately
4. **Keep using LIVE keys** - no need for TEST keys in production!

This is the official, documented way to configure allowed origins in Clerk for production deployments.

---

**Command to Run NOW:**

```bash
curl -X PATCH https://api.clerk.com/v1/instance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer stripe_apikey_with_sklive_prefix" \
  -d '{"allowed_origins": ["https://feature-common-clerk.d1508w3f27cyps.amplifyapp.com", "https://www.adwiise.com", "http://localhost:3000"]}'
```

After running this, your 400 errors should disappear! 🎉
