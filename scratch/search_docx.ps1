Add-Type -AssemblyName System.IO.Compression.FileSystem

Get-ChildItem -Path "d:\Smart waste management" -Filter "*.docx" | ForEach-Object {
    $docxPath = $_.FullName
    $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        Write-Host "Checking file: $docxPath"
        if ($content -match "(?i)suvarna") {
            Write-Host ">>> FOUND 'suvarna' in $docxPath"
            $matches = [regex]::Matches($content, '.{0,60}(?i:suvarna).{0,60}')
            foreach ($m in $matches) {
                Write-Host "    Match: $($m.Value)"
            }
        }
        if ($content -match "(?i)suvarnabot") {
            Write-Host ">>> FOUND 'suvarnabot' in $docxPath"
        }
        if ($content -match "(?i)bot") {
            Write-Host ">>> FOUND 'bot' in $docxPath"
            $matches = [regex]::Matches($content, '.{0,40}(?i:bot).{0,40}')
            foreach ($m in $matches) {
                Write-Host "    Bot Match: $($m.Value)"
            }
        }
    }
    $zip.Dispose()
}
