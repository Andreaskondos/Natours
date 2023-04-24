/* eslint-disable */

export const renderMap = function (locations) {
  let map = L.map("map", {
    scrollWheelZoom: false,
    closePopupOnClick: false,
    zoom: 13,
    zoomControl: false,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    crossOrigin: "",
  }).addTo(map);

  const myIcon = L.icon({
    iconUrl: "../img/pin.png",
    iconSize: [25, 30],
    iconAnchor: [12.5, 30],
  });

  // const allPoints = [];
  const bounds = new L.latLngBounds();

  locations.forEach((loc) => {
    const latlng = [...loc.coordinates].reverse();

    // allPoints.push(latlng);
    bounds.extend(latlng);

    const curPopup = L.popup(latlng, {
      content: `<p>Day ${loc.day} : ${loc.description}</p>`,
      autoClose: false,
      offset: [0, -10],
      closeButton: false,
    });

    L.marker(latlng, {
      icon: myIcon,
    })
      .addTo(map)
      .bindPopup(curPopup);
    // .openPopup();

    curPopup.openOn(map);
  });

  // const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds, {
    paddingTopLeft: [100, 200], // its reversed its first value is Left and then Top
    paddingBottomRight: [100, 100], // its reversed its first value is Right and then Bottom
  });
};
