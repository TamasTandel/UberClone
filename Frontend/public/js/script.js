document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const map = L.map("map").setView([0, 0], 2);

    // OpenStreetMap Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Created by TamasTandel',
        maxZoom: 19,
    }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });

            // Update map view and add marker
            map.setView([latitude, longitude], 15);
            L.marker([latitude, longitude]).addTo(map);
        });
    }

    socket.on("receive-location", (data) => {
        console.log("Other users' locations:", data.users);
    });
});
