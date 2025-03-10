# Check if .env file exists, if not create from example
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created new .env file from .env.example"
    Write-Host "Please edit .env file with your actual values before continuing"
    exit
}

# Load .env file
$envContent = Get-Content .env
foreach ($line in $envContent) {
    if ($line.Trim() -and !$line.StartsWith("#")) {
        $key, $value = $line.Split("=", 2)
        $key = $key.Trim()
        $value = $value.Trim()
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "Set $key environment variable"
    }
}

Write-Host "`nEnvironment variables set successfully!"
Write-Host "You can now run: npx playwright test"
