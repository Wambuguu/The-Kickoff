const competitionList = document.getElementById("competition-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filters button");
const searchFilterButton = document.getElementById("search-filter-btn");

// Function to display competition data in a card
function displayCompetition(competition) {
  const card = document.createElement("div");
  card.classList.add("competition-card");
  card.innerHTML = `<h3>${competition.name}</h3><p>${competition.area.name}</p>`;
  // Add event listener to the entire card for click events
  card.addEventListener("click", () => {
    // Fetch detailed competition information using competition.id
    const competitionId = competition.id;
    fetch(`https://api.football-data.org/v4/competitions/${competitionId}`)
      .then((response) => response.json())
      .then((data) => {
        updateCardDetails(card, data); // Call updateCardDetails to update card with detailed information
      })
      .catch((error) => console.error(error));
  });

  competitionList.appendChild(card);
}

// Function to fetch competition data from API
function fetchCompetitionData() {
  fetch("https://api.football-data.org/v4/competitions")
    .then((response) => response.json())
    .then((data) => {
      const competitions = data.competitions;
      window.competitions = competitions; // Store for later access (search/filter)
      filterCompetitions(competitions);
    })
    .catch((error) => console.error(error));
}

// Function to filter competitions based on search term and region
function filterCompetitions(allCompetitions, selectedRegion = "") {
  const searchTerm = searchInput.value.toLowerCase();

  let filteredCompetitions = allCompetitions;

  if (searchTerm) {
    filteredCompetitions = filteredCompetitions.filter((competition) =>
      competition.name.toLowerCase().includes(searchTerm)
    );
  }

  if (selectedRegion && selectedRegion !== "all") {
    filteredCompetitions = filteredCompetitions.filter(
      (competition) => competition.area.name.toLowerCase() === selectedRegion
    );
  }
  competitionList.innerHTML = ""; // Clear previous list
  filteredCompetitions.forEach((competition) =>
    displayCompetition(competition)
  );
}

// Event listener for search & filter button
searchFilterButton.addEventListener("click", () => {
  filterCompetitions(window.competitions);
});

// Event listener for each filter button
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const selectedRegion = button.innerText.toLowerCase();
    filterCompetitions(window.competitions, selectedRegion);
  });
});

function updateCardDetails(card, competitionData) {
  // Create and append the name and area of the competition
  const title = document.createElement("h3");
  title.textContent = competitionData.name;
  card.appendChild(title);

  // Add area details
  const area = document.createElement("p");
  area.textContent = `Area: ${competitionData.area.name}`;
  card.appendChild(area);

  // Create and append the details container
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-container");

  // Create and append the details list
  const detailsList = document.createElement("ul");
  detailsList.classList.add("details-list");

  // Add code details
  const codeItem = document.createElement("li");
  codeItem.textContent = `Code: ${competitionData.code}`;
  detailsList.appendChild(codeItem);

  // Add flag details available
  if (competitionData.area.flag) {
    const flagItem = document.createElement("li");
    flagItem.innerHTML = `<strong>Flag:</strong><img src="${competitionData.area.flag}" alt="Flag">`;
    detailsList.appendChild(flagItem);
  }

  // Add type details
  const typeItem = document.createElement("li");
  typeItem.textContent = `Type: ${competitionData.type}`;
  detailsList.appendChild(typeItem);

  // Add emblem details if available
  if (competitionData.emblem) {
    const emblemItem = document.createElement("li");
    emblemItem.innerHTML = `<strong>Emblem:</strong><img src="${competitionData.emblem}" alt="Emblem">`;
    detailsList.appendChild(emblemItem);
  }

  // Add plan details
  const planItem = document.createElement("li");
  planItem.textContent = `Plan: ${competitionData.plan}`;
  detailsList.appendChild(planItem);

  // Add current season details
  const currentSeason = competitionData.currentSeason;
  const currentSeasonItem = document.createElement("li");
  currentSeasonItem.innerHTML = `<strong>Current Season:</strong>
    <ul>
      <li>Start Date: ${currentSeason.startDate}</li>
      <li>End Date: ${currentSeason.endDate}</li>
      <li>Current Matchday: ${currentSeason.currentMatchday}</li>
    </ul>`;
  detailsList.appendChild(currentSeasonItem);
}
