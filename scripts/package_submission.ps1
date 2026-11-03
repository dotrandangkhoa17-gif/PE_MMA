param(
    [Parameter(Mandatory=$true)]
    [string]$StudentCode
)

$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $PSScriptRoot
$destFolder = Join-Path $workspace $StudentCode
$zipFile = Join-Path $destFolder "$StudentCode.zip"

Write-Host "Creating submission directory: $destFolder" -ForegroundColor Cyan
if (!(Test-Path $destFolder)) {
    New-Item -ItemType Directory -Path $destFolder | Out-Null
}

$tempFolder = Join-Path $env:TEMP "pe_temp_$StudentCode"
if (Test-Path $tempFolder) {
    Remove-Item -Recurse -Force $tempFolder
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Copying project files (excluding node_modules, .expo, .git, .env)..." -ForegroundColor Cyan

# Danh sách file & thư mục cần sao chép
$items = Get-ChildItem -Path $workspace -Exclude "node_modules", ".expo", ".git", ".env", $StudentCode, "scripts"

foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $tempFolder -Recurse -Force
}

# Đảm bảo có .env.example
if (!(Test-Path (Join-Path $tempFolder ".env.example"))) {
    Write-Warning ".env.example is missing!"
}

# Nén thành file zip
Write-Host "Compressing to $zipFile..." -ForegroundColor Cyan
if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}
Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipFile -Force

# Dọn dẹp
Remove-Item -Recurse -Force $tempFolder

Write-Host "Packaging complete!" -ForegroundColor Green
Write-Host "Output Zip: $zipFile"
Write-Host "Next Step: Place your $StudentCode.docx into $destFolder and submit the $StudentCode folder." -ForegroundColor Yellow

