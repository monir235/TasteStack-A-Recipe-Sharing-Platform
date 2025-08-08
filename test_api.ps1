# PowerShell script to test the registration API

$apiUrl = "http://localhost:8000/api/auth/register/"
$testData = @{
    username = "newtestuser" + (Get-Random -Maximum 1000)
    email = "newtest" + (Get-Random -Maximum 1000) + "@example.com"
    password = "testpassword123"
    password_confirm = "testpassword123"
} | ConvertTo-Json

Write-Host "Testing registration API..."
Write-Host "URL: $apiUrl"
Write-Host "Data: $testData"

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Body $testData -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
}
catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
        $reader.Close()
    }
}
