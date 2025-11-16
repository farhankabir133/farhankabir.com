# PowerShell script to combine all .txt files in the project into one file (all-txt-files-combined.txt)
# and copy copilot-chat-history.txt to a separate export file (copilot-chat-export.txt)

# Get the project root (where this script is located)
$projectRoot = $PSScriptRoot

# 1. Combine all .txt files (except the export files themselves) into one file
$combinedFile = Join-Path $projectRoot 'all-txt-files-combined.txt'
Get-ChildItem -Path $projectRoot -Recurse -Filter *.txt |
  Where-Object { $_.Name -notin @('all-txt-files-combined.txt', 'copilot-chat-export.txt') } |
  ForEach-Object {
    Add-Content -Path $combinedFile -Value ("`n--- $($_.FullName) ---`n")
    Get-Content $_.FullName | Add-Content -Path $combinedFile
  }

# 2. Copy copilot-chat-history.txt to copilot-chat-export.txt
$chatHistory = Join-Path $projectRoot 'copilot-chat-history.txt'
$chatExport = Join-Path $projectRoot 'copilot-chat-export.txt'
if (Test-Path $chatHistory) {
  Copy-Item $chatHistory $chatExport -Force
  Write-Host "copilot-chat-history.txt exported to copilot-chat-export.txt."
}

Write-Host "All .txt files combined into all-txt-files-combined.txt."
