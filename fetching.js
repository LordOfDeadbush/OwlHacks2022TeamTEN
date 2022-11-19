
// general params

const MAX_RADIUS = 20; // in miles
const MAX_HOSPITALS = 5;



// API KEYS

// ertrack api
all_hospitals_api = "https://ertrack.net/api/hospitals/"
one_hospital_api = "https://ertrack.net/api/hospital"
hospital_data = "/metadata/"
hospital_wait_url = "https://ertrack.net/"

// maps data api

//...



// getting hospitals

async function fetchAllHospitals() {
    const response = await fetch(all_hospitals_api);
    hospital_data = await response.json();
    for (i in hospital_data) {
        if (hospital_data[i]['lng'] == 0 || hospital_data[i]['lng'] == 'None') {
            hospital_data[i]['lng'] = Number.MAX_SAFE_INTEGER;
        }
    }
    // console.log(hospital_data);
    return hospital_data;
}

// function findDistance(long1, lat1, long2, lat2) {
//     distance = Math.abs(Math.sqrt(((long2 - long1) ** 2) + ((lat2 - lat1) ** 2)));
//     // distance *= 60
//     // console.log(distance);
//     return distance;
// }

function getDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(((lat1 - lat2) ** 2) + ((lng1 - lng2) ** 2));
}

function updateDistance(longitude, latitude, hospital_data) {
    console.log(longitude);
    console.log(latitude);
    for (i in hospital_data) { 
        getDistance(parseFloat(hospital_data[i]['lat']),latitude,hospital_data[i]['longitude'], longitude); 
    }
}

async function findHospitalsNear(longitude, latitude, count) { // TODO make sure to do everything that uses this data within an async function
    // TODO get location here
    hospital_data = await fetchAllHospitals();
    console.log(longitude, latitude);
    updateDistance(longitude, latitude, hospital_data);
    hospital_data.sort((a,b) => a["dist"] - b["dist"]);
    console.log(hospital_data);
    hospitals = [];
    for (i in hospital_data) {
        if (hospitals.length >= count ) break; //|| coordinatesToMiles(longitude, latitude, i["lng"], i["lat"])
        if (hospital_data[i]['type_id'] == 3) continue;
        hospitals.push(hospital_data[i]);
    }
    // console.log(hospital_data.slice(-5));
    return hospitals;
}

function process_hospital_name(name) {
    name = name.replaceAll('(', '');
    name = name.replaceAll('- ', '');
    name = name.replaceAll(' ', '-');
    name = name.toLowerCase();
    return name;
}

async function get_hospital_wait(hospital_data) {
    url =  hospital_wait_url + hospital_data['hospital_id'] + '/' + process_hospital_name(hospital_data['hospital_name']);

    // await fetch(hospital_wait_url);
    console.log(url);
    const response = await fetch(url);
    hospital_data = await response.text();
    return hospital_data;
}

// console.log('process_hospital_name of "Doctors On Duty - Seaside" : ' + process_hospital_name("Doctors On Duty - Seaside"));
// findHospitalsNear(37.396283, -122.115551, 5).then((response) => console.log(response));


demo_hospital_data = {"address":"2500 Grant Road, Mountain View, CA 94040","county":"Santa Clara County","fips":"060855099011013","hospital_id":"551","hospital_name":"Emergency Room (Mountain View)","lat":"37.3691517","lng":"-122.0795279","state":"CA","type_id":"1"}
console.log(Math.sqrt((parseFloat(demo_hospital_data["lat"]) - 0) ** 2 + (parseFloat(demo_hospital_data["lng"]) - 0) ** 2));
console.log(getDistance(37.3691517, 0, -122.0795279 , 0));
// get_hospital_wait(demo_hospital_data).then((response) => console.log(response));
