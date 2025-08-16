# Save as: Show-RepoTree.ps1
param(
    [string]$Path = ".",
    [int]$MaxDepth = 2,
    [string]$OutFile = "repo_tree.txt",
    [string[]]$Exclude = @(
        ".git","node_modules","dist","build","venv","env",".env","__pycache__",
        ".next",".turbo","coverage",".cache",".pytest_cache",".idea",".vscode",".DS_Store"
    )
)

function Test-IsExcluded {
    param([string]$FullPath)
    $segments = ($FullPath -replace '\\','/').Split('/') | Where-Object { $_ -ne "" }
    foreach ($seg in $segments) {
        if ($Exclude -contains $seg) { return $true }
    }
    return $false
}

function Print-Tree {
    param(
        [string]$Dir,
        [int]$Depth,
        [string]$Prefix
    )
    if ($Depth -ge $MaxDepth) { return }

    $children = Get-ChildItem -LiteralPath $Dir -Force | Where-Object { -not (Test-IsExcluded $_.FullName) } | Sort-Object { $_.PSIsContainer }, Name
    $count = $children.Count
    for ($i = 0; $i -lt $count; $i++) {
        $child = $children[$i]
        $isLast = ($i -eq $count - 1)

        if ($isLast) { $connector = "+--" } else { $connector = "|--" }

        if ($child.PSIsContainer) {
            $line = "{0}{1} {2}/" -f $Prefix, $connector, $child.Name
            $line
            if ($isLast) { $newPrefix = $Prefix + "   " } else { $newPrefix = $Prefix + "|  " }
            Print-Tree -Dir $child.FullName -Depth ($Depth + 1) -Prefix $newPrefix
        } else {
            if ($Depth + 1 -le $MaxDepth) {
                "{0}{1} {2}" -f $Prefix, $connector, $child.Name
            }
        }
    }
}

$root = Resolve-Path -LiteralPath $Path
$header = "Repository tree for: $root (max depth: $MaxDepth)`n"
$rootName = Split-Path -Leaf $root
$output = New-Object System.Collections.Generic.List[string]
$output.Add($header)
$output.Add("$rootName/")

Print-Tree -Dir $root -Depth 0 -Prefix "" | ForEach-Object { $output.Add($_) }

$output | Tee-Object -FilePath (Join-Path $root $OutFile)

"`nWrote tree to: $(Join-Path $root $OutFile)"
"`nNext: please paste the contents of '$OutFile' here."
