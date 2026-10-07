& {
    $ErrorActionPreference = 'Stop'
    $zip = Join-Path $env:USERPROFILE 'Downloads\ALLNEEDS-Tourisme-detaille-v2.zip'
    if (-not (Test-Path -LiteralPath $zip)) { throw "Télécharge ALLNEEDS-Tourisme-detaille-v2.zip dans Downloads." }
    $destination = Join-Path $env:USERPROFILE ('Desktop\ALLNEEDS-Tourisme-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
    Expand-Archive -LiteralPath $zip -DestinationPath $destination
    Set-Location -LiteralPath (Join-Path $destination 'ALLNEEDS-SaaS')
    $version = [version]((node --version).TrimStart('v').Split('-')[0])
    if ($LASTEXITCODE -ne 0 -or $version -lt [version]'22.12.0') { throw 'Installe Node.js 22.12+ ou 24 puis relance ce script.' }
    npm install
    if ($LASTEXITCODE -ne 0) { throw 'Installation échouée : arrêt.' }
    npm run typecheck
    if ($LASTEXITCODE -ne 0) { throw 'Typecheck échoué : arrêt.' }
    npm run test:saas
    if ($LASTEXITCODE -ne 0) { throw 'Contrôles métier échoués : arrêt.' }
    npm run test:tourisme
    if ($LASTEXITCODE -ne 0) { throw 'Contrôles Tourisme échoués : arrêt.' }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Build échoué : arrêt.' }
    npm run dev
}
