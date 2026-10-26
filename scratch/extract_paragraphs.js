const fs = require('fs');

const script = `
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Inspect-Docx($path) {
    Write-Host "================== $path =================="
    if (-not (Test-Path $path)) {
        Write-Host "File not found: $path"
        return
    }
    $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $path))
    $entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $xmlContent = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        [xml]$xml = $xmlContent
        $nsManager = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
        $nsManager.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
        
        $paragraphs = $xml.SelectNodes("//w:p", $nsManager)
        $idx = 0
        foreach ($p in $paragraphs) {
            $text = $p.InnerText
            if ($text -match "(?i)suvarna|bot|telegram|ecobot") {
                Write-Host "P[$idx]: $text"
            }
            $idx++
        }
    }
    $zip.Dispose()
}

Inspect-Docx "EcoClean_Project_Report.docx"
Inspect-Docx "EcoClean_Project_Report_Final.docx"
`;

fs.writeFileSync('scratch/extract_paragraphs.ps1', script);
