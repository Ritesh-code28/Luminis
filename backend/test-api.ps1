# Echo Backend API Testing

## Health Check
$healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET
Write-Host "Health Check Status: $($healthResponse.StatusCode)"
Write-Host "Health Response: $($healthResponse.Content)"
Write-Host ""

## Test Login with testuser
$loginBody = @{
    username = "testuser"
    password = "testpass123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login Status: $($loginResponse.StatusCode)"
    Write-Host "Login Response: $($loginResponse.Content)"
    
    # Extract token for further tests
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.data.token
    Write-Host "Extracted Token: $($token.Substring(0, 20))..."
    
} catch {
    Write-Host "Login Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== API Testing Complete ==="