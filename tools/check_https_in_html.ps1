$ErrorActionPreference = "Stop"

$pairs = @(
  "d:\MedicalZone_New\index.html",
  "d:\MedicalZone_New\store.html"
)

foreach ($p in $pairs) {
  if (!(Test-Path $p)) { continue }
  $m = Select-String -Path $p -Pattern "https://" -SimpleMatch -AllMatches
  if ($null -ne $m) {
    Write-Output ($p + " => has_https_count=" + $m.Matches.Count)
  } else {
    Write-Output ($p + " => has_https_count=0")
  }
}

