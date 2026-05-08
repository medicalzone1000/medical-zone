$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot "..\\images\\logo.png"))

$w = $bmp.Width
$h = $bmp.Height
$total = 0
$transparent = 0

for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $total++
    if ($bmp.GetPixel($x, $y).A -eq 0) { $transparent++ }
  }
}

$bmp.Dispose()

$ratio = [Math]::Round($transparent / $total, 4)
Write-Output "transparent_ratio=$ratio size=${w}x${h}"

