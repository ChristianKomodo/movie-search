const app = document.getElementById('root');
app.style.visibility = 'hidden';
const poster = document.createElement('img');
const paginationRow = document.getElementById('pagination');
paginationRow.style.visibility = 'hidden';

// query the API
function searchMovie(searchString, page=1) {
    return fetch(`https://www.omdbapi.com/?s=${searchString}&page=${page}&type=movie&apikey=9baa487f`)
        .then(function (response) {
            return response.json();
        })
        .catch(err => {
            console.log('searchMovie error is ', err);
            console.log('response is ', response);
        });
}

// request the search API and populate and loop through the response
function listMovies(pageNum=1) {
    const searchTitleString = document.getElementById('searchTitle').value;
    searchMovie(searchTitleString, pageNum)
        .then(response => {
            if (response.Error) {
                throw response.Error;
            }
            // display pagination information
            makePagination(response);
            // display movie data
            const data = response.Search;
            clearScreen();
            data.forEach(movie => {
                displayMovie(movie);
            });
        })
        .catch(err => {
            clearScreen();
            app.style.visibility = 'visible';
            paginationRow.style.visibility = 'hidden';
            const p = document.createElement('p');
            p.innerHTML = err;
            p.setAttribute('class', 'error');
            app.appendChild(p);
            console.error(err);
        });
}

// create an element with provided data and display it
function displayMovie(movie) {
    app.style.visibility = 'visible';
    let url = movie.Poster;
    if (url != 'N/A') {
        // get just the unique image filename
        const urlSegments = url.split('/');
        url = urlSegments[5];
    }
    const p = document.createElement('p');
    p.innerHTML = `<strong>Title: </strong> <a href="#" onclick="showPoster('${url}')">${movie.Title}</a> - <small>(${movie.Year})`;
    p.setAttribute('class', 'movie-title');
    app.appendChild(p);
}

// take the image filename and build it into a url and display the poster
function showPoster(posterURL) {
    poster.setAttribute('class', 'poster');
    if (posterURL === 'N/A') {
        imageURL = 'http://fpoimg.com/300x200?text=Poster%20Not%20Found';
    } else {
        imageURL = `https://m.media-amazon.com/images/M/${posterURL}`;
    }
    poster.src = imageURL;
    app.prepend(poster);
}

// clear the results screen
function clearScreen() {
    app.innerHTML = '';
}

// pagination
function makePagination(data) {
    paginationRow.style.visibility = 'hidden';
    if (data.totalResults <= 10) return;
    paginationRow.style.visibility = 'visible';
    console.info(`${data.totalResults} total results.`);
    const tens = Math.round(data.totalResults / 10);
    const ones = data.totalResults % 10;
    paginationRow.innerHTML = '';
    for (var i = 0; i < tens; i++) {
        const iteration = Number(i+1);
        let btn = document.createElement('button');
        btn.setAttribute('class', 'page-button');
        btn.textContent = iteration;
        btn.onclick = function() {
            clearScreen();
            listMovies(iteration);
        };
        paginationRow.appendChild(btn);
    }
}

// hitting enter submits the form if there is something typed in the input
var inputBtn = document.getElementById('searchTitle');
var submitBtn = document.getElementById('submit');
inputBtn.addEventListener('keyup', function (event) {
    event.preventDefault();
    if (inputBtn.value <= 0) return;
    if (event.keyCode === 13) {
        submitBtn.click();
    }
});
