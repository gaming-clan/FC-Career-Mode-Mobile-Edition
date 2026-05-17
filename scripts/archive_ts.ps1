$files = @(
'nativewind-env.d.ts',
'_core/errors.ts',
'types.ts',
'types.global.d.ts',
'theme.config.d.ts',
'server\_core\env.ts',
'server\_core\context.ts',
'server\storage.ts',
'server\routers.ts',
'server\db.ts',
'lib\_core\validation.ts',
'lib\_core\types.d.ts',
'lib\_core\theme.ts',
'lib\_core\security.ts',
'lib\_core\nativewind-pressable.ts',
'lib\_core\manus-runtime.ts',
'lib\_core\logger.ts',
'lib\_core\auth.ts',
'lib\_core\api.ts',
'lib\_core\api-types.ts',
'lib\utils.ts',
'lib\trpc.ts',
'lib\transfer-market.ts',
'lib\tactical-system.ts',
'lib\staff-management.ts',
'lib\season-progression.ts',
'lib\scouting-system.ts',
'lib\press-media-system.ts',
'lib\player-stats.ts',
'lib\player-development.ts',
'lib\match-simulation.ts',
'lib\match-integration.ts',
'lib\game-simulation.ts',
'lib\game-engine-unified.ts',
'lib\financial-system.ts',
'scripts\validate-engine.ts',
'scripts\seed-database.ts',
'scripts\seed-database-v2.ts',
'scripts\seed-data.ts',
'scripts\comprehensive-seed-data.ts',
'lib\club-squad-management.ts',
'lib\career-storage.ts',
'lib\career-engine.ts',
'lib\board-expectations.ts',
'lib\advanced-tactics.ts',
'hooks\use-colors.ts',
'hooks\use-color-scheme.web.ts',
'hooks\use-color-scheme.ts',
'hooks\use-auth.ts',
'drizzle.config.ts',
'expo-env.d.ts',
'auth.logout.test.ts',
'constants\theme.ts',
'constants\oauth.ts',
'constants\game-modes.ts',
'constants\game-balance.ts',
'constants\const.ts',
'constants\app-constants.ts',
'const.ts',
'drizzle\schema.ts',
'drizzle\relations.ts',
'app.config.ts'
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $target = Join-Path 'archive\typescript-backup' $f
        $targetDir = Split-Path $target -Parent
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
        }
        git mv $f $target -f
        Write-Output "Moved: $f -> $target"
    } else {
        Write-Output "Not found: $f"
    }
}

git add -A
if (git commit -m 'chore(repo): archive TypeScript sources before full Flutter migration') {
    Write-Output "Committed archive"
} else {
    Write-Output "No changes to commit"
}

git push origin flutter-migration-complete
