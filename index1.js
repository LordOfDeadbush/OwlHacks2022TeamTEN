// general params

const MAX_RADIUS = 0.5; // in miles
const HOSPITALS = 5;

// API KEYS

// ertrack api
all_hospitals_api = "https://ertrack.net/api/hospitals/";
one_hospital_api = "https://ertrack.net/api/hospital";
hospital_data = "/metadata/";
hospital_wait_url = "https://ertrack.net/";

geocoding_url = "http://api.openweathermap.org/geo/1.0/zip?zip="
geocoding_url_2 = ",US&appid=b6f960dc7c5c11dd91fc1310192f1a94"
// hyperlink url starters

gmapsurlstart = "https://www.google.com/maps/place/";

// hospital api bs

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
    return hospital_data;
}

function getDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

function updateDistance(longitude, latitude, hospital_data) {
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
    hospital_data = await fetchAllHospitals();
    hospital_data = updateDistance(longitude, latitude, hospital_data);
    hospital_data = await update_wait_times(hospital_data);
    hospital_data.sort((a, b) => a["dist"] - b["dist"]);
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

function formatGMapsLink(s) {
    s = s.replaceAll(" ", "+");
    s = gmapsurlstart + s;
    return s;
}

function formatHospitalData(data) {
    result = "<a href= '"+ formatGMapsLink(data["address"]) + "'><div id=\"rcorners1\"><div id=\"textlight\"><h3>" + data["hospital_name"] + "</h3>";
    result += data["address"] + "<br>";
    result += "current wait time: " + String(Math.floor(parseInt("0"+data["wait"]))) + " minutes<br>";
    result += "distance: " + String(Math.round(parseFloat(data["dist"])*60)) + " miles</div></div></a>";
    return result;
}

function formatHospitalDataList(hospitals) {
    s = ""
    for (i = 0; i < hospitals.length; i++) {
        s += formatHospitalData(hospitals[i]) + "<br>";
    }
    return s
}

async function displayResultsFromLocation() {
    navigator.geolocation.getCurrentPosition((position) => 
        displayResultsFromCoords(position.coords.longitude, position.coords.latitude))
}

async function displayResultsFromCoords(lng, lat) {
    console.log("displaying results...");
    nearMe = await findHospitalsNear(lng, lat, 5);
    nearMeString = formatHospitalDataList(nearMe);
    document.getElementById("output").innerHTML = nearMeString;
}

// async function displayResultsFromZipCode() {
//     zip = document.getElementById("zip").value;
//     result = await fetch(geocoding_url + zip + geocoding_url_2);
//     result_json = result.json();
//     displayResultsFromCoords(result_json.coords["lng"], result_json.coords["lat"]);
// }

displayResultsFromLocation();
