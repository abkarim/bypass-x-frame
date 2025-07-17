const iframe = document.getElementsByTagName("iframe")[0];

/**
 * Get page title
 */
iframe.addEventListener("load", () => {
    document.title = iframe.title;
});
