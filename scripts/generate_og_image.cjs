const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Prepare Base64 Brand Assets (Logo & Favicon Mark ONLY — NO Human/Stock Photos)
const logoPath = path.resolve('public/assets/sahara-logo.png');
const markPath = path.resolve('public/assets/sahara-mark.png');

const logoB64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
  : '';
const markB64 = fs.existsSync(markPath)
  ? `data:image/png;base64,${fs.readFileSync(markPath).toString('base64')}`
  : '';

// 2. Generate Pure-Brand HTML Template (1200 x 630 px standard social card)
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sahara Staffing Open Graph Card</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #080B12;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #FAF9F6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      width: 1200px;
      height: 630px;
      background: radial-gradient(circle at 82% 25%, rgba(230, 157, 43, 0.22) 0%, transparent 48%),
                  radial-gradient(circle at 14% 85%, rgba(230, 157, 43, 0.10) 0%, transparent 42%),
                  radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.75) 0%, #080B12 100%);
      padding: 56px 68px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: stretch;
      overflow: hidden;
      border: 1.5px solid rgba(230, 157, 43, 0.28);
    }

    /* Ambient Orbital Rings in Background */
    .bg-orbital-ring {
      position: absolute;
      right: -60px;
      top: -40px;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      border: 1px dashed rgba(230, 157, 43, 0.18);
      pointer-events: none;
    }

    .bg-orbital-ring-2 {
      position: absolute;
      right: 0px;
      top: 20px;
      width: 480px;
      height: 480px;
      border-radius: 50%;
      border: 1px solid rgba(230, 157, 43, 0.24);
      pointer-events: none;
    }

    /* Architectural Subtle Grid Overlay */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%);
      pointer-events: none;
    }

    /* Left Content Column */
    .left-col {
      position: relative;
      z-index: 10;
      width: 640px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .top-meta {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .brand-logo {
      height: 46px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.6));
    }

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 15px;
      border-radius: 9999px;
      background: rgba(230, 157, 43, 0.14);
      border: 1px solid rgba(230, 157, 43, 0.4);
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #E69D2B;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #E69D2B;
      box-shadow: 0 0 10px #E69D2B;
    }

    .hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: 48px;
      font-weight: 800;
      line-height: 1.13;
      letter-spacing: -0.025em;
      color: #FFFFFF;
      margin-top: 18px;
      margin-bottom: 14px;
    }

    .gold-gradient {
      background: linear-gradient(135deg, #FFE194 0%, #E69D2B 55%, #C97E10 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }

    .hero-desc {
      font-size: 16.5px;
      line-height: 1.55;
      color: #94A3B8;
      margin-bottom: 24px;
      max-width: 580px;
      font-weight: 400;
    }

    /* Trust Metrics Row */
    .metrics-row {
      display: flex;
      gap: 16px;
    }

    .stat-card {
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 14px;
      padding: 12px 18px;
      min-width: 155px;
    }

    .stat-val {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #E69D2B;
      line-height: 1.1;
      display: flex;
      align-items: baseline;
      gap: 3px;
    }

    .stat-label {
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748B;
      margin-top: 4px;
    }

    /* Bottom domain row */
    .bottom-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 16px;
    }

    .domain-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 12.5px;
      font-weight: 600;
      color: #CBD5E1;
      letter-spacing: 0.02em;
    }

    .domain-pill svg {
      width: 14px;
      height: 14px;
      fill: none;
      stroke: #E69D2B;
      stroke-width: 2;
    }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #94A3B8;
    }

    /* Right Column: Architectural Brand Showcase (NO PHOTOS) */
    .right-col {
      position: relative;
      z-index: 10;
      width: 400px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .showcase-card {
      position: relative;
      width: 380px;
      background: linear-gradient(145deg, rgba(20, 27, 44, 0.92) 0%, rgba(10, 14, 24, 0.96) 100%);
      backdrop-filter: blur(24px);
      border-radius: 28px;
      border: 1.5px solid rgba(230, 157, 43, 0.35);
      box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.85),
                  0 0 50px rgba(230, 157, 43, 0.16);
      padding: 30px 26px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 18px;
    }

    /* Center Favicon Medallion with Radiant Glow */
    .favicon-medallion {
      position: relative;
      width: 108px;
      height: 108px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(230, 157, 43, 0.25) 0%, rgba(11, 15, 23, 0.95) 70%);
      border: 2px solid rgba(230, 157, 43, 0.55);
      box-shadow: 0 0 32px rgba(230, 157, 43, 0.4),
                  inset 0 0 20px rgba(230, 157, 43, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
    }

    .favicon-icon {
      width: 58px;
      height: 58px;
      object-fit: contain;
      filter: drop-shadow(0 4px 14px rgba(230, 157, 43, 0.7));
    }

    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.03em;
      color: #FFFFFF;
      line-height: 1.2;
    }

    .brand-kicker {
      font-size: 11.5px;
      font-weight: 700;
      color: #E69D2B;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* Pillars List (Pure Typography & Badges) */
    .pillars-list {
      display: flex;
      flex-direction: column;
      gap: 8.5px;
      width: 100%;
      margin-top: 4px;
    }

    .pillar-row {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      padding: 9px 14px;
      text-align: left;
    }

    .pillar-dot {
      color: #E69D2B;
      font-size: 13px;
      line-height: 1;
    }

    .pillar-text {
      font-size: 12px;
      font-weight: 600;
      color: #E2E8F0;
      letter-spacing: 0.01em;
    }

    .floating-seal {
      position: absolute;
      bottom: -13px;
      background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
      border: 1px solid rgba(230, 157, 43, 0.45);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
      border-radius: 9999px;
      padding: 5px 16px;
      font-size: 11px;
      font-weight: 700;
      color: #FFE194;
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.03em;
    }
  </style>
</head>
<body>
  <div class="canvas">
    <div class="grid-overlay"></div>
    <div class="bg-orbital-ring"></div>
    <div class="bg-orbital-ring-2"></div>

    <!-- Left Column: Branding, Headline, Metrics -->
    <div class="left-col">
      <div>
        <div class="top-meta">
          <img src="${logoB64}" alt="Sahara Staffing Inc." class="brand-logo" />
          <div class="category-badge">
            <span class="pulse-dot"></span>
            Executive Search
          </div>
        </div>

        <h1 class="hero-title">
          Connecting <span class="gold-gradient">Elite Talent</span> with High-Growth Enterprises
        </h1>

        <p class="hero-desc">
          Specialized B2B recruitment, executive leadership, and rapid workforce placement engineered for high-performing organizations.
        </p>

        <div class="metrics-row">
          <div class="stat-card">
            <div class="stat-val">500+</div>
            <div class="stat-label">Executive Placements</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">98%</div>
            <div class="stat-label">90-Day Retention</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">14 <span style="font-size: 15px; font-weight: 600;">Days</span></div>
            <div class="stat-label">Avg Time-to-Fill</div>
          </div>
        </div>
      </div>

      <div class="bottom-bar">
        <div class="domain-pill">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          sahara-staffing.vercel.app
        </div>
        <div class="pill-badge">
          <span>•</span> Top 2% Pre-Vetted Talent Pool
        </div>
        <div class="pill-badge">
          <span>•</span> Direct Hire &amp; Contract
        </div>
      </div>
    </div>

    <!-- Right Column: Pure Brand & Favicon Showcase (ZERO HUMAN/STOCK PHOTOS) -->
    <div class="right-col">
      <div class="showcase-card">
        <!-- Glowing Favicon Emblem -->
        <div class="favicon-medallion">
          <img src="${markB64}" alt="Sahara Staffing Favicon" class="favicon-icon" />
        </div>

        <div>
          <div class="brand-title">Sahara Staffing Inc.</div>
          <div class="brand-kicker">Pre-Vetted Professional Network</div>
        </div>

        <!-- Pillar Features (Typography & Badges - No Photos) -->
        <div class="pillars-list">
          <div class="pillar-row">
            <span class="pillar-dot">✦</span>
            <span class="pillar-text">C-Suite &amp; Executive Leadership</span>
          </div>
          <div class="pillar-row">
            <span class="pillar-dot">✦</span>
            <span class="pillar-text">Principal AI &amp; Cloud Engineers</span>
          </div>
          <div class="pillar-row">
            <span class="pillar-dot">✦</span>
            <span class="pillar-text">100% 90-Day Placement Guarantee</span>
          </div>
          <div class="pillar-row">
            <span class="pillar-dot">✦</span>
            <span class="pillar-text">Rigorous 5-Stage Diligence Process</span>
          </div>
        </div>

        <div class="floating-seal">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFE194" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Verified Partner Network
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 3. Write HTML to temporary render file
const scratchDir = path.resolve('scratch');
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}
const htmlPath = path.join(scratchDir, 'render_og.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log('Wrote pure-brand OG HTML template to:', htmlPath);

// 4. Capture 1200x630 Screenshot with Chrome Headless
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outPngPath = path.resolve('public/og-preview.png');
const outJpgPath = path.resolve('public/og-image.jpg');
const outAssetPngPath = path.resolve('public/assets/og-preview.png');

const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
console.log('Capturing screenshot with Chrome from:', fileUrl);

try {
  execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1200,630 --screenshot="${outPngPath}" "${fileUrl}"`, {
    timeout: 15000,
    stdio: 'inherit'
  });
  console.log('Generated OG Preview PNG:', outPngPath);

  // Copy to outJpgPath and outAssetPngPath
  if (fs.existsSync(outPngPath)) {
    fs.copyFileSync(outPngPath, outJpgPath);
    fs.copyFileSync(outPngPath, outAssetPngPath);
    const stats = fs.statSync(outPngPath);
    console.log(`Success! File size: ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error('Failed: outPngPath not created');
  }
} catch (e) {
  console.error('Error executing Chrome:', e.message);
}
