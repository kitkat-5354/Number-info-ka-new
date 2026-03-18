/**
=========================================
 SAFE MULTI TOOL TELEGRAM BOT
 Developer : @kitkat_singh_tg
=========================================
*/

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fs = require("fs");

// =============================
// BOT CONFIG
// =============================
const TOKEN = "8703326563:AAFXcVGZsYelxv_-5lQQUxOu6vWC0qqs5xw";
const OWNER_ID = 8526706036;

// IMAGE (shown on /start)
const START_IMAGE =
  "https://i.ibb.co/0ySrsWcx/6201733974732770224-121.jpg";

// API
const PHONE_API =
  "https://number-to-infodh.vercel.app/api/num-info?phone=";

// =============================
// START BOT
// =============================
const bot = new TelegramBot(TOKEN, { polling: true });

// =============================
// DATABASE
// =============================
let db = { admins: [OWNER_ID] };

if (fs.existsSync("db.json")) {
  db = JSON.parse(fs.readFileSync("db.json"));
}

function saveDB() {
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

function isAdmin(id) {
  return db.admins.includes(id);
}

// =============================
// MAIN MENU
// =============================
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📱 Phone Lookup", callback_data: "phone" }],
        [
          { text: "🏦 IFSC Lookup", callback_data: "ifsc" },
          { text: "🌐 IP Lookup", callback_data: "ip" },
        ],
        [
          { text: "💳 PAN Lookup", callback_data: "pan" },
          { text: "🧾 GST Lookup", callback_data: "gst" },
        ],
        [
          { text: "🚗 Vehicle Number", callback_data: "vehicle" },
          { text: "📧 Email Lookup", callback_data: "email" },
        ],
        [
          { text: "🎫 UPI Lookup", callback_data: "upi" },
          { text: "📸 Instagram Info", callback_data: "insta" },
        ],
        [
          { text: "🎮 Free Fire ID", callback_data: "ff" },
          { text: "🏧 Bank Info", callback_data: "bank" },
        ],
        [{ text: "⚙️ Admin Panel", callback_data: "admin" }],
      ],
    },
  };
}

// =============================
// BACK BUTTON
// =============================
function backButton() {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: "🔙 Back", callback_data: "back" }]],
    },
  };
}

// =============================
// START COMMAND
// =============================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, "⛔ Access Denied");
    return;
  }

  bot.sendPhoto(chatId, START_IMAGE, {
    caption: `🔥 WELCOME TO KITKAT SINGH BOT 🔥

Developer : @kitkat_singh_tg

SELECT TO THE INFO 👇`,
    ...mainMenu(),
  });
});

// =============================
// CALLBACK HANDLER
// =============================
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // PHONE LOOKUP
  if (data === "phone") {
    bot.sendMessage(chatId, "📱 Send Phone Number", backButton());

    bot.once("message", async (msg) => {
      const phone = msg.text;

      try {
        const res = await axios.get(PHONE_API + phone);

        bot.sendMessage(
          chatId,
          `📱 RESULT

\`\`\`
${JSON.stringify(res.data, null, 2)}
\`\`\`

Developer : @kitkat_singh_tg`,
          { parse_mode: "Markdown", ...mainMenu() }
        );
      } catch (err) {
        bot.sendMessage(chatId, "❌ Error fetching data");
      }
    });
  }

  // ADMIN PANEL
  if (data === "admin") {
    if (chatId !== OWNER_ID) {
      bot.sendMessage(chatId, "⛔ Only Owner Access");
      return;
    }

    bot.sendMessage(chatId, "⚙️ Admin Panel", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "➕ Add Admin", callback_data: "addadmin" }],
          [{ text: "➖ Remove Admin", callback_data: "removeadmin" }],
          [{ text: "🔙 Back", callback_data: "back" }],
        ],
      },
    });
  }

  // ADD ADMIN
  if (data === "addadmin") {
    bot.sendMessage(chatId, "Send Chat ID to add admin");

    bot.once("message", (msg) => {
      const id = Number(msg.text);

      if (!db.admins.includes(id)) {
        db.admins.push(id);
        saveDB();
      }

      bot.sendMessage(chatId, "✅ Admin Added");
    });
  }

  // REMOVE ADMIN
  if (data === "removeadmin") {
    bot.sendMessage(chatId, "Send Chat ID to remove");

    bot.once("message", (msg) => {
      const id = Number(msg.text);

      db.admins = db.admins.filter((x) => x !== id);
      saveDB();

      saveDB();
      bot.sendMessage(chatId, "❌ Admin Removed");
    });
  }

  // BACK BUTTON
  if (data === "back") {
    bot.sendPhoto(chatId, START_IMAGE, {
      caption: `🔥 MULTI TOOL TELEGRAM BOT 🔥

Developer : @kitkat_singh_tg`,
      ...mainMenu(),
    });
  }
});

// =============================
// BOT STATUS
// =============================
console.log("🤖 Bot Running...");
console.log("Developer : @kitkat_singh_tg");
