# ==============================================================================
# Add-ClerkAllowedOrigins.ps1
# ==============================================================================
# Description: Whitelist domains in Clerk instance for production authentication
# Author: System Administrator
# Created: 2025-01-21
# ==============================================================================

<#
.SYNOPSIS
    Adds allowed origins (domains) to your Clerk instance configuration.

.DESCRIPTION
    This script configures allowed origins in your Clerk instance using the
    Clerk Backend API. It prompts for domains to whitelist and can optionally
    read the Clerk secret key from .env.production file.

.PARAMETER SecretKey
    The Clerk secret key (sk_live_*). If not provided, will attempt to read
    from .env.production or prompt for input.

.PARAMETER Origins
    Array of origin URLs to whitelist. If not provided, will prompt for input.

.PARAMETER EnvFilePath
    Path to .env.production file. Defaults to relative path from script location.

.PARAMETER Silent
    Suppress verbose output. Only show results.

.EXAMPLE
    .\Add-ClerkAllowedOrigins.ps1
    Prompts for all required information

.EXAMPLE
    .\Add-ClerkAllowedOrigins.ps1 -Origins @("https://example.com", "https://app.example.com")
    Whitelist specific domains (will prompt for secret key)

.EXAMPLE
    .\Add-ClerkAllowedOrigins.ps1 -SecretKey "sk_live_..." -Origins @("https://example.com")
    Provide both secret key and origins

.EXAMPLE
    .\Add-ClerkAllowedOrigins.ps1 -Silent
    Run in silent mode with minimal output
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false, HelpMessage="Clerk secret key (sk_live_*)")]
    [string]$SecretKey,

    [Parameter(Mandatory=$false, HelpMessage="Array of origin URLs to whitelist")]
    [string[]]$Origins,

    [Parameter(Mandatory=$false, HelpMessage="Path to .env.production file")]
    [string]$EnvFilePath,

    [Parameter(Mandatory=$false, HelpMessage="Suppress verbose output")]
    [switch]$Silent
)

# ==============================================================================
# Configuration
# ==============================================================================

$ClerkApiUrl = "https://api.clerk.com/v1/instance"
$ScriptVersion = "1.0.0"
$DefaultEnvPath = "..\..\..\.env.production"

# ==============================================================================
# Helper Functions
# ==============================================================================

function Write-Header {
    param([string]$Title)
    if (-not $Silent) {
        Write-Host ""
        Write-Host "================================================================================" -ForegroundColor Cyan
        Write-Host " $Title" -ForegroundColor Cyan
        Write-Host "================================================================================" -ForegroundColor Cyan
        Write-Host ""
    }
}

function Write-Info {
    param([string]$Message)
    if (-not $Silent) {
        Write-Host "[INFO] $Message" -ForegroundColor Green
    }
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Read-EnvFile {
    param(
        [string]$FilePath,
        [string]$KeyName
    )

    if (-not (Test-Path $FilePath)) {
        Write-Warning "Environment file not found: $FilePath"
        return $null
    }

    Write-Info "Reading $KeyName from: $FilePath"

    try {
        $content = Get-Content $FilePath -Raw

        # Try multiple possible key names
        $patterns = @(
            "^CLERK_SECRET_KEY=(.+)$",
            "^CLERK_SECRET_KEY='(.+)'$",
            "^CLERK_SECRET_KEY=`"(.+)`"$"
        )

        foreach ($pattern in $patterns) {
            if ($content -match $pattern) {
                $value = $Matches[1].Trim()
                Write-Info "Found $KeyName in environment file"
                return $value
            }
        }

        Write-Warning "$KeyName not found in environment file"
        return $null
    }
    catch {
        Write-Error "Error reading environment file: $_"
        return $null
    }
}

function Test-SecretKey {
    param([string]$Key)

    if ([string]::IsNullOrWhiteSpace($Key)) {
        return $false
    }

    # Check if key starts with sk_live_ or sk_test_
    if ($Key -match "^sk_(live|test)_[A-Za-z0-9]+$") {
        return $true
    }

    return $false
}

function Test-Origin {
    param([string]$Origin)

    if ([string]::IsNullOrWhiteSpace($Origin)) {
        return $false
    }

    # Check if origin is a valid URL
    try {
        $uri = [System.Uri]$Origin
        if ($uri.Scheme -in @("http", "https") -and $uri.Host) {
            return $true
        }
    }
    catch {
        return $false
    }

    return $false
}

function Get-SecretKeyFromUser {
    Write-Header "Clerk Secret Key Required"

    Write-Host "Your Clerk secret key is needed to configure allowed origins."
    Write-Host "The key should start with 'sk_live_' for production or 'sk_test_' for development."
    Write-Host ""

    $tryCount = 0
    $maxTries = 3

    while ($tryCount -lt $maxTries) {
        $key = Read-Host "Enter Clerk Secret Key (or 'exit' to cancel)"

        if ($key -eq "exit") {
            Write-Warning "Operation cancelled by user"
            exit 1
        }

        if (Test-SecretKey -Key $key) {
            return $key
        }

        $tryCount++
        Write-Error "Invalid secret key format. Must start with 'sk_live_' or 'sk_test_'"
        Write-Host "Attempts remaining: $($maxTries - $tryCount)" -ForegroundColor Yellow
        Write-Host ""
    }

    Write-Error "Maximum attempts reached. Exiting."
    exit 1
}

function Get-OriginsFromUser {
    Write-Header "Allowed Origins Configuration"

    Write-Host "Enter the domains you want to whitelist for Clerk authentication."
    Write-Host "These should be the full URLs where your application is deployed."
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  - https://www.example.com"
    Write-Host "  - https://app.example.com"
    Write-Host "  - https://feature-branch.amplifyapp.com"
    Write-Host "  - http://localhost:3000"
    Write-Host ""

    $originsList = @()
    $continueAdding = $true
    $index = 1

    while ($continueAdding) {
        Write-Host "Origin $index" -ForegroundColor Cyan
        $origin = Read-Host "Enter origin URL (or press Enter to finish)"

        if ([string]::IsNullOrWhiteSpace($origin)) {
            if ($originsList.Count -eq 0) {
                Write-Warning "At least one origin is required"
                continue
            }
            $continueAdding = $false
            break
        }

        if (Test-Origin -Origin $origin) {
            $originsList += $origin
            Write-Success "Added: $origin"
            $index++
        }
        else {
            Write-Error "Invalid URL format. Please enter a valid HTTP/HTTPS URL."
        }

        Write-Host ""
    }

    return $originsList
}

function Invoke-ClerkApiRequest {
    param(
        [string]$ApiUrl,
        [string]$SecretKey,
        [string[]]$AllowedOrigins
    )

    Write-Info "Preparing API request to Clerk..."

    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $SecretKey"
    }

    $body = @{
        allowed_origins = $AllowedOrigins
    } | ConvertTo-Json -Depth 10

    Write-Info "Sending PATCH request to: $ApiUrl"

    try {
        $response = Invoke-RestMethod -Uri $ApiUrl -Method PATCH -Headers $headers -Body $body -ErrorAction Stop
        return @{
            Success = $true
            Response = $response
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.Exception.Message

        return @{
            Success = $false
            StatusCode = $statusCode
            Error = $errorMessage
        }
    }
}

# ==============================================================================
# Main Script Logic
# ==============================================================================

Write-Header "Clerk Allowed Origins Configuration Script v$ScriptVersion"

# Step 1: Get Secret Key
if ([string]::IsNullOrWhiteSpace($SecretKey)) {
    Write-Info "Secret key not provided as parameter"

    # Try to read from .env.production
    if ([string]::IsNullOrWhiteSpace($EnvFilePath)) {
        $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
        $EnvFilePath = Join-Path $scriptDir $DefaultEnvPath
    }

    $SecretKey = Read-EnvFile -FilePath $EnvFilePath -KeyName "CLERK_SECRET_KEY"

    if ([string]::IsNullOrWhiteSpace($SecretKey) -or -not (Test-SecretKey -Key $SecretKey)) {
        Write-Warning "Could not read valid secret key from environment file"
        $SecretKey = Get-SecretKeyFromUser
    }
    else {
        Write-Success "Secret key loaded from environment file"

        # Mask the key for display
        $maskedKey = $SecretKey.Substring(0, 10) + "..." + $SecretKey.Substring($SecretKey.Length - 4)
        Write-Info "Using key: $maskedKey"
    }
}
else {
    if (-not (Test-SecretKey -Key $SecretKey)) {
        Write-Error "Provided secret key is invalid"
        exit 1
    }
    Write-Success "Secret key provided as parameter"
}

# Step 2: Get Origins
if ($null -eq $Origins -or $Origins.Count -eq 0) {
    Write-Info "Origins not provided as parameter"
    $Origins = Get-OriginsFromUser
}
else {
    Write-Success "Origins provided as parameter"

    # Validate all provided origins
    $invalidOrigins = @()
    foreach ($origin in $Origins) {
        if (-not (Test-Origin -Origin $origin)) {
            $invalidOrigins += $origin
        }
    }

    if ($invalidOrigins.Count -gt 0) {
        Write-Error "Invalid origin URLs detected:"
        foreach ($invalid in $invalidOrigins) {
            Write-Host "  - $invalid" -ForegroundColor Red
        }
        exit 1
    }
}

# Step 3: Display Summary
Write-Header "Configuration Summary"

Write-Host "Secret Key:      " -NoNewline
$maskedKey = $SecretKey.Substring(0, 10) + "..." + $SecretKey.Substring($SecretKey.Length - 4)
Write-Host $maskedKey -ForegroundColor Yellow

Write-Host "Origins to add:  " -NoNewline
Write-Host $Origins.Count -ForegroundColor Yellow
Write-Host ""

foreach ($origin in $Origins) {
    Write-Host "  - $origin" -ForegroundColor Cyan
}

Write-Host ""
$confirm = Read-Host "Proceed with configuration? (Y/N)"

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Warning "Operation cancelled by user"
    exit 0
}

# Step 4: Make API Request
Write-Header "Updating Clerk Configuration"

$result = Invoke-ClerkApiRequest -ApiUrl $ClerkApiUrl -SecretKey $SecretKey -AllowedOrigins $Origins

# Step 5: Display Results
Write-Header "Results"

if ($result.Success) {
    Write-Success "Allowed origins successfully configured!"
    Write-Host ""
    Write-Host "The following domains are now whitelisted in your Clerk instance:" -ForegroundColor Green
    Write-Host ""
    foreach ($origin in $Origins) {
        Write-Host "  - $origin" -ForegroundColor Green
    }
    Write-Host ""
    Write-Info "Changes may take 2-5 minutes to propagate"
    Write-Info "Clear your browser cache before testing"
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Wait 2-5 minutes for changes to take effect"
    Write-Host "  2. Clear browser cache and cookies"
    Write-Host "  3. Visit your application and test authentication"
    Write-Host "  4. Run Get-ClerkAllowedOrigins.ps1 to verify configuration"
    Write-Host ""

    exit 0
}
else {
    Write-Error "Failed to configure allowed origins"
    Write-Host ""
    Write-Host "Status Code: $($result.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($result.Error)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "  - Invalid secret key"
    Write-Host "  - Secret key is for different Clerk instance"
    Write-Host "  - Network connectivity issues"
    Write-Host "  - Clerk API is temporarily unavailable"
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Verify your secret key in Clerk Dashboard > Developers > API Keys"
    Write-Host "  2. Ensure the key starts with 'sk_live_' for production"
    Write-Host "  3. Check your internet connection"
    Write-Host "  4. Try again in a few minutes"
    Write-Host ""

    exit 1
}
