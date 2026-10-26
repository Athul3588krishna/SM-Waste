$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("d:\Smart waste management\scratch\test_doc.docx")
$pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
Write-Host "Total Pages: $pages"

for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
    $p = $doc.Paragraphs.Item($i)
    $t = $p.Range.Text.Trim()
    if ($t.Length -gt 0 -and $t.Length -lt 50) {
        $bold = $p.Range.Font.Bold
        if ($bold -ne 0) {
            $page = $p.Range.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndPageNumber)
            if ($t -match "INTRODUCTION|SYSTEM ANALYSIS|FEASIBILITY|SOFTWARE ENGINEERING|SYSTEM REQUIRE|SYSTEM DESIGN|SYSTEM DEVELOPMENT|SYSTEM TESTING|SYSTEM MAINTENANCE|FUTURE ENHANCEMENT|CONCLUSION|APPENDIX|BIBLIOGRAPHY|CERTIFICATE|Acknowledgements|ABSTRACT|CONTENTS") {
                Write-Host "P$i [Page $page]: $t"
            }
        }
    }
}

$doc.Close($false)
$word.Quit()
