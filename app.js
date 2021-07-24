document.addEventListener('DOMContentLoaded',function(){
//getting from html
const Form = document.forms['form']
const Error=document.querySelector(".err")
const SearchedMovie=document.querySelector('.searched-movies')
const PopulargMovie=document.querySelector(".popular")
const TopRatedMovie=document.querySelector(".top-rated")
const PlayingMovie=document.querySelector(".playing")
const mainiframe=document.querySelector(".iframes")
//Default Functions to load page
//GetSearchedMovie(URL='https://api.themoviedb.org/3/search/movie?api_key=fe8827743ddf960957ddd54aa4f185b0&query=lava kusha',value='lava kusha')
mainIframe()
getPopularMovie()
getTopRatedMovie()
getPlayingMovie()
//make final url
function GenerateURL(path){
    const KEY = 'fe8827743ddf960957ddd54aa4f185b0';
    const Main_URL = `https://api.themoviedb.org/3/${path}?api_key=${KEY}`

    return Main_URL;
}

Form.addEventListener('submit', function (e) {
    e.preventDefault();
    const value = Form.querySelector('input[type="text"]').value;
      if(!(value.length===0)){
        const path='search/movie'
        const Search=GenerateURL(path)
        const URL = Search+ '&query=' + value;
        
        GetSearchedMovie(URL,value);
     
        Error.setAttribute('class',"remove-err")
        Error.innerHTML='';
    }
    else{
        forError('Invalid Input')
    }
    Form.querySelector('input[type="text"]').value=""
});

function GetSearchedMovie(URL,value){
    return fetch(URL)
    .then((res) => res.json())
    .then(data => {
        if(data.results.length===0){
            forError(`Unable to find Movie ${value}..`);
        }
        else{
        SearchedMovie.innerHTML='';
        const movies=data.results;
        const title=` ${value} Movies <i class="far fa-kiss-wink-heart"></i>`;
        const movieBlock=createMovieContainer(movies,title)
        SearchedMovie.appendChild(movieBlock)
        }
    })
    .catch(err => console.log(err))
}

function createMovieContainer(movies,Title=''){
    const movieElement=document.createElement('div');
    movieElement.setAttribute('class','movie');
    let movieTemplate=`
    <h2> ${Title} Are</h2>
    <section class="section">
        ${GetImage(movies)}
    </section>
    <div class="content">
        <p id="close"><i class="fas fa-times"></i> Close</p>
    </div>`;

    movieElement.innerHTML=movieTemplate;
    return movieElement;
}

function GetImage(movies){
    const Image_Url='https://image.tmdb.org/t/p/w500';
    return `${movies.map(movie=>{
        if(movie.poster_path && movie.title && movie.vote_average){
            const lava=`${movie.title}` 
            return `<div>
                <img 
                    src=${Image_Url+movie.poster_path}
                    data-movieid=${movie.id}
                />
                <h4>${lava}</h4>
                <p><i id='star' class="far fa-star"></i> ${movie.vote_average}</p>
                </div>
            `;
            }
        })
    }`
}
document.onclick=function(e){
    if(e.target.tagName.toLowerCase()==='img'){
        const section=e.target.parentElement;
        const section1=section.parentElement
        const content=section.nextElementSibling     
        content.setAttribute('class','display')

        const movieId=e.target.dataset.movieid
        const path=`movie/${movieId}/videos`
        const VideoUrl=GenerateURL(path)
        GetClickedMovie(VideoUrl,content)

        Error.setAttribute('class',"remove-err")
        Error.innerHTML='';
    }
    if(e.target.id==='close'){
        const content=e.target.parentElement;
        content.setAttribute('class','content')
    }
}
function GetClickedMovie(VideoUrl,content){
    return fetch(VideoUrl)
    .then((res) => res.json())
    .then(data => {
        if(data.results.length>0){
            content.innerHTML=`<p id="close">Close</p>`
            const length=data.results.length>4 ? 4:data.results.length;

            for(let i=0;i<length;i++){
                const video=data.results[i].key
                const iframeCont=document.createElement('div');
                const iframe=ShowVideo(video)
                iframeCont.appendChild(iframe)
                content.appendChild(iframeCont)
            } 
        }
        else{
            content.innerHTML=`<h2 id="close">There is no video Avilable...<i class="fas fa-exclamation-triangle"></i></h2>`;
        }  
    })
    .catch(err => console.log(err))
}
 
function ShowVideo(video){
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube.com/embed/${video}`;
    iframe.width=200;
    iframe.height=200;
    iframe.allowFullscreen=true;

    return iframe;
}

function getPopularMovie(){
    const path=`movie/popular`
    const popularUrl=GenerateURL(path)

    fetch(popularUrl)
    .then((res) => res.json())
    .then(data => {
        const title="Most Watched  Movies"
        const movieBlock=createMovieContainer(data.results,title)
        PopulargMovie.appendChild(movieBlock)
    })
    .catch(err => console.log(err))
}
function getTopRatedMovie(){
    const path=`movie/top_rated`
    const TopRatedUrl=GenerateURL(path)
    
    fetch(TopRatedUrl)
    .then((res) => res.json())
    .then(data => {  
        const title="Top-Rated  Movies"
        const movieBlock=createMovieContainer(data.results,title)
        TopRatedMovie.appendChild(movieBlock)
    })
    .catch(err => console.log(err))
}
function getPlayingMovie(){
    const path=`movie/now_playing`
    const PlayingUrl=GenerateURL(path)
   
    fetch(PlayingUrl)
    .then((res) => res.json())
    .then(data => {
        const title="Playing  Movies"
        const movieBlock=createMovieContainer(data.results,title)
        PlayingMovie.appendChild(movieBlock)
    })
    .catch(err => console.log(err))
}
function forError(ErrMsg=''){
    Error.innerHTML='';
    const ErrorDisplay=document.createElement('h2');
    ErrorDisplay.setAttribute('class','error');

    ErrorDisplay.innerHTML=`<i class="fas fa-exclamation-triangle"></i> ${ErrMsg}..`;
    Error.setAttribute('class',"showErr")

    Error.appendChild(ErrorDisplay)
    return ErrorDisplay;
}

function mainIframe(){
    const path=`movie/upcoming`
    const upcomingUrl=GenerateURL(path)
    
    fetch(upcomingUrl)
    .then((res) => res.json())
    .then(datas => {
        datas.results.map(data=>{
        const path=`movie/${data.id}/videos`;
        const VideoUrl=GenerateURL(path);    
        getupcoming(VideoUrl)    
        })
    })
    .catch(err =>{
        mainiframe.appendChild(forError('Check internet connection, Unable to load Movies'))
        })
}

function getupcoming(VideoUrl){
    fetch(VideoUrl)
    .then((res) => res.json())
    .then(data => {
    if(data.results.length > 0){
        const length=data.results.length>1 ? 1:data.results.length;
        for(let i=0;i<length;i++){
            const video=data.results[i].key
            const iframeCont=document.createElement('div');
            const iframe=ShowVideo(video)
            iframeCont.appendChild(iframe)
            mainiframe.appendChild(iframeCont)
        }
    }
    if(data.results.length<0){
        const title=`<h3><i class="fas fa-exclamation-triangle"></i> Unable to get Upcoming movie..</h3>`
        mainiframe.innerHTML=title
    }
    })
    .catch(err => console.log(err))
}

})
