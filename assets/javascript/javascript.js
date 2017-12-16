$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyB-qWgDrndmGHKYBoad0QVjLOwqyNzNhAI",
        authDomain: "cinema-symphony.firebaseapp.com",
        databaseURL: "https://cinema-symphony.firebaseio.com",
        projectId: "cinema-symphony",
        storageBucket: "cinema-symphony.appspot.com",
        messagingSenderId: "119826550462"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    var hash = window.location.hash.substr(1);
    // we needed this because it pulls back the "#whatever" if there's something like that in URL
    // basically a hashtag and whatever follows. We needed this to extract the token we get back from the spotify
    // after spotify logs us in, they redirect you back with #sometoken attached to our URL and we need the same API
    // to them to search for albums, artists.. etc


    if (hash == "") {
        window.location = "https://accounts.spotify.com/authorize?redirect_uri=https://jenny-le.github.io/project-1/index.html&client_id=33df74e9fe14409b96de744f35f548b2&response_type=token"
    }

    var hashParams = hash.split('&').reduce(function(result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});
    //  hash.split this takes the hash string/token string from the URL and creats an object out of it with a key value
    // item.split splits the string. 


    console.log(hashParams);

    $("#searchText").on("keypress", function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which); // ? means shorthand for if and else ternary
        if (keycode == '13') {
            searchMovie();
        }
    });


    $("button").on("click", function() {
        searchMovie();
    });

    var searchMovie = function() {
        var title = $("#searchText").val();
        var queryURL = "https://api.themoviedb.org/3/search/multi?api_key=03bc4746355eca7b85d94dff54c55926&language=en-US&query=" + title + "&page=1"
        var posterTag = $("<img id='posterImg'>");
        $(".noMovie").hide();
        $("#moviePoster").removeClass("fadeIn animated");


        var userText = $("#searchText").val().trim()
        database.ref().push({
            searchText: userText

        });


        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(apiResponse) {


            if (apiResponse.results.length > 0) {
                $(".noMovie").hide()
                $(".result-hide").show()
                let response = apiResponse.results[0]
                console.log(response.overview)
                console.log(response.poster_path)
                $("#moviePoster").append(posterTag);
                $('#posterImg').attr("src", "https://image.tmdb.org/t/p/w500" + response.poster_path);
                $("#moviePoster").attr("class", "fadeIn animated movie-poster");
                $("#movieSummary").text(response.overview)

                if (response.original_name == undefined) {
                    var albumName = response.original_title
                } else {
                    var albumName = response.original_name
                }

                let queryURL = "https://api.spotify.com/v1/search?type=album&market=US&limit=1&q=" + albumName
                $.ajax({
                    type: "GET",
                    url: queryURL,
                    headers: {
                        "Authorization": "Bearer " + hashParams.access_token
                        // bearer is standered for passing in tokens
                    },
                    dataType: 'json'
                }).done(function(response) {
                    console.log(response)
                    let albumID = response.albums.items[0].id;
                    let iframeURL = "https://open.spotify.com/embed?uri=spotify:album:" + albumID;
                    $('#spotify-player').attr('src', iframeURL);
                    $('#spotify-player').show();
                })

            } else {
                $(".noMovie").show()
                $(".result-hide").hide()
            }
        });
    }



});