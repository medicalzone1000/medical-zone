$ErrorActionPreference = "Stop"

$src = Join-Path $PSScriptRoot "..\\images\\logo.png"

Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$outBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
$g.Dispose()
$bmp.Dispose()

for ($y = 0; $y -lt $outBmp.Height; $y++) {
  for ($x = 0; $x -lt $outBmp.Width; $x++) {
    $c = $outBmp.GetPixel($x, $y)
    if ($c.R -ge 245 -and $c.G -ge 245 -and $c.B -ge 245) {
      $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $c.R, $c.G, $c.B))
    }
  }
}

$outBmp.Save($src, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()

Write-Output "Updated: $src"

