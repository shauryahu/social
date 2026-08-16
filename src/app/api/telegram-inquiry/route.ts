import { NextResponse } from "next/server";

// In-memory rate limiting store: identifier (IP or Username) -> timestamp ms
const rateLimitMap = new Map<string, number>();

// 1 hour cooldown in milliseconds
const ONE_HOUR_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telegramUsername, selectedServices, customDetails } = body;

    if (!telegramUsername || !customDetails) {
      return NextResponse.json(
        { error: "Telegram username and custom details are required." },
        { status: 400 }
      );
    }

    // ── Anti-Spam Protection (1 query per hour per IP / Username) ──
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    const formattedUsername = telegramUsername.startsWith("@")
      ? telegramUsername.toLowerCase()
      : `@${telegramUsername.toLowerCase()}`;

    const ipKey = `ip:${clientIp}`;
    const userKey = `user:${formattedUsername}`;

    const now = Date.now();

    // Check IP rate limit
    const lastIpSubmission = rateLimitMap.get(ipKey);
    if (lastIpSubmission && now - lastIpSubmission < ONE_HOUR_MS) {
      const remainingMins = Math.ceil(
        (ONE_HOUR_MS - (now - lastIpSubmission)) / 60000
      );
      return NextResponse.json(
        {
          error: `Anti-Spam Protection: Only 1 inquiry allowed per hour. Please wait ${remainingMins} minute(s) before trying again.`,
        },
        { status: 429 }
      );
    }

    // Check Username rate limit
    const lastUserSubmission = rateLimitMap.get(userKey);
    if (lastUserSubmission && now - lastUserSubmission < ONE_HOUR_MS) {
      const remainingMins = Math.ceil(
        (ONE_HOUR_MS - (now - lastUserSubmission)) / 60000
      );
      return NextResponse.json(
        {
          error: `Anti-Spam Protection: ${formattedUsername} has already submitted an inquiry recently. Please wait ${remainingMins} minute(s).`,
        },
        { status: 429 }
      );
    }

    // Target bot credentials
    const botToken =
      process.env.TELEGRAM_BOT_TOKEN ||
      "8929359321:AAH93RhVaOjTwO1unV9m3JIfwq7g5NC-Vkg";
    const chatId = process.env.TELEGRAM_CHAT_ID || "7330752212";

    const servicesText =
      Array.isArray(selectedServices) && selectedServices.length > 0
        ? selectedServices.join(", ")
        : "General Inquiry";

    const formattedMessage = `
⚡ **NEW SOCIALASSIST TELEGRAM INQUIRY** ⚡

👤 **Client Telegram**: ${formattedUsername}
🛠 **Services Needed**: ${servicesText}
📅 **Submitted**: ${new Date().toLocaleString()}
🌐 **Client IP**: ${clientIp}

📝 **Custom Details & Requirements**:
${customDetails}

---
*Sent via SocialAssist Web Platform (Anti-Spam Protected)*
    `.trim();

    // Call Telegram Bot API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      console.error("Telegram API Error:", data);
      return NextResponse.json(
        { error: data.description || "Failed to send Telegram message." },
        { status: 500 }
      );
    }

    // Update anti-spam rate limiting timestamps upon successful send
    rateLimitMap.set(ipKey, now);
    rateLimitMap.set(userKey, now);

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been delivered directly to our Telegram bot!",
    });
  } catch (error: any) {
    console.error("Server Error sending Telegram inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error processing inquiry." },
      { status: 500 }
    );
  }
}
