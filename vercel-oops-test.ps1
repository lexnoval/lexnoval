param(
  [Parameter(Mandatory=$true)][string]$Domain,
  [Parameter(Mandatory=$true)][string]$BypassSecret,
  [int]$Burst = 8
)

$uri = "https://$Domain/api/oops"
$headers = @{ "x-vercel-protection-bypass" = $BypassSecret }

function Call($url) {
  try {
    $r = Invoke-WebRequest -Uri $url -Headers $headers -Method GET -ErrorAction Stop
    Write-Host ("{0} {1}" -f [int]$r.StatusCode, $r.StatusDescription)
    if ($r.Headers["X-RateLimit-Remaining"]) {
      Write-Host ("X-RateLimit-Remaining: {0}" -f $r.Headers["X-RateLimit-Remaining"])
      Write-Host ("X-RateLimit-Reset: {0}" -f $r.Headers["X-RateLimit-Reset"])
    }
  } catch {
    $resp = $_.Exception.Response
    if ($resp -ne $null) {
      $status = [int]$resp.StatusCode
      Write-Host ("ERROR {0} {1}" -f $status, $resp.StatusDescription) -ForegroundColor Red
      $rh = $resp.Headers
      if ($rh["X-RateLimit-Remaining"]) {
        Write-Host ("X-RateLimit-Remaining: {0}" -f $rh["X-RateLimit-Remaining"])
        Write-Host ("X-RateLimit-Reset: {0}" -f $rh["X-RateLimit-Reset"])
      }
    } else {
      Write-Host $_ -ForegroundColor Red
    }
  }
}

Write-Host "1) Forcing error..."
$forceUrl = "{0}?force=1" -f $uri
Call($forceUrl)


Write-Host "2) Hitting rate-limit ($Burst requests)..."
for ($i=1; $i -le $Burst; $i++) {
  Call($uri)
  Start-Sleep -Milliseconds 250
}
