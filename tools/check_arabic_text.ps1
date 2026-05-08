$ErrorActionPreference = "Stop"

$files = @(
  "d:\MedicalZone_New\index.html",
  "d:\MedicalZone_New\store.html"
)

foreach ($f in $files) {
  if (!(Test-Path $f)) { continue }

  $c = Get-Content -Raw -Path $f -Encoding utf8

  $chO = [char]0x00D8  # Ø
  $chU = [char]0x00D9  # Ù

  $hasO = $c.Contains($chO)
  $hasU = $c.Contains($chU)

  Write-Output ("==== " + $f)
  Write-Output ("contains_mojibake_Ø: " + $hasO)
  Write-Output ("contains_mojibake_Ù: " + $hasU)
}

