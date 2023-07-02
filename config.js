const chalk = require("chalk")
const fs = require("fs")

global.ownerNumber = ["6283821123163@s.whatsapp.net"]
global.nomerOwner = "6283821123163"
global.nomorOwner = ['6283821123163']
global.namaDeveloper = "XLaw"
global.nameGEDE = "XLAW"
global.namaBot = "XLaw"
global.packname = ""
global.wame = "https://wa.me/settings"
global.author = "Sticker By XLaw XD"
global.ovo = "0838-2112-3163" // isi nomor ovo lu
global.dana = "0838-2112-3163" // isi nomor dana lu
global.gopay = "-" // isi nomor gopay lu
global.shopeepay = "-" // isi nomor shopeepay lu
global.pulsa = "0838-2112-3163" // isi nomor kartu lu
global.thumb = fs.readFileSync("./thumb.png")
global.thumbqris = fs.readFileSync("./qris.jpg")

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})

/*

Thanks To By KirBotz
Base Ori By KirBotz
Ubah Nomor Owner?
Ganti Di File ./owner.json
Harap Jangan Jual Sc Ini
Karena Sc Ini Free Langsung Dari
Youtube : https://youtube.com/@kangbotwhatsapp

*/