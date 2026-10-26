$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $docxPath = "C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
    $pdfPath = "C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.pdf"
    $doc = $word.Documents.Open($docxPath, $false, $true)
    $doc.Fields.Update()
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close()
    Write-Host "PDF generated successfully at $pdfPath"
} catch {
    Write-Host "Error converting to PDF: $_"
} finally {
    $word.Quit()
}
