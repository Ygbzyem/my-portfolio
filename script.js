function updateClock() {

    const now = new Date();

    // Hiển thị ngày
    const date = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(now);

    // Giờ Việt Nam
    const vn = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    // Giờ New York
    const us = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    document.getElementById("current-date").textContent = date;
    document.getElementById("vn-time").textContent = vn;
    document.getElementById("us-time").textContent = us;
}

updateClock();
setInterval(updateClock, 1000);

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length && "IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach((el) => revealObserver.observe(el));

} else {
    revealEls.forEach((el) => el.classList.add("in-view"));
}

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");
const navEl = document.querySelector("header nav");

if (navToggle && navEl) {

    navToggle.addEventListener("click", () => {
        const isOpen = navEl.classList.toggle("open");
        navToggle.classList.toggle("active", isOpen);
        navToggle.setAttribute("aria-expanded", isOpen);
    });

    navList.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navEl.classList.remove("open");
            navToggle.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

}

// Light / dark toggle (Night is the default; the choice is remembered per browser)
const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    const syncLabel = () => {
        const light = document.documentElement.dataset.theme === "light";
        themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    };

    syncLabel();

    themeBtn.addEventListener("click", () => {
        const root = document.documentElement;
        const light = root.dataset.theme !== "light";
        if (light) root.dataset.theme = "light"; else delete root.dataset.theme;
        try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) { /* storage blocked */ }
        syncLabel();
    });

}

// Live Discord status from Lanyard (https://github.com/Phineas/Lanyard).
// Needs data-discord-id on #presence and the account must be in the Lanyard Discord server.
const presenceEl = document.getElementById("presence");
const discordId = presenceEl && presenceEl.dataset.discordId;

if (discordId) {

    const STATUS = { online: "Online", idle: "Away", dnd: "Do not disturb", offline: "Offline" };
    const VERB = { 0: "Playing", 1: "Streaming", 2: "Listening to", 3: "Watching", 5: "Competing in" };
    let presence = null;

    const elapsed = (start) => {
        const min = Math.floor((Date.now() - start) / 60000);
        if (min < 1) return "just now";
        return min < 60 ? `${min}\u00a0min` : `${Math.floor(min / 60)}\u00a0h ${min % 60}\u00a0min`; // no line break inside "1 h"
    };

    // Discord image keys -> URLs ("mp:" = Discord media proxy, otherwise an uploaded app asset)
    const assetUrl = (key, appId) => {
        if (!key) return "";
        if (key.startsWith("mp:")) return "https://media.discordapp.net/" + key.slice(3);
        if (key.startsWith("spotify:")) return "https://i.scdn.co/image/" + key.slice(8);
        if (/^https?:/.test(key)) return key;
        return appId ? `https://cdn.discordapp.com/app-assets/${appId}/${key}.png` : "";
    };

    // Apps detected without Rich Presence images: fall back to the app's own icon (cached per app)
    const appIcons = {};
    const appIcon = async (appId) => {
        if (!(appId in appIcons)) {
            appIcons[appId] = "";
            try {
                const r = await fetch(`https://discord.com/api/v9/applications/${appId}/rpc`);
                const app = await r.json();
                if (app.icon) appIcons[appId] = `https://cdn.discordapp.com/app-icons/${appId}/${app.icon}.png?size=96`;
            } catch (e) { /* no icon */ }
        }
        return appIcons[appId];
    };

    const art = document.getElementById("presenceArt");
    const icon = document.getElementById("presenceIcon");
    const badge = document.getElementById("presenceBadge");
    icon.onerror = () => { art.hidden = true; };
    badge.onerror = () => { badge.hidden = true; };

    const setArt = (large, small, label) => {
        if (!large) icon.removeAttribute("src");
        else if (icon.getAttribute("src") !== large) icon.src = large;
        icon.alt = label || "";
        art.hidden = !large;
        badge.hidden = !(large && small);
        if (small && badge.getAttribute("src") !== small) badge.src = small;
    };

    const render = async () => {
        if (!presence) return;
        const status = presence.discord_status || "offline";
        presenceEl.dataset.status = status;
        document.getElementById("presenceStatus").textContent = STATUS[status] || "Offline";

        let line = "", large = "", small = "", label = "";
        if (presence.listening_to_spotify && presence.spotify) {
            line = `Listening to ${presence.spotify.song} by ${presence.spotify.artist}`;
            large = presence.spotify.album_art_url || "";
            label = "Spotify";
        } else {
            // type 4 is the custom status text, not an app
            const act = (presence.activities || []).find((a) => a.type !== 4);
            if (act) {
                line = act.type === 0 ? `Using ${act.name}` : `${VERB[act.type] || ""} ${act.name}`.trim();
                if (act.details) line += ` · ${act.details}`;
                if (act.timestamps && act.timestamps.start) line += ` · ${elapsed(act.timestamps.start)}`;
                const assets = act.assets || {};
                large = assetUrl(assets.large_image, act.application_id);
                small = assetUrl(assets.small_image, act.application_id);
                if (!large && act.application_id) large = await appIcon(act.application_id);
                label = act.name;
            }
        }
        // textContent, never innerHTML: these strings come from Discord
        document.getElementById("presenceActivity").textContent = line;
        setArt(large, small, label);
        presenceEl.hidden = false;
    };

    const load = async () => {
        try {
            const r = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
            const j = await r.json();
            if (j.success) { presence = j.data; render(); }
        } catch (e) { /* offline or Lanyard down: keep the last state */ }
    };

    load();
    setInterval(load, 30000);   // refresh status every 30 s
    setInterval(render, 15000); // keep the elapsed time moving between refreshes

}
