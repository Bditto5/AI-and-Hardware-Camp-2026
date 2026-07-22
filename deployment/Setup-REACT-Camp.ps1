[CmdletBinding()]
param(
    [string]$Model = "llama3.2:1b"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$packageDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$appInstaller = Join-Path $packageDirectory "REACT-Camp-Setup.exe"
$bundledOllamaInstaller = Join-Path $packageDirectory "OllamaSetup.exe"
$downloadedOllamaInstaller = Join-Path $env:TEMP "REACT-Camp-OllamaSetup.exe"
$ollamaDownloadUrl = "https://ollama.com/download/OllamaSetup.exe"

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Find-Ollama {
    $command = Get-Command "ollama.exe" -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }

    $knownPath = Join-Path $env:LOCALAPPDATA "Programs\Ollama\ollama.exe"
    if (Test-Path -LiteralPath $knownPath) { return $knownPath }
    return $null
}

function Wait-ForOllama([int]$Seconds = 90) {
    $deadline = (Get-Date).AddSeconds($Seconds)
    do {
        try {
            $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 3
            if ($response.StatusCode -eq 200) { return $true }
        } catch {
            Start-Sleep -Seconds 2
        }
    } while ((Get-Date) -lt $deadline)
    return $false
}

function Find-ReactCamp {
    $candidates = @(
        (Join-Path $env:LOCALAPPDATA "REACT Camp\REACT Camp.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\REACT Camp\REACT Camp.exe"),
        (Join-Path $env:ProgramFiles "REACT Camp\REACT Camp.exe")
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    return $null
}

try {
    if (-not (Test-Path -LiteralPath $appInstaller)) {
        throw "REACT-Camp-Setup.exe is missing. Keep all classroom setup files together in the same folder."
    }

    Write-Step "Installing REACT Camp"
    $appProcess = Start-Process -FilePath $appInstaller -ArgumentList "/S" -Wait -PassThru
    if ($appProcess.ExitCode -ne 0) {
        throw "The REACT Camp installer exited with code $($appProcess.ExitCode)."
    }

    $ollama = Find-Ollama
    if (-not $ollama) {
        Write-Step "Installing Ollama"
        if (Test-Path -LiteralPath $bundledOllamaInstaller) {
            $ollamaInstaller = $bundledOllamaInstaller
            Write-Host "Using the Ollama installer included in this folder."
        } else {
            $ollamaInstaller = $downloadedOllamaInstaller
            Write-Host "Downloading Ollama from ollama.com..."
            Invoke-WebRequest -UseBasicParsing -Uri $ollamaDownloadUrl -OutFile $ollamaInstaller
        }

        Write-Host "Complete the Ollama installer window if it appears."
        $ollamaProcess = Start-Process -FilePath $ollamaInstaller -Wait -PassThru
        if ($ollamaProcess.ExitCode -ne 0) {
            throw "The Ollama installer exited with code $($ollamaProcess.ExitCode)."
        }
        $ollama = Find-Ollama
    }

    if (-not $ollama) {
        throw "Ollama was installed but ollama.exe could not be found. Sign out of Windows, sign back in, and run setup again."
    }

    if (-not (Wait-ForOllama -Seconds 15)) {
        Write-Step "Starting the local AI service"
        Start-Process -FilePath $ollama -ArgumentList "serve" -WindowStyle Hidden
    }
    if (-not (Wait-ForOllama)) {
        throw "Ollama did not become ready. Open Ollama from the Start menu, then run setup again."
    }

    Write-Step "Downloading the camp AI model: $Model"
    Write-Host "This is the longest step. Keep the laptop connected to the internet and power."
    & $ollama pull $Model
    if ($LASTEXITCODE -ne 0) {
        throw "The model download failed with code $LASTEXITCODE. Check the internet connection and run setup again."
    }

    Write-Step "Verifying the camp AI model"
    $models = & $ollama list
    if ($LASTEXITCODE -ne 0 -or ($models -join "`n") -notmatch [regex]::Escape(($Model -split ":")[0])) {
        throw "Ollama is running, but the $Model model could not be verified."
    }

    Write-Host ""
    Write-Host "READY: REACT Camp, Ollama, and $Model are installed." -ForegroundColor Green
    $reactCamp = Find-ReactCamp
    if ($reactCamp) {
        Write-Host "Opening REACT Camp..."
        Start-Process -FilePath $reactCamp
    } else {
        Write-Host "Open REACT Camp from the Windows Start menu."
    }
    exit 0
} catch {
    Write-Host ""
    Write-Host "SETUP STOPPED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Nothing needs to be removed. Fix the problem and run Setup-REACT-Camp.cmd again."
    exit 1
}

