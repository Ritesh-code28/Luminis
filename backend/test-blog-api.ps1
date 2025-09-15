# Echo Backend Blog Testing

# First login to get token
$loginBody = @{
    username = "testuser"
    password = "testpass123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.data.token

Write-Host "Logged in as: $($loginData.data.user.username)"
Write-Host ""

# Test blog creation
$blogBody = @{
    title = "My First Echo Blog Post"
    body = "This is a test blog post to verify that the Echo backend is working correctly. The API should accept this post, filter any inappropriate content, and store it in the MongoDB database. This is a comprehensive test of the blog creation functionality."
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $blogResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/blogs/create" -Method POST -Headers $headers -Body $blogBody
    Write-Host "Blog Creation Status: $($blogResponse.StatusCode)"
    Write-Host "Blog Response: $($blogResponse.Content)"
} catch {
    Write-Host "Blog Creation Error: $($_.Exception.Message)"
}

Write-Host ""

# Test getting all blogs
try {
    $getAllBlogsResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/blogs" -Method GET
    Write-Host "Get All Blogs Status: $($getAllBlogsResponse.StatusCode)"
    $blogsData = $getAllBlogsResponse.Content | ConvertFrom-Json
    Write-Host "Number of blogs found: $($blogsData.data.blogs.Count)"
} catch {
    Write-Host "Get Blogs Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== Blog API Testing Complete ==="