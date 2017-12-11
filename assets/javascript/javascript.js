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


    if (hash == "") {
        window.location = "https://accounts.spotify.com/authorize?redirect_uri=https://jenny-le.github.io/project-1/index.html&client_id=33df74e9fe14409b96de744f35f548b2&response_type=token"
    }

    var hashParams = hash.split('&').reduce(function(result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});


    console.log(hashParams);


    $("button").on("click", function() {
        var title = $("#searchText").val();
        var queryURL = "https://api.themoviedb.org/3/search/multi?api_key=03bc4746355eca7b85d94dff54c55926&language=en-US&query=" + title + "&page=1"
        var posterTag = $("<img id='posterImg'>");
        $(".noMovie").hide();
        $("#moviePoster").removeClass("tada animated");


        var userText = $("#searchText").val().trim()
        database.ref().push({
            searchText: userText

        });



        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(apiResponse) {


            if (apiResponse.results.length > 0) {
                let response = apiResponse.results[0]
                console.log(response.overview)
                console.log(response.poster_path)
                $("#moviePoster").append(posterTag);
                $('#posterImg').attr("src", "https://image.tmdb.org/t/p/w500" + response.poster_path);
                $("#moviePoster").attr("class", "tada animated");
                $("#movieSummary").text(response.overview)

                if(response.original_name == undefined) {
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


            }




        });




    });



});