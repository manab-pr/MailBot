"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const TOKEN = process.env.TOKEN;
const bot = new grammy_1.Bot(TOKEN);
const sendmail_1 = __importDefault(require("./sendmail"));
bot.command("start", (msg) => {
    var _a;
    const chatID = (_a = msg.message) === null || _a === void 0 ? void 0 : _a.chat.id;
    bot.api.sendMessage(chatID, "welcome dude");
});
bot.command('send', (msg) => {
    var _a;
    const chatID = (_a = msg.message) === null || _a === void 0 ? void 0 : _a.chat.id;
    bot.api.sendMessage(chatID, "please provide receivers mail followed by the message: ");
});
bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatID = msg.message.chat.id;
    const Text = msg.message.text;
    const words = Text.split(' ');
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const email = words.filter((item) => emailRegex.test(item));
    const filterWords = words.filter((item) => !emailRegex.test(item));
    const MessageBody = filterWords.join(' ');
    if (email && MessageBody) {
        (0, sendmail_1.default)(email, MessageBody);
        bot.api.sendMessage(chatID, "Email sent successfully");
    }
    else {
        bot.api.sendMessage(chatID, "Please provide both receiver's email and message body.");
    }
    console.log(email, MessageBody);
}));
bot.catch((err) => {
    const error = err.ctx;
    console.error(`Error while handling update ${error.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else {
        console.error("Unknown error:", e);
    }
});
bot.start();
