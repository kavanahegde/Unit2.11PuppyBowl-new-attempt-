
const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below
const cohortName = "2308-acc-et-web-pt-a";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const result = await response.json();
    console.log("result.data.players", result.data.players);
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`);
    const result = await response.json();
    console.log("Single Player:", result);
    return result;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const result = await response.json();
    console.log("New Player Added:", result);
    return result;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log("Player Removed:", result);
    return result;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
  try {
    let playerContainerHTML = "";
    playerList.forEach((puppy) => {
      let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${puppy.name}</p>
          <p class="pup-number">${puppy.id}</p>
        </div>
        <img src=${puppy.imageUrl} alt="photo of ${puppy.name}">
        <button class="details-button" onclick="showPlayerDetails(${puppy.id})">See details</button>
        <button class="remove-button" onclick="removePlayerFromRoster(${puppy.id})">Remove from roster</button>
      </div>
      `;
      playerContainerHTML += pupHTML;
    });
    playerContainer.innerHTML = playerContainerHTML;
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    newPlayerFormContainer.innerHTML = `
      <form id="new-player-form">
        <input type="text" id="player-name" placeholder="Enter player name">
        <input type="text" id="player-image" placeholder="Enter player image URL">
        <button type="submit">Add Player</button>
      </form>
    `;
    newPlayerFormContainer.addEventListener("submit", async (event) => {
      event.preventDefault();
      const playerName = document.getElementById("player-name").value;
      const playerImage = document.getElementById("player-image").value;
      if (playerName && playerImage) {
        const newPlayer = await addNewPlayer({
          name: playerName,
          imageUrl: playerImage,
        });
        const updatedPlayers = await fetchAllPlayers();
        renderAllPlayers(updatedPlayers);
      } else {
        alert("Please enter both player name and image URL.");
      }
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const showPlayerDetails = async (playerId) => {
  try {
    const playerDetails = await fetchSinglePlayer(playerId);
    console.log("Player Details:", playerDetails);
    // You can handle showing player details in your application UI here
  } catch (err) {
    console.error(`Oh no, trouble fetching details for player #${playerId}!`, err);
  }
};

const removePlayerFromRoster = async (playerId) => {
  try {
    await removePlayer(playerId);
    const updatedPlayers = await fetchAllPlayers();
    renderAllPlayers(updatedPlayers);
  } catch (err) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
  }
};

const init = async () => {
  try {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
  } catch (err) {
    console.error("Initialization error:", err);
  }
};

init();
