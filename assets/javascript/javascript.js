$(document).ready(function() {
 $("button").on("click", function() {
    var title = $("#searchText").val();
    var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=d840ff4";
    var posterImage = "http://img.omdbapi.com/?apikey=d840ff4";
    var posterTag = $("<img id='posterImg'>");

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        console.log(response);
        console.log(response.Plot)
        console.log(response.Runtime);
        console.log(response.Poster)

       $("#moviePoster").append(posterTag); 
       $('#posterImg').attr("src", response.Poster);
       $("#movieSummary").text(response.Plot) 

     

 	console.log(title);
    });




 });



});