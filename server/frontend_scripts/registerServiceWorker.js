const origin = window.location.origin;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register(`${origin}/sw.js`)
        .then((reg) => {
            if (!navigator.serviceWorker.controller) return;

            navigator.serviceWorker.controller.postMessage({
                type: "origin",
                origin,
            });
        })
        .catch((err) => console.log(err));
}
