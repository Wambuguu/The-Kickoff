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
