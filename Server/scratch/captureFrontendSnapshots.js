import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
  console.log("Launching headless browser using local Chrome...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: false, // Set to false to allow full visual render rendering
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  
  try {
    console.log("Navigating to Login page...");
    await page.goto("http://localhost:5173/login", { waitUntil: "networkidle2" });
    await sleep(2000);

    console.log("Logging in as bobdeveloper...");
    await page.type("input#username", "bobdeveloper");
    await page.type("input#password", "TestPass@12345");
    
    // Submit form
    await Promise.all([
      page.click("button[type='submit']"),
      page.waitForNavigation({ waitUntil: "networkidle2" })
    ]);
    console.log("Logged in successfully! Redirected to Dashboard.");
    await sleep(3000);

    // Save dashboard screenshot
    console.log("Capturing Dashboard page...");
    await page.screenshot({ path: "E:\\Anb_Carfts_Projects\\Target CV\\TrackForge\\screenshots\\dashboard.png" });

    // Navigate to profile page
    console.log("Navigating to Profile page...");
    const currentUrl = page.url();
    // Path structure: http://localhost:5173/auth/:hash/:username/workspace/dashboard
    const workspaceUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
    await page.goto(`${workspaceUrl}/profile`, { waitUntil: "networkidle2" });
    await sleep(3000);
    console.log("Capturing Profile page...");
    await page.screenshot({ path: "E:\\Anb_Carfts_Projects\\Target CV\\TrackForge\\screenshots\\profile.png" });

    // Navigate to bugs page
    console.log("Navigating to Bugs page...");
    await page.goto(`${workspaceUrl}/bugs`, { waitUntil: "networkidle2" });
    await sleep(3000);

    // Click on the first project in list to load tickets
    console.log("Loading project tickets...");
    const projectCard = await page.$("div.bg-card.cursor-pointer");
    if (projectCard) {
      await projectCard.click();
      await sleep(3000);
    }

    // Capture bugs page
    console.log("Capturing Bugs page...");
    await page.screenshot({ path: "E:\\Anb_Carfts_Projects\\Target CV\\TrackForge\\screenshots\\bugs.png" });

    // Open Chatbot widget
    console.log("Opening Chatbot Widget...");
    // The floating action button is a button at the bottom-right
    const chatBubble = await page.$("button.h-14.w-14.rounded-full");
    if (chatBubble) {
      await chatBubble.click();
      await sleep(1500);

      // Type in chatbot
      console.log("Sending query to Chatbot...");
      await page.type("input[placeholder='Ask about workspace features or code...']", "Write a division by zero check in JS");
      const sendBtn = await page.$("button[type='submit']");
      if (sendBtn) {
        await sendBtn.click();
        console.log("Waiting for AI response...");
        await sleep(8000); // Wait for LLaMA completion
      }

      console.log("Capturing Chatbot widget...");
      await page.screenshot({ path: "E:\\Anb_Carfts_Projects\\Target CV\\TrackForge\\screenshots\\chatbot.png" });
    }

    console.log("All screenshots captured successfully!");
  } catch (err) {
    console.error("Screenshot capture failed:", err);
  } finally {
    await browser.close();
    process.exit(0);
  }
};

run();
