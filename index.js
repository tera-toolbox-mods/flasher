const SettingsUI = require('tera-mod-ui').Settings;

module.exports = function Flasher(mod) {
    if(mod.proxyAuthor !== 'caali' || !global.TeraProxy) {
        mod.warn('You are trying to use Flasher on an unsupported legacy version of tera-proxy.');
        mod.warn('The module may not work as expected, and even if it works for now, it may break at any point in the future!');
        mod.warn('It is highly recommended that you download the latest official version from the #proxy channel in https://discord.gg/dUNDDtw');
    }

    // Hooks
    mod.hook('S_FIN_INTER_PARTY_MATCH', 'raw', _ => {
        if(mod.settings.instanceMatching)
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

    // Commands
    const PURPOSES = ['instanceMatching', 'worldBoss'];
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
        ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 232 });
        ui.on('update', settings => mod.settings = settings);

        this.destructor = () => {
            if (ui) {
                ui.close();
                ui = null;
            }
        };
    }
}
