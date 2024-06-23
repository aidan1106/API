/**
 * Async function to get the data from the API
 * @returns - returns a promise
 */
async function getSwapiData(url) {
    try {
        console.log(`Fetching data from: ${url}`); // Debug log
        let response = await fetch(url);
        let character = await response.json();
        console.log('API Response:', character); // Debug log
        return character;
    } catch (err) {
        console.error("Error: ", err);
    }
}

let currentPage = 0;
const teamsPerPage = 1; // 1 team per page
const driversPerTeam = 2; // Only show 2 drivers per team
let data = [];
let teamData = [];

async function init() {
    const domElement = document.getElementById("drivers");

    // Fetch data from the API
    data = await getSwapiData("https://api.openf1.org/v1/drivers");

    // Group drivers by team
    teamData = groupDriversByTeam(data);

    // Check if data is received
    if (teamData.length > 0) {
        renderPage();
    } else {
        // If no data, display a message
        domElement.textContent = "No data found.";
    }
}

function groupDriversByTeam(drivers) {
    const teams = {};
    drivers.forEach(driver => {
        if (!teams[driver.team_name]) {
            teams[driver.team_name] = [];
        }
        teams[driver.team_name].push(driver);
    });

    // Convert the teams object into an array of teams
    const teamArray = [];
    for (const team in teams) {
        if (teams[team].length > 0) {
            teamArray.push(teams[team]);
        }
    }
    return teamArray;
}

function renderPage() {
    const domElement = document.getElementById("drivers");
    const teamNameElement = document.getElementById("team-name");
    domElement.innerHTML = ''; // Clear previous content

    // Calculate the start and end indices for the teams on the current page
    const start = currentPage * teamsPerPage;
    const end = start + teamsPerPage;

    // Loop through the teams for the current page
    for (let i = start; i < end && i < teamData.length; i++) {
        const team = teamData[i];

        // Update the team name in the central div
        teamNameElement.textContent = team[0].team_name; // Assuming all drivers have the same team_name

        // Create a list for the drivers
        const ul = document.createElement("ul");

        team.slice(0, driversPerTeam).forEach(driver => { // Show only up to 2 drivers per team
            const li = document.createElement("li");

            // Create an anchor element for the link
            const a = document.createElement("a");
            a.href = `driverDetails.html?id=${driver.driver_number}`;

            // Create an img element for the headshot
            const img = document.createElement("img");
            img.src = driver.headshot_url;
            img.alt = `Headshot of ${driver.full_name}`;

            // Append the img to the anchor element
            a.appendChild(img);

            // Create an anchor element for the name link
            const aName = document.createElement("a");
            aName.href = `driverDetails.html?id=${driver.driver_number}`;
            aName.textContent = driver.full_name;

            // Append the anchor elements to the li
            li.append(a);
            li.append(aName);

            ul.append(li);
        });

        domElement.append(ul);
    }

    updateButtons();
}

function updateButtons() {
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");

    // Disable "Previous" button if on the first page
    prevButton.disabled = currentPage === 0;

    // Disable "Next" button if on the last page
    nextButton.disabled = (currentPage + 1) * teamsPerPage >= teamData.length;
}

document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
    }
});

document.getElementById("next-button").addEventListener("click", () => {
    if ((currentPage + 1) * teamsPerPage < teamData.length) {
        currentPage++;
        renderPage();
    }
});

// Call the init function to start the program
init();
