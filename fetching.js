
// general params

MAX_RADIUS = 20; // in miles
MAX_HOSPITALS = 5;

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
    // console.log(hospital_data);
    return hospital_data;
}

function findDistance(long1, lat1, long2, lat2) {
    distance = (long2 - long1) ** 2 + (lat2 - lat1) ** 2;
    distance *= 60
    return distance;
}

async function findHospitalsNear(longitude, latitude, count) { // TODO make sure to do everything that uses this data within an async function
    // TODO get location here
    hospital_data = await fetchAllHospitals();
    hospital_data.sort((a,b) => findDistance(a['lng'], b['lat'], longitude, latitude))
    hospitals = [];
    for (i in hospital_data) {
        if (hospitals.length >= count ) break; //|| coordinatesToMiles(longitude, latitude, i["lng"], i["lat"])
        if (hospital_data[i]['type_id'] == 3) continue;
        hospitals.push(hospital_data[i]);
    }
    return hospitals;
}

function process_hospital_name(name) {
    name = name.replaceAll('(', '');
    name = name.replaceAll('- ', '');
    name = name.replaceAll(' ', '-');
    return name;
}

function get_hospital_wait(hospital_data) {
    fetch(one_hospital_api + '/' + hospital_data['hospital_id'] + '/' + process_hospital_name(hospital_data['hospital_name'])).then((response) => response.json());
    hospital_data = JSON.parse(response.json);

    return hospital_data;
}

// console.log('process_hospital_name of "Doctors On Duty - Seaside" : ' + process_hospital_name("Doctors On Duty - Seaside"));
findHospitalsNear(37.396283, -122.115551, 5).then((response) => console.log(response));
