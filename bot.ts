import {Bot, GrammyError } from 'grammy';
import * as dotenv from 'dotenv';
dotenv.config();
const  TOKEN =process.env.TOKEN as string;
const bot = new  Bot(TOKEN);

import sendMail from './sendmail';

bot.command("start",(msg)=>{
   const chatID = msg.message?.chat.id as string|number;
   bot.api.sendMessage(chatID, "welcome dude");
})

bot.command('send',(msg)=>{
   const chatID = msg.message?.chat.id as string|number;
   bot.api.sendMessage(chatID, "please provide receivers mail followed by the message: ");
})

bot.on("message",async(msg)=>{
   const chatID = msg.message.chat.id;
   const Text=msg.message.text as string;
   const words= Text.split(' ');
   const emailRegex =/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
   const email =words.filter((item)=>emailRegex.test(item))
   const filterWords=words.filter((item)=>!emailRegex.test(item));
   const MessageBody=filterWords.join(' ')

   
   if (email && MessageBody) {
      sendMail(email, MessageBody);
      bot.api.sendMessage(chatID, "Email sent successfully");
  } else {
      bot.api.sendMessage(chatID, "Please provide both receiver's email and message body.");
  }
  
     console.log(email,MessageBody);

 }
      
     
)

bot.catch((err)=>{
   const error =err.ctx;
   console.error(`Error while handling update ${error.update.update_id}:`);
   const e = err.error;
   if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else {
      console.error("Unknown error:", e);
    }
})



bot.start();