$ErrorActionPreference = "Stop"

$files = @(
  "d:\MedicalZone_New\index.html",
  "d:\MedicalZone_New\store.html"
)

$enc = [System.Text.UTF8Encoding]::new($true)  # include BOM

foreach ($f in $files) {
  if (!(Test-Path $f)) { throw "Missing file: $f" }
  $content = Get-Content -Raw -Encoding utf8 $f
  $bytes = $enc.GetBytes($content)
  [System.IO.File]::WriteAllBytes($f, $bytes)
  Write-Output "Fixed: $f"
}

