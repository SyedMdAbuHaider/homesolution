/**
 * SITE CONFIG
 * Edit values here — never touch index.html for these settings.
 */
window.SITE_CONFIG = {
  // --- Telegram order notifications ---
  // 1. Message @BotFather on Telegram, /newbot, copy the token below.
  // 2. Message your new bot once (so it can message you back).
  // 3. Visit https://api.telegram.org/bot<TOKEN>/getUpdates and find "chat":{"id": ...}
  //    That number is your TELEGRAM_CHAT_ID.
  TELEGRAM_BOT_TOKEN: "PASTE_YOUR_BOT_TOKEN_HERE",
  TELEGRAM_CHAT_ID: "PASTE_YOUR_CHAT_ID_HERE",

  // --- Store basics ---
  CURRENCY_SYMBOL: "৳",
  STORE_NAME: "Home Solution",

  // --- Banner slider timing ---
  BANNER_INTERVAL_MS: 4000,

  // --- Districts shown in the order form ---
  DISTRICTS: [
    "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
    "Barisal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
  ]
};
