import hospital from './hospitals.json' assert {type: 'json'}; // get hospital data w/o fetch
hospital_data = JSON.parse(hospital);

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

function fetchAllHospitals() { // TODO
    
    return response;
}

function coordinatesToMiles(long1, lat1, long2, lat2) {
    distance = sqrt((long2 - long1) ** 2 + (lat2 - lat1) ** 2);
    distance *= 60
    return distance;
}

function findHospitalsNear(longitude, latitude, count) {
    hospital_data = findHospitals()

}