$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("d:\Smart waste management\scratch\test_doc.docx")

$targets = @(
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

foreach ($t in $targets) {
    $r = $doc.Content
    $r.Find.ClearFormatting()
    $r.Find.Text = $t
    $r.Find.Forward = $true
    $r.Find.Wrap = 0 # wdFindStop
    $r.Find.MatchWholeWord = $false
    # We want the chapter heading which is 16pt or 26pt bold
    while ($r.Find.Execute()) {
        if ($r.Font.Bold -ne 0) {
            $p = $r.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndPageNumber)
            Write-Host "$t -> Page $p"
            break
        }
    }
}

$doc.Close($false)
$word.Quit()
