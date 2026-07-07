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

const colors=[
"#ff2d2d",
"#ff5555",
"#ff8080",
"#ff1f1f"
];

particle.style.background=
colors[Math.floor(Math.random()*colors.length)];