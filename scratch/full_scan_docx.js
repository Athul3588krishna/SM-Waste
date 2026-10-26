const fs = require('fs');

const script = `
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Full-Scan-Docx($path) {
    Write-Host "================== SCANNING: $path =================="
    if (-not (Test-Path $path)) { return }
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
        $pIdx = 0
        foreach ($p in $paragraphs) {
            $t = $p.InnerText
            if ($t -match "(?i)bot|telegram|suvarna") {
                Write-Host "P[$pIdx]: $t`n"
            }
            $pIdx++
        }

        $tables = $xml.SelectNodes("//w:tbl", $nsManager)
        $tIdx = 0
        foreach ($tbl in $tables) {
            $tText = $tbl.InnerText
            if ($tText -match "(?i)bot|telegram|suvarna") {
                Write-Host "TBL[$tIdx]: $tText`n"
            }
            $tIdx++
        }
    }
    $zip.Dispose()
}

Full-Scan-Docx "EcoClean_Project_Report.docx"
Full-Scan-Docx "EcoClean_Project_Report_Final.docx"
`;

fs.writeFileSync('scratch/full_scan_docx.ps1', script);
