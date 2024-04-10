const competitionList = document.getElementById("competition-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filters button");
const searchFilterButton = document.getElementById("search-filter-btn");

// Function to display competition data in a card
function displayCompetition(competition) {
    const card = document.createElement("div");
    card.classList.add("competition-card");
    card.innerHTML = `<h3>${competition.name}</h3><p>${competition.area.name}</p>`;
}