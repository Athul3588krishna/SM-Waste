$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open("d:\Smart waste management\scratch\test_doc.docx")
    $headings = @(
        "INTRODUCTION",
        "SYSTEM ANALYSIS",
        "FEASIBILITY STUDY",
        "SOFTWARE ENGINEERING PARADIGM",
        "SYSTEM REQUIREMENT SPECIFICATION",
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
        $r = $doc.Content
        $find = $r.Find
        $find.ClearFormatting()
        $find.Text = $h
        $find.Forward = $true
        $find.Wrap = 0 # wdFindStop
        if ($find.Execute()) {
            # Find the 16pt chapter heading
            $page = $r.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndPageNumber)
            Write-Host "$h -> Page $page"
        }
    }
    $doc.Close($false)
} finally {
    $word.Quit()
}
