const origin = window.location.origin;

const links = document.querySelectorAll("a[href]");
links.forEach((link) => {
    const currentLink = link.href;
    if (currentLink.startsWith(origin)) return;
    link.href = `${origin}/${currentLink}`;
});
