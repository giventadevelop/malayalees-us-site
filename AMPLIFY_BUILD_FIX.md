# Amplify Build Fix - Metadata Syntax Errors

## 🚨 Problem

Build failing on AWS Amplify due to **unescaped apostrophes** in metadata objects.

**Error Files:**
1. `src/app/mosc/spiritual-organizations/marth-mariam-vanitha-samajam-womens-wing-of-orthodox-church-of-india/page.tsx`
2. `src/app/mosc/spiritual-organizations/st-pauls-st-thomas-suvishesha-sangam-national-association-for-mission-studies/page.tsx`

**Error Message:**
```
Error: Expected ',', got 's'
```

**Cause:** Apostrophes in metadata strings not properly escaped.

---

## ✅ Solution Options

### Option 1: Quick Fix - Use Double Quotes (Recommended)

Change metadata from:
```typescript
export const metadata = {
  title: 'Marth Mariam Vanitha Samajam (Women's Wing of Orthodox Church of India) | MOSC',
  description: 'A Brief History...',
};
```

To:
```typescript
export const metadata = {
  title: "Marth Mariam Vanitha Samajam (Women's Wing of Orthodox Church of India) | MOSC",
  description: "A Brief History...",
};
```

### Option 2: Escape Apostrophes

Change:
```typescript
title: 'Women's Wing'
```

To:
```typescript
title: 'Women\'s Wing'
```

### Option 3: Use Template Literals

Change:
```typescript
title: 'Women's Wing'
```

To:
```typescript
title: `Women's Wing`
```

---

## 🔧 Fix Commands

Since these files might only exist in the remote branch, you have two approaches:

### Approach A: Fix Locally and Push

If files exist in your current branch:

```bash
# Find all page.tsx files with metadata issues
grep -r "export const metadata" src/app/mosc --include="*.tsx"

# Or use this command to find files with apostrophes in metadata
grep -r "title: '" src/app/mosc --include="*.tsx" | grep "'"
```

Then manually edit each file to use double quotes or escape apostrophes.

### Approach B: Fix Directly in Amplify Build Settings

Add a pre-build command in Amplify Console:

1. Go to AWS Amplify Console
2. Select your app
3. Go to Build settings
4. Add to `preBuild` phase:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        # Fix apostrophe issues in metadata
        - find src/app/mosc -name "*.tsx" -type f -exec sed -i "s/title: '\\([^']*\\)'s/title: \"\\1's/g" {} +
        - find src/app/mosc -name "*.tsx" -type f -exec sed -i "s/description: '\\([^']*\\)'s/description: \"\\1's/g" {} +
    build:
      commands:
        - npm run build
```

### Approach C: Automated Fix Script (Best for Multiple Files)

Create a fix script:

```bash
# Create fix script
cat > fix-metadata-quotes.sh << 'EOF'
#!/bin/bash

echo "Fixing metadata apostrophe issues..."

# Find all page.tsx files with metadata
find src/app/mosc -name "page.tsx" -type f | while read file; do
  echo "Checking $file..."

  # Check if file has metadata with apostrophes
  if grep -q "export const metadata.*'.*'s.*'" "$file"; then
    echo "  Fixing $file..."

    # Replace single quotes with double quotes in metadata objects
    sed -i "s/export const metadata = {/export const metadata = {/g" "$file"
    sed -i "s/  title: '/  title: \"/g" "$file"
    sed -i "s/',$/\",/g" "$file"
    sed -i "s/  description: '/  description: \"/g" "$file"

    echo "  ✓ Fixed $file"
  fi
done

echo "✓ All files processed"
EOF

# Make executable and run
chmod +x fix-metadata-quotes.sh
./fix-metadata-quotes.sh

# Commit changes
git add src/app/mosc
git commit -m "fix: Escape apostrophes in MOSC metadata"
git push origin feature_Common_Clerk
```

---

## 🎯 Recommended Solution (Simplest)

**For immediate fix without the files locally:**

### Step 1: Add Build Command Override in Amplify

1. Go to AWS Amplify Console → Your App
2. Build Settings → Edit
3. Add this to the build spec:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - |
          # Fix apostrophe issues in TypeScript metadata
          echo "Fixing metadata syntax errors..."
          find src -name "*.tsx" -type f -print0 | xargs -0 sed -i "s/title: '\\(.*\\)'s\\(.*\\)'/title: \"\\1's\\2\"/g"
          find src -name "*.tsx" -type f -print0 | xargs -0 sed -i "s/description: '\\(.*\\)'s\\(.*\\)'/description: \"\\1's\\2\"/g"
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Step 2: Redeploy

1. Go to Amplify Console
2. Click "Redeploy this version"
3. Or trigger new build by pushing any commit

---

## 🔍 Root Cause Analysis

**Why This Happens:**

JavaScript/TypeScript strings with single quotes cannot contain unescaped apostrophes:

❌ **Wrong:**
```typescript
title: 'Women's Wing'  // Syntax error - apostrophe ends the string early
```

✅ **Correct Options:**
```typescript
title: "Women's Wing"  // Use double quotes
title: 'Women\'s Wing' // Escape the apostrophe
title: `Women's Wing`  // Use template literal
```

---

## 📋 Prevention for Future

### ESLint Rule

Add to `.eslintrc.json`:

```json
{
  "rules": {
    "quotes": ["error", "double", {
      "avoidEscape": true,
      "allowTemplateLiterals": true
    }]
  }
}
```

This enforces double quotes by default, avoiding apostrophe issues.

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for unescaped apostrophes in metadata
if git diff --cached --name-only | grep "\.tsx$" | xargs grep -n "title: '.*'s.*'"; then
  echo "Error: Found unescaped apostrophes in metadata"
  echo "Use double quotes or escape apostrophes"
  exit 1
fi
```

---

## 🚀 Quick Fix for This Deployment

**Fastest solution right now:**

1. Go to AWS Amplify Console
2. Build Settings → Edit
3. Update `amplify.yml` with the sed commands above
4. Save
5. Click "Redeploy this version"

**Expected result:** Build should succeed in ~5-10 minutes

---

## 📞 If Build Still Fails

Check build logs for:
1. Which exact files are failing
2. Line numbers with errors
3. Copy the error message

Then either:
- Use sed commands to fix those specific files
- Or manually update metadata to use double quotes

---

**Status:** 🛠️ Multiple fix options provided
**Recommended:** Add sed fix to Amplify build settings (no code changes needed)
**Time to fix:** 5-10 minutes
