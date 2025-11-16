# PowerShell script to save clipboard contents to copilot-chat-history.txt
$historyFile = Join-Path $PSScriptRoot 'copilot-chat-history.txt'

# Get clipboard contents
$clipboard = Get-Clipboard

# Append clipboard contents and separator to the file
Add-Content -Path $historyFile -Value $clipboard
Add-Content -Path $historyFile -Value "---"

# Print confirmation message
Write-Host "Clipboard contents saved to $historyFile with separator."
