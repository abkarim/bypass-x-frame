const iFrames = [...document.querySelectorAll('iframe[bypass-x-frame]')];

/**
 * Get content of iframe
 * @param {string} url - target page url 
 */
async function getIFrameContent(url) {
    let data = await fetch("https://cors-anywhere.herokuapp.com/" + url, {
        method: 'GET',
    }).then(
        response => response.text()
    )
    return data;
}

iFrames.forEach(async frame => {
    let link = frame.getAttribute('bypass-x-frame');
    let html = await getIFrameContent(link)

    /**
     * Modify url for files. eg: .img, .css
     * Get all links
     */
  

    // Set html in iframe
    frame.srcdoc = html;
})
