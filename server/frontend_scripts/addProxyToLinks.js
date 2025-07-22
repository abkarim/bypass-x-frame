const origin = window.location.origin;

const links = document.querySelectorAll("a[href]");
links.forEach((link) => {
    // set target to self
    link.target = "_self";

    const currentLink = link.href;
    if (currentLink.startsWith(origin)) return;
    link.href = `${origin}/${currentLink}`;
});
