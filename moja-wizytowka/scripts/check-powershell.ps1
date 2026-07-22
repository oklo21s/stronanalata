$ErrorActionPreference = 'Stop'

$targets = @(
  (Join-Path $PSScriptRoot 'generate-og.ps1')
)

foreach ($target in $targets) {
  $tokens = $null
  $parseErrors = $null
  [System.Management.Automation.Language.Parser]::ParseFile($target, [ref]$tokens, [ref]$parseErrors) | Out-Null

  if ($parseErrors.Count -gt 0) {
    $messages = ($parseErrors | ForEach-Object { $_.Message }) -join '; '
    throw "Blad skladni w pliku $target`: $messages"
  }
}

Write-Output "Skladnia PowerShell: OK (pliki: $($targets.Count))"
