$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("d:\Smart waste management\scratch\test_doc.docx")
$pdfPath = "d:\Smart waste management\scratch\test_doc.pdf"
$doc.ExportAsFixedFormat($pdfPath, 17) # 17 = wdExportFormatPDF
$doc.Close($false)
$word.Quit()
Write-Host "Exported to PDF successfully!"
