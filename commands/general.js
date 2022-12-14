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

const { tlang, botpic,cmd, prefix, runtime,Config } = require('../lib')
const axios = require('axios')
const speed = require('performance-now')
//---------------------------------------------------------------------------
cmd({
        pattern: "chat",
        desc: "chat with an AI",
        category: "general",
        use: '<Hii,Akeno>',
    },
    async(Void, citel,text) => {
        let zx = text.length;
        let fetchk = require("node-fetch");
        if (zx < 30) {
            let {data} = await fetchk(`http://api.brainshop.ai/get?bid=170434&key=FrCpqU3jDT1i4KG7&uid=[${citel.sender.split("@")[0]}]&msg=[${text}]`);
            return citel.reply(data.cnt);  
        }
        if (!text) return citel.reply(`Hey there! ${citel.pushName}. How are you doing these days?`);
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: Config.OPENAI_API_KEY || "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",
        });
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: text,
            temperature: 0.5,
            max_tokens: 80,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ['"""'],
        });
        citel.reply(completion.data.choices[0].text);
    }
)
//---------------------------------------------------------------------------
cmd({
        pattern: "status",
        alias: ["about"],
        desc: "To check bot status",
        category: "general",
    },
    async(Void, citel) => {
        const dbut = [{
                buttonId: `${prefix}help`,
                buttonText: {
                    displayText: "Menu",
                },
                type: 1,
            },

            {
                buttonId: `${prefix}rank`,
                buttonText: {
                    displayText: "Rank",
                },
                type: 1,
            },
        ];
        const uptime = process.uptime();
        timestampe = speed();
        latensie = speed() - timestampe;
        let ter = `
???? *${tlang().title}* ????
*????Description:* A WhatsApp bot with rich features, build in NodeJs to make your WhatsApp enjoyable.
*???Speed:* ${latensie.toFixed(4)} ms
*????Uptime:* ${runtime(process.uptime())}
*????Version:* 1.0.0
*????Owner:*  ${Config.ownername}
*Powered by ${tlang().title}*
`;
        let buttonMessaged = {
            image: {
                url: await botpic(),
            },
            caption: ter,
            footer: tlang().footer,
            buttons: dbut,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: tlang().title,
                    body: `Bot-Status`,
                    thumbnail: log0,
                    mediaType: 2,
                    mediaUrl: ``,
                    sourceUrl: ``,
                },
            },
        };
        return await Void.sendMessage(citel.chat, buttonMessaged, {
            quoted: citel,
        });

    }
)
