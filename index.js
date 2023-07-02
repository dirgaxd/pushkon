require(`./config.js`)
const { default: makeWASocket, DisconnectReason, downloadContentFromMessage, useSingleFileAuthState, jidDecode, areJidsSameUser, makeInMemoryStore } = require('@adiwajshing/baileys')
const { state } = useSingleFileAuthState('./session.json')
const PhoneNumber = require('awesome-phonenumber')
const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const FileType = require('file-type')
const { Boom } = require('@hapi/boom')
const { smsg } = require('./smsg')
const { welcome1, welcome2, welcome3, goodbye1, goodbye2, goodbye3 } = require(`./canvas`)
const wlcom = JSON.parse(fs.readFileSync("./data/database/welcome.json"))
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./exif')
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) }
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const connectToWhatsApp = () => {
const client = makeWASocket({ logger: pino ({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ["Bug Simple KirBotz", "Dekstop", "3.0"]})
console.log(color('[ Base Ori KirBotz ]\n', 'red'),color('\nInfo Script :\n➸ Baileys : Multi Device\n➸ Nama Script : KirBotz-MD\n➸ Creator : KirBotz\n\nFollow My Social Media Account All Yes :\n➸ My Youtube : KirBotz`\n➸ My Instagram : @kirbotz01\n➸ My Github : KirBotz\n\nDonase Me For Support :\n➸ Dana : 085798145596\n➸ Shopeepay : 085798145596\n➸ Gopay : 087705048235\n➸ Ovo : 087705048235\n\nThanks\n', 'red'))

store.bind(client.ev)

client.ev.on('messages.upsert', async chatUpdate => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return client.readMessages([m.key])
if (!client.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
msg = smsg(client, m, store)
require('./kw')(client, msg, chatUpdate, store)
} catch (err) {
console.log(err)}})

client.ev.on('group-participants.update', async (anu) => {
if (!wlcom.includes(anu.id)) return
console.log(anu)
try {
let metadata = await client.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await client.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await client.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://i.ibb.co/s2KvYYf/20230524-060103.png'
}
let nameUser = await client.getName(num)
let membr = metadata.participants.length
if (anu.action == 'add') {
const wel1 = await welcome1(`${nameUser}`, `${metadata.subject}`, `${ppgroup}`, `${membr}`, `${ppuser}`, `https://i.ibb.co/LgWsTJC/1685442424826.jpg`)
const wel2 = await welcome2(`${nameUser}`, `${ppuser}`, `${metadata.subject}`, `${membr}`, "https://i.ibb.co/LgWsTJC/1685442424826.jpg")
const wel3 = await welcome3(`${nameUser}`, `${ppuser}`)
const welcs = ['welcome1', 'welcome2', 'welcome3']
const halalu = welcs[Math.floor(Math.random() * welcs.length)]
client.sendMessage(anu.id, { image: fs.readFileSync(`./data/tmp/${halalu}.png`), mentions: [num], caption: `Hallo Kak @${num.split('@')[0]}, Selamat Datang Di Group ${metadata.subject} Moga Betah ya\n\nDeskripsi Group:\n${metadata.desc}` })
} else if (anu.action == 'remove') {
const god1 = await goodbye1(`${nameUser}`, `${metadata.subject}`, `${ppgroup}`, `${membr}`, `${ppuser}`, `https://i.ibb.co/LgWsTJC/1685442424826.jpg`)
const god2 = await goodbye2(`${nameUser}`, `${ppuser}`, `${membr}`, "https://i.ibb.co/LgWsTJC/1685442424826.jpg")
const god3 = await goodbye3(`${nameUser}`, `${ppuser}`)
const gods = ['goodbye1', 'goodbye2', 'goodbye3']
const halelu = gods[Math.floor(Math.random() * gods.length)]
client.sendMessage(anu.id, { image: fs.readFileSync(`./data/tmp/${halelu}.png`), mentions: [num], caption: `Selamat Tinggal Kak @${num.split('@')[0]} Jangan Balik Lagi Ke Group ${metadata.subject} Lagi ya` })
}
}
} catch (err) {
console.log(err)
}
})

client.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') { lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectToWhatsApp() : ''}
else if (connection === 'open') {
client.sendMessage(nomorOwner + "@s.whatsapp.net", {text:`${JSON.stringify(update, undefined, 2)}` + `\n\nBot WhatsApp By ` + namaDeveloper})}
console.log(update)})

client.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

client.ev.on('contacts.update', update => {
for (let contact of update) {
let id = client.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

client.getName = (jid, withoutContact  = false) => {
id = client.decodeJid(jid)
withoutContact = client.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = client.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === client.decodeJid(client.user.id) ?
client.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

client.public = true

client.sendTextWithMentions = async (jid, text, quoted, options = {}) => client.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

client.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

const { getImg } = require('./functions')

client.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getImg(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await client.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

client.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getImg(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

client.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getImg(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

client.sendButMessage = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
client.sendMessage(jid, buttonMessage, { quoted, ...options })
}

}

connectToWhatsApp()