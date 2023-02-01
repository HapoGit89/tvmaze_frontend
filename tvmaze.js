"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const resultArr = []
  const response = await axios.get("https://api.tvmaze.com/search/shows?", {params: {q: term} })


for (let result of response.data){
  resultArr.push({id: result.show.id, name: result.show.name, summary: result.show.summary, image: (result.show.image === null ? 'https://tinyurl.com/tv-missing' : result.show.image.original) })
}

return resultArr
    
}

async function getEpisode(id) {
  const resultArr = []
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  console.log(response)

  for (let episode of response.data )
{
  resultArr.push({id: episode.id, name: episode.name, season: episode.season, number: episode.number})
}

return resultArr
}

  



  

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    console.log (show.name)
   
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${show.image} 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-info btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

      $('.Show-getEpisodes').on('click', async function(show){
        show = show.id
        const episodes = await getEpisode(show);
        console.log(show.name)
        populateEpisodes(episodes);

      })

    $showsList.append($show);  }
}


function populateEpisodes(episodes) {
  $episodesArea.empty();
  $episodesArea.css("display", "block");

  for (let ep of episodes) {
  
    const $ep = $(
        `<li>${ep.name} (season ${ep.season}, number ${ep.number})</li>
      `);

    $episodesArea.append($ep);  }
}



/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = document.querySelector('#search-query').value
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
