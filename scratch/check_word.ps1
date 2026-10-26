$w = New-Object -ComObject Word.Application
Write-Host "Word Version: $($w.Version)"
$w.Quit()
