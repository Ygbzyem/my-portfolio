function updateClock(){

    const now = new Date();

    const vn = new Intl.DateTimeFormat("en-US",{
        timeZone:"Asia/Ho_Chi_Minh",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
    }).format(now);

    const us = new Intl.DateTimeFormat("en-US",{
        timeZone:"America/New_York",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
    }).format(now);

    document.getElementById("vn-time").textContent =
        `🇻🇳 Vietnam ${vn}`;

    document.getElementById("us-time").textContent =
        `🇺🇸 New York ${us}`;
}

updateClock();

setInterval(updateClock,1000);