const SettingsUI = require('tera-mod-ui').Settings;

module.exports = function Flasher(mod) {
    if(mod.proxyAuthor !== 'caali' || !global.TeraProxy) {
        mod.warn('You are trying to use Flasher on an unsupported legacy version of tera-proxy.');
        mod.warn('The module may not work as expected, and even if it works for now, it may break at any point in the future!');
        mod.warn('It is highly recommended that you download the latest official version from the #proxy channel in https://discord.gg/dUNDDtw');
    }

    // Hooks (thanks to Foglio/Risenio for some of these)
    mod.hook('S_FIN_INTER_PARTY_MATCH', 'raw', _ => {
        if(mod.settings.instanceMatching)
            mod.clientInterface.flashWindow();
    });
    mod.hook('S_BATTLE_FIELD_ENTRANCE_INFO', 'raw', _ => {
        if(mod.settings.instanceMatching)
            mod.clientInterface.flashWindow();
    });
    
    mod.hook('S_WHISPER', 'raw', _ => {
        if(mod.settings.whisper)
            mod.clientInterface.flashWindow();
    });
    
    mod.hook('S_OTHER_USER_APPLY_PARTY', 'raw', _ => {
        if(mod.settings.lfgApplication)
            mod.clientInterface.flashWindow();
    });
    
    mod.hook('S_ASK_TELEPORT', 'raw', _ => {
        if(mod.settings.partySummon)
            mod.clientInterface.flashWindow();
    });
    
    mod.hook('S_NOTIFY_GUILD_QUEST_URGENT', 'raw', _ => {
        if(mod.settings.gbam)
            mod.clientInterface.flashWindow();
    });

    mod.hook('S_SYSTEM_MESSAGE', 1, event => {
        const msg = mod.parseSystemMessage(event.message);
        switch(msg.id)
        {
            case 'SMT_FIELDBOSS_APPEAR':
            {
                if(mod.settings.worldBoss)
                    mod.clientInterface.flashWindow();
                break;
            }
        }
    });
    
    mod.game.me.on('enter_combat', () => {
        if(mod.settings.enterCombat)
            mod.clientInterface.flashWindow();
    });

    // Commands
    const PURPOSES = ['instanceMatching', 'worldBoss', 'whisper', 'lfgApplication', 'partySummon', 'enterCombat', 'gbam'];
    mod.command.add('flasher', {
        $default(purpose) {
            if (PURPOSES.indexOf(purpose) < 0) {
                if (ui) {
                    ui.show();
                } else {
                    mod.command.message(purpose ? `Invalid mode: ${purpose}!` : 'Must specify mode!');
                    mod.command.message(`Valid modes: ${PURPOSES.join(', ')}`);
                }

                return;
            }

            if (mod.settings[purpose])
                mod.command.message(`${purpose} disabled!`);
            else
                mod.command.message(`${purpose} enabled!`);
            mod.settings[purpose] = !mod.settings[purpose];
        }
    });

    // Settings UI
    let ui = null;
    if (global.TeraProxy.GUIMode) {
        ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 295 });
        ui.on('update', settings => mod.settings = settings);

        this.destructor = () => {
            if (ui) {
                ui.close();
                ui = null;
            }
        };
    }
}
