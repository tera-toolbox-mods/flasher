const DefaultSettings = {
    "instanceMatching": true,
    "worldBoss": true,
    "whisper": true,
    "lfgApplication": true,
    "enterCombat": true,
    "partySummon": true,
    "gbam": true,
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        throw new Error('So far there is only one settings version and this should never be reached!');
    }
}
