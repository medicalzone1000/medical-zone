$ErrorActionPreference = "Stop"

$srcDir = "C:\Users\User\Pictures\100"
$dstDir = "d:\MedicalZone_New\images\fb"

if (!(Test-Path $srcDir)) {
  throw "Source folder not found: $srcDir"
}

New-Item -ItemType Directory -Force -Path $dstDir | Out-Null

# Collect files (deterministic order)
$files = Get-ChildItem -Path $srcDir -Recurse -File |
  Sort-Object Name |
  ForEach-Object { $_.Name }

if ($files.Count -lt 1) {
  throw "No files found in $srcDir"
}

Write-Output ("Found images: " + $files.Count)

# Copy all images into project so they can be referenced relatively
foreach ($name in $files) {
  $srcPath = Join-Path $srcDir $name
  $dstPath = Join-Path $dstDir $name
  # In case source has same name in different subfolders, we just copy first resolved path.
  if (!(Test-Path $dstPath)) {
    try {
      $resolved = Get-ChildItem -Path $srcDir -Recurse -File -Filter $name | Select-Object -First 1
      if ($null -eq $resolved) { continue }
      Copy-Item -Force -Path $resolved.FullName -Destination $dstPath
    } catch {
      # ignore single-file copy errors
    }
  }
}

function Replace-ExternalImagesInFile {
  param(
    [Parameter(Mandatory=$true)][string]$filePath
  )

  if (!(Test-Path $filePath)) { throw "File not found: $filePath" }

  $text = Get-Content -Raw -Path $filePath

  # Replace hero background first if present
  $heroRegex = "--hero-bg:\s*url\('https://[^']+'\)"
  $text = [regex]::Replace($text, $heroRegex, {
    param($m)
    $img = $script:files[$script:nextIdx % $script:files.Count]
    $script:nextIdx++
    return ("--hero-bg: url('images/fb/" + $img + "')")
  })

  # Replace all img src with https://... in the file
  $srcRegex = "src=""https://[^""]+"""

  $matches = [regex]::Matches($text, $srcRegex)
  foreach ($m in $matches) {
    $img = $script:files[$script:nextIdx % $script:files.Count]
    $script:nextIdx++
    $replacement = ('src="images/fb/' + $img + '"')
    $text = $text.Replace($m.Value, $replacement)
  }

  Set-Content -Path $filePath -Value $text -Encoding UTF8
}

$script:files = $files
$script:nextIdx = 0

Replace-ExternalImagesInFile -filePath "d:\MedicalZone_New\index.html"
Replace-ExternalImagesInFile -filePath "d:\MedicalZone_New\store.html"

Write-Output "Done. nextIdx=$script:nextIdx"

