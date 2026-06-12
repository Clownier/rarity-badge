param(
  [Parameter(Mandatory = $true)]
  [string]$NewVersion
)

$tsPath = Join-Path $PSScriptRoot '..\src\version.ts'
$publicPath = Join-Path $PSScriptRoot '..\public\version'

# Update src/version.ts
$tsContent = "export const VERSION = '$NewVersion';`n"
Set-Content -Path $tsPath -Value $tsContent -NoNewline

# Update public/version
Set-Content -Path $publicPath -Value "$NewVersion`n" -NoNewline

Write-Host "✅ Version updated to $NewVersion in:"
Write-Host "   $tsPath"
Write-Host "   $publicPath"
