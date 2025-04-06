const $premiers = document.getElementById('premiers');
const $list3D = document.getElementById('3D');
const $list2D = document.getElementById('2D');
const $loader = document.querySelector('.loader-section');
const $nav = document.querySelector('nav');

const generateMovies = function(movies,$list,type){
  movies.forEach(movie => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const image = document.createElement("img");
    const title = document.createElement("h3");
    item.setAttribute("class","movie");
    link.setAttribute("class","link-movie");
    link.setAttribute('href','/home/movie')
    image.setAttribute("class",`poster ${type}`);
    image.setAttribute("src",movie.poster);
    image.setAttribute("id",movie.id_movie);
    title.setAttribute("class",`movie-title ${type}`);
    title.setAttribute("id",movie.id_movie);
    title.textContent = movie.title;
    item.appendChild(link);
    link.appendChild(image);
    link.appendChild(title);
    $list.appendChild(item);
  });
}

fetch('/home/movie/api')
.then(async(response)=>{
  if(response.status === 503){
    window.location.href = '/home/error';
  }
  if(response.status === 429){
    window.location.reload();
  }
  else if(response.status === 200){
    const movies = await response.json();
    generateMovies(movies.movies2D,$list2D,"2D");
    generateMovies(movies.movies3D,$list3D,"3D");
    generateMovies(movies.moviesPremier,$premiers,"premier");
  }
})
.catch((error)=>{console.error(error);});

const $body = document.querySelector('body');
$body.addEventListener("click",(e)=>{
  if(e.target.matches('.poster') || e.target.matches('.movie-title')){
    sessionStorage.setItem('id',e.target.id);
    sessionStorage.setItem('type',e.target.classList[1]);
  }
  else if(e.target.matches('.open') || e.target.matches('.nav-link') || e.target.matches('.close')){
    if(e.target.matches('.account')){
      localStorage.setItem('path','/home/account');
    }
    $nav.classList.toggle('open-nav');
  }
});

window.addEventListener("load",()=>{
  $body.removeChild($loader);
});