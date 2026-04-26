// Alternatives database
const alternatives = {
    "youtube.com": { name: "PeerTube", desc: "Decentralized video platform", url: "https://joinpeertube.org", badge: "Video" },
    "youtu.be": { name: "PeerTube", desc: "Decentralized video platform", url: "https://joinpeertube.org", badge: "Video" },
    "google.com": { name: "SearXNG", desc: "Privacy-respecting metasearch", url: "https://searx.space", badge: "Search" },
    "facebook.com": { name: "Mastodon", desc: "Federated social network", url: "https://joinmastodon.org", badge: "Social" },
    "fb.com": { name: "Mastodon", desc: "Federated social network", url: "https://joinmastodon.org", badge: "Social" },
    "instagram.com": { name: "Pixelfed", desc: "Federated photo sharing", url: "https://pixelfed.org", badge: "Photos" },
    "twitter.com": { name: "Bluesky / Mastodon", desc: "Open microblogging", url: "https://bsky.app", badge: "Microblog" },
    "x.com": { name: "Bluesky / Mastodon", desc: "Open microblogging", url: "https://bsky.app", badge: "Microblog" },
    "linkedin.com": { name: "OpenResume / LinkedIn Alternatives", desc: "Personal portfolio & networking", url: "https://www.open-resume.com", badge: "Career" },
    "whatsapp.com": { name: "Signal", desc: "Private messaging", url: "https://signal.org", badge: "Messaging" },
    "reddit.com": { name: "Lemmy", desc: "Federated link aggregator", url: "https://join-lemmy.org", badge: "Forum" },
    "tiktok.com": { name: "Loops", desc: "Short-form video alternative", url: "https://loops.video", badge: "Video" },
    "pinterest.com": { name: "PixelFed", desc: "Image-focused social network", url: "https://pixelfed.org", badge: "Images" },
    "snapchat.com": { name: "Signal", desc: "Private messaging with stories", url: "https://signal.org", badge: "Messaging" },
    "gmail.com": { name: "Proton Mail", desc: "Encrypted email", url: "https://proton.me/mail", badge: "Email" },
    "drive.google.com": { name: "Nextcloud", desc: "Self-hosted cloud storage", url: "https://nextcloud.com", badge: "Cloud" },
    "maps.google.com": { name: "OpenStreetMap", desc: "Community-driven maps", url: "https://www.openstreetmap.org", badge: "Maps" },
    "news.google.com": { name: "Feedbin / Inoreader", desc: "RSS aggregator", url: "https://feedbin.com", badge: "News" },
    "messenger.com": { name: "Signal", desc: "Private messaging", url: "https://signal.org", badge: "Messaging" },
    "wechat.com": { name: "Signal", desc: "Private messaging", url: "https://signal.org", badge: "Messaging" },
    "telegram.org": { name: "Signal", desc: "More secure messaging", url: "https://signal.org", badge: "Messaging" }
};

// Try to detect which blocked site they came from
let originalHost = "social media";
const referrer = document.referrer;

if (referrer) {
    try {
        const url = new URL(referrer);
        originalHost = url.hostname.replace(/^www\./, '');
    } catch(e) {
        console.error('Failed to parse referrer:', e);
    }
}

// Find a matching alternative
let matchedAlt = null;
for (let [domain, alt] of Object.entries(alternatives)) {
    if (originalHost.includes(domain)) {
        matchedAlt = alt;
        break;
    }
}

const container = document.getElementById('alternatives-list');

if (matchedAlt) {
    // Show specific recommendation
    container.innerHTML = `
        <div class="card">
            <div class="badge">🎯 Recommended for ${originalHost}</div>
            <h3>${matchedAlt.name}</h3>
            <p>${matchedAlt.desc}</p>
            <a href="${matchedAlt.url}" target="_blank" rel="noopener noreferrer">Visit ${matchedAlt.name} →</a>
        </div>
    `;
} else {
    // Show general alternatives
    const generalAlts = [
        { name: "SearXNG", desc: "Privacy search engine", url: "https://searx.space", badge: "Search" },
        { name: "Mastodon", desc: "Decentralized Twitter alternative", url: "https://joinmastodon.org", badge: "Social" },
        { name: "Signal", desc: "Secure messaging", url: "https://signal.org", badge: "Chat" },
        { name: "PeerTube", desc: "YouTube alternative", url: "https://joinpeertube.org", badge: "Video" },
        { name: "Lemmy", desc: "Reddit-like forum", url: "https://join-lemmy.org", badge: "Forum" },
        { name: "Nextcloud", desc: "Google Drive alternative", url: "https://nextcloud.com", badge: "Cloud" },
        { name: "Proton Mail", desc: "Private email service", url: "https://proton.me/mail", badge: "Email" },
        { name: "OpenStreetMap", desc: "Maps alternative", url: "https://www.openstreetmap.org", badge: "Maps" }
    ];
    
    container.innerHTML = generalAlts.map(alt => `
        <div class="card">
            <div class="badge">✨ Alternative</div>
            <h3>${alt.name}</h3>
            <p>${alt.desc}</p>
            <a href="${alt.url}" target="_blank" rel="noopener noreferrer">Explore →</a>
        </div>
    `).join('');
}