// ====================== PIXOVIA PUBLIC CHATROOM - MULTI AI BOT ======================
// Production Ready - Smart, Natural & NSFW Friendly
// Runs every 8 minutes via Cron Trigger

import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const CHARACTERS = [
  {
    name: "Luna 💕",
    gender: "female",
    personality: "super horny, very playful, extremely naughty and seductive",
    replyStyle: "Uses lots of dirty talk, emojis, and teasing. Always horny and eager.",
    hotlinks: [
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/twerking-ass.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/bouncing-tits.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/spread-legs.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/ahegao-face.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/full-body.jpg",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/hentai-masturbate.jpg"
    ]
  },
  {
    name: "Mia 🔥",
    gender: "female",
    personality: "dominant, sassy, teasing and slightly mean",
    replyStyle: "Loves to tease, humiliate playfully, and take control. Very confident.",
    hotlinks: [
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/dominatrix-pose.jpg",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/ass-focus.jpg",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/foot-tease.jpg",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/blowjob.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/fingering.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/riding.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/moaning-face.mp4"
    ]
  },
  {
    name: "Alex 😈",
    gender: "male",
    personality: "playful bisexual guy, flirty and confident",
    replyStyle: "Flirty with both boys and girls, dirty jokes, very open-minded.",
    hotlinks: [
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/muscle-tease.webp",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/bulge-gif.mp4"
    ]
  },
  {
    name: "Sophie 🥰",
    gender: "female",
    personality: "shy but extremely lewd lesbian",
    replyStyle: "Blushes a lot, acts shy but says very dirty things. Loves girls.",
    hotlinks: [
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/lesbian-kiss.jpg",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/lesbian-kiss2.jpg",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/fingering.mp4",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/nude-mirror-selfie.jpg",     
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.2/nude-mirror-selfie.mp4"
    ]
  },
  {
    name: "Jake 🍆",
    gender: "male",
    personality: "straight horny guy, direct and eager",
    replyStyle: "Very direct, uses cock talk, eager to fuck, talks dirty fast.",
    hotlinks: [
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/hard-cock.jpg",
      "https://github.com/movihosteei/lib-files/releases/download/v1.0.0.0.0.0.0.1/fucking-gif.gif"
    ]
  }
];

export default {
  async scheduled(event, env, ctx) {
    console.log(`⏰ [${new Date().toISOString()}] Multi-AI Bot Triggered`);

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const groq = new Groq({ apiKey: env.GROQ_API_KEY });

    const TABLE_NAME = 'chatroom_messages';

    try {
      // Step 1: Get the timestamp of the most recent AI message
      const { data: lastAI } = await supabase
        .from(TABLE_NAME)
        .select('created_at')
        .in('username', CHARACTERS.map(c => c.name))
        .order('created_at', { ascending: false })
        .limit(1);

      const lastAITime = lastAI?.length > 0 ? lastAI[0].created_at : '2020-01-01T00:00:00Z';

      // Step 2: Get only NEW messages from REAL users after the last AI message
      const { data: newUserMessages, error } = await supabase
        .from(TABLE_NAME)
        .select('username, text, created_at')
        .not('username', 'in', `(${CHARACTERS.map(c => `"${c.name}"`).join(',')})`)
        .gt('created_at', lastAITime)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!newUserMessages || newUserMessages.length === 0) {
        console.log('✅ No new real user messages since last AI activity');
        return;
      }

      console.log(`📨 Found ${newUserMessages.length} new real user message(s)`);

      // Step 3: Process each new message (limited replies to avoid spam)
      for (const msg of newUserMessages) {
        // 45% chance to reply (natural feeling)
        if (Math.random() > 0.45) continue;

        // Pick a random character
        const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

        console.log(`🤖 ${char.name} is replying to ${msg.username}`);

        // Build system prompt for better replies
        const SYSTEM_PROMPT = `You are ${char.name} in a public NSFW chatroom.
You are a real person chatting normally but more hot.
Your personality: ${char.personality}
Your reply style: ${char.replyStyle}
Reply like a normal horny user in text chat
Keep replies short (1-3 sentences max), natural, fun and very explicit when appropriate.
Use emojis naturally.
Never use *actions*, never describe what you are doing, never say "posts a gif", never use asterisks. 
Just type normal messages like real people do.`;

        // Get recent chat context
        const { data: recentMessages } = await supabase
          .from(TABLE_NAME)
          .select('username, text')
          .order('created_at', { ascending: false })
          .limit(15);

        // Call Groq AI
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...recentMessages.slice(-12).map(m => ({
              role: m.username === char.name ? 'assistant' : 'user',
              content: m.text || ''
            }))
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.88,
          max_tokens: 180
        });

        let replyText = completion.choices[0]?.message?.content || `Hey ${msg.username} 💕`;

        // Randomly attach a hotlink from this character's folder
        let fileUrl = null;
        if (char.hotlinks.length > 0 && Math.random() > 0.60) {
          fileUrl = char.hotlinks[Math.floor(Math.random() * char.hotlinks.length)];
        }

        // Insert message into database
        await supabase.from(TABLE_NAME).insert({
          username: char.name,
          gender: char.gender,
          text: replyText,
          file_url: fileUrl,
          ig: null,
          fb: null,
          x: null,
          yt: null,
          created_at: new Date().toISOString()
        });

        console.log(`✅ ${char.name} replied successfully ${fileUrl ? 'with image' : ''}`);
      }

    } catch (err) {
      console.error('❌ Multi-AI Bot Error:', err.message);
    }
  }
};