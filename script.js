const competitionList = document.getElementById("competition-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filters button");
const searchFilterButton = document.getElementById("search-filter-btn");

// Function to display competition data in a card
function displayCompetition(competition) {
  const card = document.createElement("div");
  card.classList.add("competition-card");
  card.innerHTML = `<h3>${competition.name}</h3>`;

  // Add custom attribute to indicate whether card is expanded or not
  card.setAttribute("data-expanded", "false");

  // Add event listener to the entire card for click events
  card.addEventListener("click", () => {
    const isExpanded = card.getAttribute("data-expanded") === "true";
    if (!isExpanded) {
      updateCardDetails(card, competition); // Call updateCardDetails to update card with detailed information
      card.setAttribute("data-expanded", "true"); // Update custom attribute
    }
  });

  competitionList.appendChild(card);
}

// Function to fetch all competition data from API
function fetchCompetitionData() {
  fetch("https://football-api-sage.vercel.app/db.json")
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

// Event listener for each filter button
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    // Update selected region based on clicked button text
    const selectedRegion = button.innerText.toLowerCase();

    // Call filterCompetitions with updated region
    filterCompetitions(window.competitions, selectedRegion);
  });
});

// Event listener for search & filter button
searchFilterButton.addEventListener("click", () => {
  filterCompetitions(window.competitions);
});

function updateCardDetails(card, competition) {
  // Add area details
  const area = document.createElement("p");
  area.textContent = `Area: ${competition.area.name}`;
  card.appendChild(area);

  // Add flag details if available
  if (competition.area.flag) {
    const flagItem = document.createElement("p");
    flagItem.innerHTML = `<strong>Flag</strong> <img src="${competition.area.flag}" alt="Flag">`;
    card.appendChild(flagItem);
  }
  
  // Add code details
  if (competition.code) {
    const codeItem = document.createElement("p");
    codeItem.innerHTML = `Code: ${competition.code}`;
    card.appendChild(codeItem);
  }

  // Add type details
  const typeItem = document.createElement("p");
  typeItem.textContent = `Type: ${competition.type}`;
  card.appendChild(typeItem);

  // Add emblem details if available
  if (competition.emblem) {
    const emblemItem = document.createElement("p");
    emblemItem.innerHTML = `<strong>Emblem</strong> <img src="${competition.emblem}" alt="Emblem">`;
    card.appendChild(emblemItem);
  }
  
  // Add plan details
  const planItem = document.createElement("p");
  planItem.textContent = `Plan: ${competition.plan}`;
  card.appendChild(planItem);

  // Add current season details
  const currentSeason = competition.currentSeason;
  const currentSeasonItem = document.createElement("p");
  currentSeasonItem.innerHTML = `<strong>Current Season:</strong>
    <ul>
      <li>Start Date: ${currentSeason.startDate}</li>
      <li>End Date: ${currentSeason.endDate}</li>
      <li>Current Matchday: ${currentSeason.currentMatchday}</li>
    </ul>`;
  card.appendChild(currentSeasonItem);

  // Add winner details if available
  if (currentSeason.winner) {
    const winnerItem = document.createElement("p");
    winnerItem.innerHTML = `<strong>Winner:</strong>
    <ul>
      <li>Name: ${currentSeason.winner.name}</li>
      <li>Short Name: ${currentSeason.winner.shortName}</li>
      <li>TLA: ${currentSeason.winner.tla}</li>
      <strong>Crest</strong> <img src="${currentSeason.winner.crest}" alt="Crest">
      <li>Address: ${currentSeason.winner.address}</li>
      <li>Website: <a href="${currentSeason.winner.website}">${currentSeason.winner.website}</a></li>
      <li>Founded: ${currentSeason.winner.founded}</li>
      <li>Club Colors: ${currentSeason.winner.clubColors}</li>
      <li>Venue: ${currentSeason.winner.venue}</li>
    </ul>`;
    card.appendChild(winnerItem);
  }

  // Add numberOfAvailableSeasons details
  const availableSeasonsItem = document.createElement("p");
  availableSeasonsItem.textContent = `Number of Available Seasons: ${competition.numberOfAvailableSeasons}`;
  card.appendChild(availableSeasonsItem);

  // Add lastUpdated details
  const lastUpdatedItem = document.createElement("p");
  lastUpdatedItem.textContent = `Last Updated: ${competition.lastUpdated}`;
  card.appendChild(lastUpdatedItem);
}

// Call fetchCompetitionData on page load
fetchCompetitionData();
