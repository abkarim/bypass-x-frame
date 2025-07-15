const iFrames = [...document.querySelectorAll("iframe[bypass-x-frame]")];
const bypassAPILink = "http://localhost:3000/bypass/";

iFrames.forEach(async (frame) => {
    let link = frame.getAttribute("bypass-x-frame");

    frame.src = bypassAPILink + link;
});
