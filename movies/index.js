let leftSummary = null
let rightSummary = null
const onMovieSelect = async (movie, elementSummary, side) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "d990fc1",
      i: movie.imdbID
    }
  })
  elementSummary.innerHTML = movieTemplate(response.data)
  if (side === "left") {
    leftSummary = response.data
  }
  else {
    rightSummary = response.data
  }
  if (leftSummary && rightSummary) {
    compare()
  }
}

const compare = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll('#right-summary .notification')

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);

    if (isNaN(rightSideValue) || isNaN(leftSideValue)) {
      rightStat.classList.remove('is-danger');
      rightStat.classList.remove('is-primary');
      leftStat.classList.remove('is-danger');
      leftStat.classList.remove('is-primary');
    }
    else if (rightSideValue > leftSideValue) {
      rightStat.classList.remove('is-danger');
      rightStat.classList.add('is-primary');
      leftStat.classList.add('is-danger');
      leftStat.classList.remove('is-primary');
    }
    else if (leftSideValue > rightSideValue) {
      rightStat.classList.add('is-danger');
      rightStat.classList.remove('is-primary');
      leftStat.classList.remove('is-danger');
      leftStat.classList.add('is-primary');
    }
    else if (rightSideValue === leftSideValue) {
      rightStat.classList.remove('is-danger');
      rightStat.classList.remove('is-primary');
      leftStat.classList.remove('is-danger');
      leftStat.classList.remove('is-primary');
    }
  })
}

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '') // g means global, replace all occurrences
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-danger">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-danger">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-danger">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-danger">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-danger">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}

const autocomplete = {
  renderOption(movie) {
    const imgSource = movie.Poster === "N/A" ? "" : movie.Poster
    return `
        <img src="${imgSource}"/>
        ${movie.Title}
    `
  },
  onOptionSelect(movie) { },
  inputValue(movie) {
    return movie.Title
  },
  async fetchData(searchTerm) {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "d990fc1",
        s: searchTerm
      }
    })
    if (response.data.Error) {
      return []
    }
    return response.data.Search
  },
  root: null
}
createAutoComplete({
  ...autocomplete, // ... is called the spread operator, it essentially copies all properties of "autocomplete"
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden")
    onMovieSelect(movie, document.querySelector("#left-summary"), "left")
  },
})

createAutoComplete({
  ...autocomplete,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden")
    onMovieSelect(movie, document.querySelector("#right-summary"), "right")
  },
})