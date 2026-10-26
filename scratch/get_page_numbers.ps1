$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("d:\Smart waste management\scratch\test_doc.docx")
$pages = $doc.ComputeStatistics([Microsoft.Office.Interop.Word.WdStatistic]::wdStatisticPages)
Write-Host "Total Pages: $pages"

# Let's search for key headings and get their page numbers
$headings = @(
    "ECOCLEAN: SMART WASTE REPORTING",
    "CERTIFICATE",
    "Acknowledgements",
    "ABSTRACT",
    "CONTENTS",
    "INTRODUCTION",
    "SYSTEM ANALYSIS",
    "FEASIBILITY STUDY",
    "SOFTWARE ENGINEERING PARADIGM",
    "SYSTEM REQUIREMENTS SPECIFICATION",
    "SYSTEM DESIGN",
    "SYSTEM DEVELOPMENT",
    "SYSTEM TESTING AND IMPLEMENTATION",
    "SYSTEM MAINTENANCE",
    "FUTURE ENHANCEMENT",
    "CONCLUSION",
    "APPENDIX",
    "BIBLIOGRAPHY"
)

foreach ($h in $headings) {
    $range = $doc.Content
    $find = $range.Find
    $find.Text = $h
    $find.Forward = $true
    if ($find.Execute()) {
        $pageNum = $range.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndPageNumber)
        Write-Host "$h -> Page $pageNum"
    } else {
        Write-Host "$h -> Not Found"
    }
}

$doc.Close($false)
$word.Quit()
