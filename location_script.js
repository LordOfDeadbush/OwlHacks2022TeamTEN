if (Boolean(window.navigator.geolocation)) {
  window.navigator.geolocation.getCurrentPosition(
    positionCallback,
    errorCallback
  );
  function positionCallback(position) {
    const coords = position.coords;
    const longitude = coords.longitude;
    const latitude = coords.latitude;
    const accuracy = coords.accuracy;
    const altitude = coords.altitude;
    const altitudeAccuracy = coords.altitudeAccuracy;

    const heading = coords.heading;
    const speed = coords.speed;
    const time = position.timestamp;
}

function errorCallback(err) {
  let msg;
  switch (err.code) { 
    case err.PERMISSION_DENIED:
      msg = "User has denied the request for Geolocation.";
      break;
    case err.POSITION_UNAVALIABLE:
      msg = "Location info Unavailable.";
      break;
    case err.TIMEOUT:
      msg = "Requested Timed Out.";
      break;
  }
}

const id = window.navigator.geolocation.watchPosition(
  positionCallback,
  errorCallback
);

window.navigator.geolocation.clearWatch(id);


