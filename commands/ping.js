/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Akeno-Md
 * @author : Mnuvq <https://github.com/Mnuvq>
 * @description : Akeno,A Multi-functional whatsapp bot.
 * @version 0.0.6
 **/

//---------------------------------------------------------------------------
const Akeno = require('../lib')
Akeno.cmd({
        pattern: "ping",
        desc: "To check ping",
        category: "general",
    },
    async(Void, citel) => {
        var inital = new Date().getTime();
        await citel.reply('```Ping!!!```');
        var final = new Date().getTime();
        return await citel.reply('*Pong*\n *' + (final - inital) + ' ms* ');
    }
);