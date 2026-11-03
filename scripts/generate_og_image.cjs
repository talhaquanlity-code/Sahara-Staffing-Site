const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Prepare Base64 assets
const logoPath = path.resolve('public/assets/sahara-logo.png');
const markPath = path.resolve('public/assets/sahara-mark.png');
const execImgPath = path.resolve('public/assets/talent-exec.jpg');

const logoB64 = fs.existsSync(logoPath) ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}` : '';
const markB64 = fs.existsSync(markPath) ? `data:image/png;base64,${fs.readFileSync(markPath).toString('base64')}` : '';
const execB64 = fs.existsSync(execImgPath) ? `data:image/jpeg;base64,${fs.readFileSync(execImgPath).toString('base64')}` : '';

// 2. Generate HTML Template (1200 x 630 px)
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sahara Staffing Open Graph Card</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

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
      background: radial-gradient(circle at 88% 25%, rgba(230, 157, 43, 0.18) 0%, transparent 48%),
                  radial-gradient(circle at 12% 85%, rgba(230, 157, 43, 0.08) 0%, transparent 40%),
                  radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.7) 0%, #080B12 100%);
      padding: 56px 68px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      overflow: hidden;
      border: 1px solid rgba(230, 157, 43, 0.22);
    }

    /* Ambient Gold Light Ring in Background */
    .bg-orbital-ring {
      position: absolute;
      right: -80px;
      top: -60px;
      width: 580px;
      height: 580px;
      border-radius: 50%;
      border: 1px dashed rgba(230, 157, 43, 0.16);
      pointer-events: none;
    }
    .bg-orbital-ring-2 {
      position: absolute;
      right: -20px;
      top: 0px;
      width: 460px;
      height: 460px;
      border-radius: 50%;
      border: 1px solid rgba(230, 157, 43, 0.22);
      pointer-events: none;
    }

    /* Grid overlay pattern */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%);
      pointer-events: none;
    }

    /* Left Content Column */
    .left-col {
      position: relative;
      z-index: 10;
      width: 650px;
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
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(230, 157, 43, 0.12);
      border: 1px solid rgba(230, 157, 43, 0.35);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
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
      line-height: 1.14;
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
      font-size: 17px;
      line-height: 1.5;
      color: #94A3B8;
      margin-bottom: 24px;
      max-width: 580px;
      font-weight: 400;
    }

    /* Trust Stats Row */
    .metrics-row {
      display: flex;
      gap: 16px;
    }

    .stat-card {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
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
      font-size: 11px;
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
      margin-top: 18px;
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

    /* Right Card Mockup Column */
    .right-col {
      position: relative;
      z-index: 10;
      width: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-wrap {
      position: relative;
      width: 350px;
      background: linear-gradient(145deg, rgba(26, 34, 52, 0.85) 0%, rgba(13, 19, 32, 0.95) 100%);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(230, 157, 43, 0.3);
      box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.75),
                  0 0 40px rgba(230, 157, 43, 0.12);
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mark-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(230, 157, 43, 0.5));
    }

    .card-brand-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0.04em;
    }

    .verified-pill {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34D399;
      font-size: 10.5px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .candidate-preview {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(8, 11, 18, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 12px;
    }

    .exec-avatar {
      width: 58px;
      height: 58px;
      border-radius: 12px;
      object-fit: cover;
      border: 1.5px solid rgba(230, 157, 43, 0.6);
    }

    .exec-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .exec-name {
      font-size: 14.5px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .exec-title {
      font-size: 11.5px;
      color: #94A3B8;
    }

    .match-rate {
      font-size: 11px;
      font-weight: 700;
      color: #E69D2B;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .card-footer-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    .tag-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 5px 9px;
      font-size: 10.5px;
      font-weight: 600;
      color: #CBD5E1;
    }

    .floating-guarantee {
      position: absolute;
      bottom: -14px;
      right: 18px;
      background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
      border: 1px solid rgba(230, 157, 43, 0.4);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      border-radius: 9999px;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 700;
      color: #FFE194;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  </style>
</head>
<body>
  <div class="canvas">
    <div class="grid-overlay"></div>
    <div class="bg-orbital-ring"></div>
    <div class="bg-orbital-ring-2"></div>

    <!-- Left Column: Branding, Headline, Stats -->
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
            <div class="stat-val">14 <span style="font-size: 16px; font-weight: 600;">Days</span></div>
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
          <span>•</span> Direct Hire & Contract
        </div>
      </div>
    </div>

    <!-- Right Column: Glassmorphic Candidate & Brand Emblem Card -->
    <div class="right-col">
      <div class="card-wrap">
        <div class="card-top">
          <div class="card-brand">
            <img src="${markB64}" alt="Sahara Mark" class="mark-icon" />
            <span class="card-brand-text">SAHARA VERIFIED</span>
          </div>
          <div class="verified-pill">● Active</div>
        </div>

        <div class="candidate-preview">
          <img src="${execB64}" alt="Executive Candidate" class="exec-avatar" />
          <div class="exec-info">
            <div class="exec-name">VP of Engineering</div>
            <div class="exec-title">Distributed Systems & AI Architecture</div>
            <div class="match-rate">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E69D2B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              99.4% Client Match
            </div>
          </div>
        </div>

        <div class="card-footer-tags">
          <span class="tag-item">C-Suite & VP</span>
          <span class="tag-item">FinTech & AI</span>
          <span class="tag-item">Full-Cycle Vetting</span>
          <span class="tag-item">Confidential Search</span>
        </div>

        <div class="floating-guarantee">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFE194" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          90-Day Placement Guarantee
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 3. Write HTML to scratch file
const scratchDir = path.resolve('scratch');
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}
const htmlPath = path.join(scratchDir, 'render_og.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log('Wrote HTML template to:', htmlPath);

// 4. Run Chrome Headless Screenshot
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
