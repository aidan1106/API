/**
 * Async function to get the data from the API
 * @param {string[]} urls - array of URLs to fetch data from
 * @returns {Promise} - returns a promise that resolves to an array of results
 */
async function getSwapiData(urls) {
    try {
        const fetchPromises = urls.map(url => {
            console.log(`Fetching data from: ${url}`); // Debug log
            return fetch(url).then(response => response.json());
        });
        const results = await Promise.all(fetchPromises);
        console.log('API Responses:', results); // Debug log
        return results;
    } catch (err) {
        console.error("Error: ", err);
        return [];
    }
}

async function init() {
    const domElement = document.getElementById("driver-details");

    // Get the driver ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('id');
    console.log('Driver ID:', driverId); // Debug log

    // Fetch data from the API using the driver ID
    const [driver] = await getSwapiData([`https://api.openf1.org/v1/drivers?driver_number=${driverId}&session_key=9158`]);

    // Check if data is received
    if (driver && driver.length > 0) {
        const driverData = driver[0]; // Assuming the API returns an array

        const ul = document.createElement("ul");

        const img = document.createElement("img");
        img.src = driverData.headshot_url;
        img.alt = `Headshot of ${driverData.full_name}`;

        const liName = document.createElement("ul");
        liName.classList.add("driver-info", "driver-name"); // Add classes for styling
        liName.textContent = `${driverData.full_name}`;

        const liTeam = document.createElement("ul");
        liTeam.classList.add("driver-info"); // Add the class for styling
        liTeam.textContent = `Team: ${driverData.team_name}`;

        const liCountry = document.createElement("ul");
        liCountry.classList.add("driver-info"); // Add the class for styling
        liCountry.textContent = `Country: ${driverData.country_code}`;

        const liNumber = document.createElement("ul");
        liNumber.classList.add("driver-info"); // Add the class for styling
        liNumber.textContent = `Driver Number: ${driverData.driver_number}`;

        const liAcronym = document.createElement("ul");
        liAcronym.classList.add("driver-info"); // Add the class for styling
        liAcronym.textContent = `Name Acronym: ${driverData.name_acronym}`;

        const liImage = document.createElement("ul");
        liImage.appendChild(img);

        ul.append(liName, liImage, liTeam, liCountry, liNumber, liAcronym);
        domElement.appendChild(ul);
    } else {
        // If no data, display a message
        domElement.textContent = "No data found.";
    }
}

// Call the init function to start the program
init();
