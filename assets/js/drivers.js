/**
 * Async function to get the data from the SWAPI api
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
const driversPerPage = 2;
let data = [];

async function init() {
  const domElement = document.getElementById("drivers");

  // Fetch data from the API
  data = await getSwapiData("https://api.openf1.org/v1/drivers");

  // Check if data is received
  if (data.length > 0) {
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
