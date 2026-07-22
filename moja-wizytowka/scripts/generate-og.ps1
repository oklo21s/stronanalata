Add-Type -AssemblyName System.Drawing

$outputPath = Join-Path $PSScriptRoot '..\public\assets\og-card.png'
$bitmap = New-Object System.Drawing.Bitmap 1200, 630
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function New-RoundedRectanglePath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $diameter = $Radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

$background = [System.Drawing.Color]::FromArgb(250, 249, 246)
$ink = [System.Drawing.Color]::FromArgb(21, 22, 26)
$softInk = [System.Drawing.Color]::FromArgb(58, 63, 74)
$muted = [System.Drawing.Color]::FromArgb(107, 113, 128)
$accent = [System.Drawing.Color]::FromArgb(255, 122, 13)
$accentDark = [System.Drawing.Color]::FromArgb(138, 61, 0)
$border = [System.Drawing.Color]::FromArgb(216, 210, 196)
$white = [System.Drawing.Color]::White

$graphics.Clear($background)
$graphics.FillRectangle((New-Object System.Drawing.SolidBrush $accent), 0, 0, 28, 630)

$eyebrowFont = New-Object System.Drawing.Font 'Consolas', 16, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$nameFont = New-Object System.Drawing.Font 'Segoe UI', 78, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$taglineFont = New-Object System.Drawing.Font 'Segoe UI', 28, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
$locationFont = New-Object System.Drawing.Font 'Consolas', 18, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)

$graphics.DrawString('// STRONY INTERNETOWE', $eyebrowFont, (New-Object System.Drawing.SolidBrush $accentDark), 95, 118)
$firstName = 'Miko' + [char]0x0142 + 'aj'
$graphics.DrawString($firstName, $nameFont, (New-Object System.Drawing.SolidBrush $ink), 88, 180)
$graphics.DrawString('Oczkowski', $nameFont, (New-Object System.Drawing.SolidBrush $accent), 88, 265)
$tagline = 'Projekt  /  tre' + [char]0x015B + [char]0x0107 + '  /  kod'
$graphics.DrawString($tagline, $taglineFont, (New-Object System.Drawing.SolidBrush $softInk), 95, 404)
$graphics.DrawString('KOZIENICE  /  LOKALNIE I ZDALNIE', $locationFont, (New-Object System.Drawing.SolidBrush $muted), 95, 505)

$screenPath = New-RoundedRectanglePath -X 765 -Y 132 -Width 350 -Height 263 -Radius 20
$graphics.FillPath((New-Object System.Drawing.SolidBrush $white), $screenPath)
$graphics.DrawPath((New-Object System.Drawing.Pen $ink, 8), $screenPath)
$graphics.DrawLine((New-Object System.Drawing.Pen $ink, 8), 765, 180, 1115, 180)
$graphics.FillEllipse((New-Object System.Drawing.SolidBrush $accent), 784, 149, 14, 14)
$graphics.FillEllipse((New-Object System.Drawing.SolidBrush $border), 807, 149, 14, 14)
$graphics.FillEllipse((New-Object System.Drawing.SolidBrush $border), 830, 149, 14, 14)

$pillPath = New-RoundedRectanglePath -X 796 -Y 214 -Width 149 -Height 20 -Radius 10
$graphics.FillPath((New-Object System.Drawing.SolidBrush $accent), $pillPath)
$linePen = New-Object System.Drawing.Pen $ink, 11
$linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($linePen, 796, 266, 1010, 266)
$graphics.DrawLine($linePen, 796, 293, 970, 293)
$graphics.DrawLine($linePen, 796, 320, 989, 320)

$buttonPath = New-RoundedRectanglePath -X 796 -Y 345 -Width 116 -Height 34 -Radius 17
$graphics.FillPath((New-Object System.Drawing.SolidBrush $ink), $buttonPath)

$basePoints = @(
  (New-Object System.Drawing.Point 737, 395),
  (New-Object System.Drawing.Point 1143, 395),
  (New-Object System.Drawing.Point 1114, 441),
  (New-Object System.Drawing.Point 770, 441)
)
$graphics.FillPolygon((New-Object System.Drawing.SolidBrush $white), $basePoints)
$graphics.DrawPolygon((New-Object System.Drawing.Pen $ink, 8), $basePoints)

$graphics.Dispose()
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()

Write-Output "Wygenerowano $outputPath (1200 x 630)."
