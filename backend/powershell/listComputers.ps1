param (
    [string]$DomainController,
    [string]$Username,
    [SecureString]$Password
)

# Suppress warning output
$ErrorActionPreference = "Stop"

$searchPaths = @(
    "LDAP://OU=Workstations,OU=Computers,OU=MyBusiness,DC=hireseng,DC=com",
    "LDAP://OU=Computers,DC=hireseng,DC=com"
)

$computers = @()

foreach ($path in $searchPaths) {
    try {
        $searcher = New-Object DirectoryServices.DirectorySearcher
        $searcher.SearchRoot = New-Object DirectoryServices.DirectoryEntry($path, $Username, $Password)
        $searcher.Filter = "(objectClass=computer)"
        $searcher.PageSize = 1000
        $results = $searcher.FindAll()

        foreach ($result in $results) {
            $entry = $result.GetDirectoryEntry()
            $computers += [PSCustomObject]@{
                Name        = $entry.Name -replace '^CN=', ''
                OS          = $entry.Properties["operatingSystem"] | Select-Object -First 1
                Description = $entry.Properties["description"] | Select-Object -First 1
            }
        }
    } catch {
        # Output to stderr, not stdout
        Write-Error "Failed to search in path $path - $($_.Exception.Message)"
    }
}

# Output JSON only
$computers | ConvertTo-Json -Compress -Depth 3
