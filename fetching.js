
// general params

MAX_RADIUS = 20; // in miles
MAX_HOSPITALS = 5;

// API KEYS

// ertrack api
all_hospitals_api = "https://ertrack.net/api/hospitals/"
one_hospital_api = "https://ertrack.net/api/hospital/"
hospital_data = "/metadata/"
hospital_wait = "/history/"

// maps data api

//...



// api fetching functions

function fetchAllHospitals() {
    fetch(all_hospitals_api).then((response) => response.json());
    hospital_data = JSON.parse(response.json);
    return hospital_data;
}

function coordinatesToMiles(long1, lat1, long2, lat2) {
    distance = sqrt((long2 - long1) ** 2 + (lat2 - lat1) ** 2);
    distance *= 60
    return distance;
}

function findHospitalsNear(longitude, latitude, count) {
    // TODO get location here
    hospital_data = fetchAllHospitals()
    hospital_data.sort((a,b) => coordinatesToMiles(a.longitude, b.latitude, longitude, latitude))
    hospitals = [];

    for (i in hospital_data) {
        if (hospitals.length >= count || coordinatesToMiles(longitude, latitude, i["lng"], i["lat"])) break;
        if (i['type_id'] == 3) continue;
    }

    return hospitals;

}