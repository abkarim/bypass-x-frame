if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register(`${window.location.origin}/sw.js`)
        .then((reg) => {
            if (!navigator.serviceWorker.controller) return;
        })
        .catch((err) => console.log(err));
}
