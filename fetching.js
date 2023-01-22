// general params

const MAX_RADIUS = 0.33; // in miles
const MAX_HOSPITALS = 5;

// API KEYS

// ertrack api
all_hospitals_api = "./all_hospitals.json";
// one_hospital_api = "https://ertrack.net/api/hospital";
// hospital_data = "/metadata/";
hospital_wait_url = "https://ertrack.net/";

// maps data api

//...
function pivotImplementation(arr, start, end) {
    const pivotValue = arr[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        if (arr[i]["dist"] > pivotValue) {
            [arr[i]["dist"], arr[pivotIndex]["dist"] = [arr[pivotIndex]["dist"], arr[i]["dist"]]];
            pivotIndex++;
        }
    }
    [arr[pivotIndex]["dist"], arr[end]["dist"] = [arr[end]["dist"], arr[pivotIndex]["dist"]]];
    return pivotIndex;
}

function qsRecursive(arr, start, end) {
    if (start >= end) {
        return;
    }

    let index = pivotImplementation(arr, start, end);

    qsRecursive(arr, start, index - 1);
    qsRecursive(arr, index + 1, end);
}

// getting hospitals

async function fetchAllHospitals() {
    const response = await fetch(all_hospitals_api);
    hospital_data = await response.json();
    for (i in hospital_data) {
        if (hospital_data[i]["lng"] == 0 || hospital_data[i]["lng"] == "None") {
            hospital_data[i]["lng"] = Number.MAX_SAFE_INTEGER;
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
    return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

function updateDistance(longitude, latitude, hospital_data) {
    // console.log(longitude);
    // console.log(latitude);
    for (i in hospital_data) {
        hospital_data[i]["dist"] = getDistance(
            parseFloat(hospital_data[i]["lat"]),
            hospital_data[i]["lng"],
            latitude,
            longitude
        );
    }
    return hospital_data;
}

async function findHospitalsNear(longitude, latitude, count) {
    // TODO make sure to do everything that uses this data within an async function
    // TODO get location here
    hospital_data = await fetchAllHospitals();
    // console.log(longitude, latitude);
    hospital_data = updateDistance(longitude, latitude, hospital_data);
    hospital_data = await update_wait_times(hospital_data);
    // hospital_data.sort((a,b) => a["dist"] - b["dist"]);
    // qsRecursive(hospital_data, 0, hospital_data.length - 1)
    hospital_data.sort((a,b) => a["dist"] - b["dist"]);
    // hospital_data.reverse();
    // console.log(hospital_data);
    hospitals = [];
    for (i in hospital_data) {
        if (hospitals.length >= count) break; //|| coordinatesToMiles(longitude, latitude, i["lng"], i["lat"])
        if (hospital_data[i]["wait"] != "closed" && hospital_data[i]["dist"] <= MAX_RADIUS) hospitals.push(hospital_data[i]);
    }
    return hospitals;
}

function process_hospital_name(name) {
    name = name.replaceAll("(", "");
    name = name.replaceAll("- ", "");
    name = name.replaceAll(" ", "-");
    name = name.toLowerCase();
    return name;
}

// async function get_hospital_wait(hospital_data) {
//     url =  hospital_wait_url + hospital_data['hospital_id'] + '/' + process_hospital_name(hospital_data['hospital_name']);

//     // await fetch(hospital_wait_url);
//     console.log(url);
//     const response = await fetch(url);
//     hospital_data = await response.text();
//     return hospital_data;
// }

async function update_wait_times(ext_hospital_data) {
    const response = await fetch(hospital_wait_url);
    hospital_data = await response.text();
    i = hospital_data.indexOf("var data = ") + 11;
    hospital_data_raw = "";
    while (hospital_data[i - 1] != "}") {
        hospital_data_raw += hospital_data[i];
        i++;
    }
    hospital_data_json = JSON.parse(hospital_data_raw); // the 6th index is the wait time
    for (i = 0; i < ext_hospital_data.length; i++) {
        // console.log(ext_hospital_data[i]["hospital_id"]);
        try {
            ext_hospital_data[i]["wait"] =
                hospital_data_json[ext_hospital_data[i]["hospital_id"]][6];
        } catch (e) {
            ext_hospital_data[i]["wait"] = "closed";
        }
    }

    return ext_hospital_data;
}

// findHospitalsNear(-122.125654, 37.361915, 5).then((response) => console.log(response));
