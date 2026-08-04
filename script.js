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

    document.getElementById("current-date").textContent = `📅 ${date}`;
    document.getElementById("vn-time").textContent = `🇻🇳 Vietnam     ${vn}`;
    document.getElementById("us-time").textContent = `🇺🇸 New York    ${us}`;
}

updateClock();
setInterval(updateClock, 1000);

const particles = document.querySelectorAll(".particles span");

particles.forEach((particle)=>{

    particle.style.left=Math.random()*100+"%";

    particle.style.animationDuration=
        (10+Math.random()*15)+"s";

    particle.style.animationDelay=
        (-Math.random()*20)+"s";

    particle.style.opacity=
        0.3+Math.random()*0.7;

    const size=2+Math.random()*4;

    particle.style.width=size+"px";
    particle.style.height=size+"px";

});

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
