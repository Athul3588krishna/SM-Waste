const fs = require('fs');
const path = require('path');

const script = `
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Check-File($path) {
    if (-not (Test-Path $path)) { return }
    $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $path))
    foreach ($entry in $zip.Entries) {
        if ($entry.FullName -match "\.xml$") {
            $stream = $entry.Open()
            $reader = New-Object System.IO.StreamReader($stream)
            $content = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            
            if ($content -match "(?i)suvarna|suvarnabot|telegram|ecobot") {
                Write-Host "FOUND MATCH IN ZIP ENTRY: $($entry.FullName) of $path"
                $matches = [regex]::Matches($content, '.{0,40}(?i:suvarna|suvarnabot|telegram|ecobot).{0,40}')
                foreach ($m in $matches) {
                    Write-Host "   Match: $($m.Value)"
                }
            }
        }
    }
    $zip.Dispose()
}

Get-ChildItem -Path "." -Include "*.docx","*.pptx" -Recurse | ForEach-Object {
    Check-File $_.FullName
}
`;

fs.writeFileSync('scratch/deep_search_zip.ps1', script);
