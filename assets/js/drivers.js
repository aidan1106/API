/**
 * Async function to get the data from the SWAPI api
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

let currentPage = 0;
const driversPerPage = 2;
let data = [];

async function init() {
  const domElement = document.getElementById("drivers");

  // Define the URL to fetch
  const url = "https://api.openf1.org/v1/drivers";

  // Fetch data from the API
  const [driversData] = await getSwapiData([url]);

  // Check if data is received
  if (driversData.length > 0) {
      data = driversData;
      renderPage();
  } else {
      // If no data, display a message
      domElement.textContent = "No data found.";
  }
}

function renderPage() {
  const domElement = document.getElementById("drivers");
  domElement.innerHTML = ''; // Clear previous content

  // Calculate the start and end indices for the drivers on the current page
  const start = currentPage * driversPerPage;
  const end = start + driversPerPage;

  // Loop through the drivers for the current page
  for (let i = start; i < end && i < data.length; i++) {
      const ul = document.createElement("ul");
      const character = data[i];
      const li = document.createElement("li");

      // Create an anchor element for the link
      const a = document.createElement("a");
      a.href = `driverDetails.html?id=${character.driver_number}`;

      // Create an img element for the headshot
      const img = document.createElement("img");
      img.src = character.headshot_url;
      img.alt = `Headshot of ${character.full_name}`;

      // Append the img to the anchor element
      a.appendChild(img);

      // Create an anchor element for the name link
      const aName = document.createElement("a");
      aName.href = `driverDetails.html?id=${character.driver_number}`;
      aName.textContent = character.full_name;

      // Append the anchor elements to the li
      li.append(a);
      li.append(aName);

      ul.append(li);
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
  nextButton.disabled = (currentPage + 1) * driversPerPage >= data.length;
}

document.getElementById("prev-button").addEventListener("click", () => {
  if (currentPage > 0) {
      currentPage--;
      renderPage();
  }
});

document.getElementById("next-button").addEventListener("click", () => {
  if ((currentPage + 1) * driversPerPage < data.length) {
      currentPage++;
      renderPage();
  }
});

// Call the init function to start the program
init();
