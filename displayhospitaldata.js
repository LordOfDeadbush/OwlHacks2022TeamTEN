function formatHospitalData(data) {
    result = data["hospital_name"] + "\n";
    result += data["address"] + "\n";
    result += "current wait: " + data["wait"] + "\n";
    return result;
}

data = {"address":"120 Healthplex Way Apex, NC 27520 919-350-8000","county":"Wake County","fips":"371830534151053","hospital_id":"530","hospital_name":"Apex Healthplex ER","lat":"35.7389142","lng":"-78.8677328","state":"NC","type_id":"1"}

console.log(formatHospitalData(data));