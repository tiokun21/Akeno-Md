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

const { tlang, getAdmin, prefix, Config, sck, fetchJson, runtime,cmd } = require('../lib')
let { dBinary, eBinary } = require("../lib/binary");
const fs = require('fs')
const axios = require('axios')
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
//---------------------------------------------------------------------------
cmd({
            pattern: "attp",
            desc: "Makes glowing sticker of text.",
            category: "sticker",
        },
        async(Void, citel, text) => {
            Void.sendMessage(citel.chat, {
                sticker: {
                    url: `https://api.xteam.xyz/attp?file&text=${encodeURI(text)}`
                }
            }, {
                quoted: citel
            })

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "exec",
            desc: "Evaluates quoted code with given language.",
            category: "misc",
        },
        async(Void, citel, text) => {
            try {
                const code = {
                    script: citel.quoted.text,
                    language: text[1],
                    versionIndex: "0",
                    stdin: text.slice(2).join(" "),
                    clientId: '694805244d4f825fc02a9d6260a54a99',
                    clientSecret: '741b8b6a57446508285bb5893f106df3e20f1226fa3858a1f2aba813799d4734'
                };
                request({
                    url: "https://api.jdoodle.com/v1/execute",
                    method: "POST",
                    json: code
                }, function(_error, _response, body) {
                    citel.reply("> " + text[1] + "\n\n" + "```" + body.output + "```");
                });
            } catch (error) {
                console.log(error);
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "readmore",
            desc: "Adds *readmore* in given text.",
            category: "misc",
        },
        async(Void, citel, text) => {
            await citel.reply(text.replace(/\+/g, (String.fromCharCode(8206)).repeat(4001)))

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "steal",
            desc: "Makes sticker of replied image/video.",
            category: "sticker",
        },
        async(Void, citel, text) => {
            if (!citel.quoted) return citel.reply(`*Mention any Image or video Sir.*`);
            let mime = citel.quoted.mtype
            if (text) {
                anu = text
                    .split("|");
                pack = anu[0] !== "" ? anu[0] : citel.pushName + '♥️';
                author = anu[1] !== "" ? anu[1] : Config.author;
            } else {
                pack = citel.pushName;
                author = "♥️";
            }
            if (citel.quoted) {
                let media = await citel.quoted.download();
                citel.reply("*Processing Your request*");
                let sticker = new Sticker(media, {
                    pack: pack, // The pack name
                    author: author, // The author name
                    type: StickerTypes.FULL, // The sticker type
                    categories: ["🤩", "🎉"], // The sticker category
                    id: "12345", // The sticker id
                    quality: 75, // The quality of the output file
                    background: "transparent", // The sticker background color (only for full stickers)
                });
                const buffer = await sticker.toBuffer();
                Void.sendMessage(citel.chat, {
                    sticker: buffer,
                }, {
                    quoted: citel,
                });
            } else if (/video/.test(mime)) {
                if ((quoted.msg || quoted)
                    .seconds > 20) return citel.reply("Cannot fetch videos longer than *20 Seconds*");
                let media = await quoted.download();
                let sticker = new Sticker(media, {
                    pack: pack, // The pack name
                    author: author, // The author name
                    type: StickerTypes.FULL, // The sticker type
                    categories: ["🤩", "🎉"], // The sticker category
                    id: "12345", // The sticker id
                    quality: 70, // The quality of the output file
                    background: "transparent", // The sticker background color (only for full stickers)
                });
                const stikk = await sticker.toBuffer();
                Void.sendMessage(citel.chat, {
                    sticker: stikk,
                }, {
                    quoted: citel,
                });
            } else {
                citel.reply("*Uhh,Please reply to any image or video*");
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "uptime",
            desc: "Tells runtime/uptime of bot.",
            category: "misc",
        },
        async(Void, citel, text) => {
            const upt = runtime(process.uptime())
            citel.reply(`Uptime of ${tlang().title}: ${upt}`)
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "wm",
            desc: "Makes wa me of quoted or mentioned user.",
            category: "misc",
        },
        async(Void, citel, text) => {
            let users = citel.mentionedJid ? citel.mentionedJid[0].split('@')[0] : citel.quoted ? citel.quoted.sender.split('@')[0] : text.replace('@')[0]
            citel.reply(`https://wa.me/${users}`)

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "pick",
            desc: "Pics random user from Group",
            category: "misc",
        },
        async(Void, citel, match) => {
            if (!match) return citel.reply("*Which type of User you want?*");
            const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat)
                .catch((e) => {}) : "";
            const participants = citel.isGroup ? await groupMetadata.participants : "";
            let member = participants.map((u) => u.id);
            let me = citel.sender;
            let pick = member[Math.floor(Math.random() * member.length)];
            Void.sendMessage(citel.chat, {
                text: `The most ${match} around us is *@${pick.split("@")[0]}*`,
                mentions: [pick],
            }, {
                quoted: citel,
            });
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "nsfw",
            desc: "activates and deactivates nsfw.\nuse buttons to toggle.",
            category: "misc",
        },
        async(Void, citel, text) => {
            if (!citel.isGroup) return citel.reply(tlang().group);
            const groupAdmins = await getAdmin(Void, citel)
            const botNumber = await Void.decodeJid(Void.user.id)
            const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
            const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
            if (!isAdmins) return citel.reply(tlang().admin)
            if (!isBotAdmins) return citel.reply(tlang().botadmin)
            let buttons = [{
                    buttonId: `${prefix}act nsfw`,
                    buttonText: {
                        displayText: "Turn On",
                    },
                    type: 1,
                },
                {
                    buttonId: `${prefix}deact nsfw`,
                    buttonText: {
                        displayText: "Turn Off",
                    },
                    type: 1,
                },
            ];
            await Void.sendButtonText(citel.chat, buttons, `Activate nsfw:18+ commands`, Void.user.name, citel);
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "npm",
            desc: "download mp4 from url.",
            category: "search",
            use: '<package name>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply('Please give me package name.📦')
            axios.get(`https://api.npms.io/v2/search?q=${text}`).then(({ data }) => {
                let txt = data.results.map(({ package: pkg }) => `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}_`).join('\n\n')
                citel.reply(txt)
            }).catch(e => console.log(e))
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "fliptext",
            desc: "Flips given text.",
            category: "misc",
            use: '<query>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply(`Example : ${prefix}fliptext Back in black`)
            flipe = text.split('').reverse().join('')
            citel.reply(`\`\`\`「  Text Flipper Tool  」\`\`\`\n*IGiven text :*\n${text}\n*Fliped text :*\n${flipe}`)

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "mp4fromurl",
            desc: "download mp4 from url.",
            category: "misc",
            use: '<url>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply(`Where's the link ?`);
            Void.sendMessage(citel.chat, {
                video: {
                    url: text.split(" ")[0],
                },
                caption: "*HERE WE GO*",
                contextInfo: {
                    externalAdReply: {
                        title: tlang().title,
                        body: `${citel.pushName}`,
                        thumbnail: log0,
                        mediaType: 2,
                        mediaUrl: ``,
                        sourceUrl: ``,
                    },
                },
            }, {
                quoted: citel,
            });

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "events",
            desc: "activates and deactivates events.\nuse buttons to toggle.",
            category: "misc",
        },
        async(Void, citel, text) => {
            if (!citel.isGroup) return citel.reply(tlang().group);
            const groupAdmins = await getAdmin(Void, citel)
            const botNumber = await Void.decodeJid(Void.user.id)
            const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
            const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
            if (!isAdmins) return citel.reply(tlang().admin)
            if (!isBotAdmins) return citel.reply(tlang().botadmin)
            let buttons = [{
                    buttonId: `${prefix}act events`,
                    buttonText: {
                        displayText: "Turn On",
                    },
                    type: 1,
                },
                {
                    buttonId: `${prefix}deact events`,
                    buttonText: {
                        displayText: "Turn Off",
                    },
                    type: 1,
                },
            ];
            await Void.sendButtonText(citel.chat, buttons, `Activate Events:Welcome & goodbye`, Void.user.name, citel);
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "emix",
            desc: "Mixes two emojies.",
            category: "misc",
            use: '<query>',
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!text) return citel.reply(`Example : ${prefix}emix 😅,🤔`);
            let [emoji1, emoji2] = text.split `,`;
            let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1 )}_${encodeURIComponent(emoji2)}`);
            for (let res of anu.results) {
                let encmedia = await Void.sendImageAsSticker(citel.chat, res.url, citel, {
                    packname: global.packname,
                    author: global.author,
                    categories: res.tags,
                });
                await fs.unlinkSync(encmedia);
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "chatbot",
            desc: "activates and deactivates chatbot.\nuse buttons to toggle.",
            category: "misc",
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return citel.reply(tlang().owner)
            switch (text.split(" ")[0]) {
                case "on":
                    {
                        if (!isCreator) return citel.reply(tlang().owner)
                        const Heroku = require("heroku-client");
                        const heroku = new Heroku({
                            token: Config.HEROKU.API_KEY,
                        });
                        let baseURI = "/apps/" + Config.HEROKU.APP_NAME;
                        await heroku.patch(baseURI + "/config-vars", {
                            body: {
                                ["CHATBOT"]: 'true',
                            },
                        });
                        await citel.reply(`Activated chatbot Successfuly.`);

                    }
                    break
                case "off":
                    {
                        if (!isCreator) return citel.reply(tlang().owner)
                        const Heroku = require("heroku-client");
                        const heroku = new Heroku({
                            token: Config.HEROKU.API_KEY,
                        });
                        let baseURI = "/apps/" + Config.HEROKU.APP_NAME;
                        await heroku.patch(baseURI + "/config-vars", {
                            body: {
                                ["CHATBOT"]: 'flase',
                            },
                        });
                        await citel.reply(`Deactivated chatbot Successfuly.`);
                    }
                    break
                default:
                    {
                        let buttons = [{
                                buttonId: `${prefix}chatbot on`,
                                buttonText: {
                                    displayText: "Turn On",
                                },
                                type: 1,
                            },
                            {
                                buttonId: `${prefix}chatbot off`,
                                buttonText: {
                                    displayText: "Turn Off",
                                },
                                type: 1,
                            },
                        ];
                        await Void.sendButtonText(citel.chat, buttons, `Chatbot Manager`, Void.user.name, citel);
                    }
            }


        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "ebinary",
            desc: "encode binary",
            category: "misc",
            use: '<query>',
        },
        async(Void, citel, text,{ isCreator }) => {
            try {
                if (!text) return citel.reply(`Send text to be encoded.`);

                let textt = text || citel.quoted.text
                let eb = await eBinary(textt);
                citel.reply(eb);
            } catch (e) {
                console.log(e)
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "dbinary",
            desc: "decode binary",
            category: "misc",
            use: '<query>',
        },
        async(Void, citel, text,{ isCreator }) => {
            try {
                if (!text) return citel.reply(`Send text to be decoded.`);
                let eb = await dBinary(text);
                citel.reply(eb);
            } catch (e) {
                console.log(e)
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "botpic",
            desc: "Sets profile pic on userbot.",
            fromMe: true,
            category: "misc",
        },
        async(Void, citel, text) => {
            if (!citel.quoted) return citel.reply(`Send/Reply Image With Caption ${command}`);
            let mime = citel.quoted.mtype
            if (!/image/.test(mime)) return citel.reply(`Send/Reply Image With Caption ${command}`);
            if (/webp/.test(mime)) return citel.reply(`Send/Reply Image With Caption ${command}`);
            let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            await Void.updateProfilePicture(Void.user.id, {
                    url: media,
                })
                .catch((err) => fs.unlinkSync(media));
            citel.reply(tlang().success);
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "bot",
            desc: "activates and deactivates bot.\nuse buttons to toggle.",
            category: "misc",
        },
        async(Void, citel, text) => {
            if (!citel.isGroup) return citel.reply(tlang().group);
            const groupAdmins = await getAdmin(Void, citel)
            const botNumber = await Void.decodeJid(Void.user.id)
            const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
            const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
            if (!isAdmins) return citel.reply(tlang().admin)
            if (!isBotAdmins) return citel.reply(tlang().botadmin)
            let buttons = [{
                    buttonId: `${prefix}act bot`,
                    buttonText: {
                        displayText: "Turn On",
                    },
                    type: 1,
                },
                {
                    buttonId: `${prefix}deact bot`,
                    buttonText: {
                        displayText: "Turn Off",
                    },
                    type: 1,
                },
            ];
            await Void.sendButtonText(citel.chat, buttons, `Act/deact bot:in specific group`, Void.user.name, citel);
        })
    //---------------------------------------------------------------------------
cmd({
            pattern: "antilink",
            desc: "activates and deactivates antilink.\nuse buttons to toggle.",
            category: "group",
        },
        async(Void, citel, text) => {
            if (!citel.isGroup) return citel.reply(tlang().group);
            const groupAdmins = await getAdmin(Void, citel)
            const botNumber = await Void.decodeJid(Void.user.id)
            const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
            const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
            if (!isAdmins) return citel.reply(tlang().admin)
            if (!isBotAdmins) return citel.reply(tlang().botadmin)
            let buttons = [{
                    buttonId: `${prefix}act antilink`,
                    buttonText: {
                        displayText: "Turn On",
                    },
                    type: 1,
                },
                {
                    buttonId: `${prefix}deact antilink`,
                    buttonText: {
                        displayText: "Turn Off",
                    },
                    type: 1,
                },
            ];
            await Void.sendButtonText(citel.chat, buttons, `Activate antilink:Deletes Link + kick`, Void.user.name, citel);
        }
    )
    //---------------------------------------------------------------------------
cmd({ on: "body" }, async(Void, citel) => {
    if (Config.autoreaction === 'true' && citel.text.startsWith(prefix)) {
        const emojis = ['❤', '💕', '😻', '🧡', '💛', '💚', '💙', '💜', '🖤', '❣', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥', '💌', '🙂', '🤗', '😌', '😉', '🤗', '😊', '🎊', '🎉', '🎁', '🎈', '👋']
        const emokis = emojis[Math.floor(Math.random() * (emojis.length))]
        Void.sendMessage(citel.chat, {
            react: {
                text: emokis,
                key: citel.key
            }
        })
    }
})
