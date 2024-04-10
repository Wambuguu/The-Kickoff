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
      // Fetch detailed competition information using competition.id
      const competitionId = competition.id;
      fetch(`http://localhost:3000/competitions/${competitionId}`)
        .then((response) => response.json())
        .then((data) => {
          updateCardDetails(card, data); // Call updateCardDetails to update card with detailed information
          card.setAttribute("data-expanded", "true"); // Update custom attribute
        })
        .catch((error) => console.error(error));
    }
  });

  competitionList.appendChild(card);
}

// Function to fetch competition data from API
function fetchCompetitionData() {
  // const apiUrl = "./db.json"; // Update based on your needs
  fetch("./db.json")
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
    const selectedRegion = button.innerText.toLowerCase();
    filterCompetitions(window.competitions, selectedRegion);
  });
});

// Event listener for search & filter button
searchFilterButton.addEventListener("click", () => {
  filterCompetitions(window.competitions);
});

// Call fetchCompetitionData on page load
fetchCompetitionData();

function updateCardDetails(card, competitionData) {
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

  // Add winner details
  if (currentSeason.winner) {
    const winnerItem = document.createElement("li");
    winnerItem.innerHTML = `<strong>Winner:</strong>
      <ul>
        <li>Name: ${currentSeason.winner.name}</li>
        <li>Short Name: ${currentSeason.winner.shortName}</li>
        <li>TLA: ${currentSeason.winner.tla}</li>
        <li>Crest: <img src="${currentSeason.winner.crest}" alt="Crest"></li>
        <li>Address: ${currentSeason.winner.address}</li>
        <li>Website: <a href="${currentSeason.winner.website}">${currentSeason.winner.website}</a></li>
        <li>Founded: ${currentSeason.winner.founded}</li>
        <li>Club Colors: ${currentSeason.winner.clubColors}</li>
        <li>Venue: ${currentSeason.winner.venue}</li>
      </ul>`;
    detailsList.appendChild(winnerItem);
  }

  // Add numberOfAvailableSeasons details
  const availableSeasonsItem = document.createElement("li");
  availableSeasonsItem.textContent = `Number of Available Seasons: ${competitionData.numberOfAvailableSeasons}`;
  detailsList.appendChild(availableSeasonsItem);

  // Add lastUpdated details
  const lastUpdatedItem = document.createElement("li");
  lastUpdatedItem.textContent = `Last Updated: ${competitionData.lastUpdated}`;
  detailsList.appendChild(lastUpdatedItem);
  // Append the details list to the details container
  detailsContainer.appendChild(detailsList);

  // Append the details container to the card
  card.appendChild(detailsContainer);
}
