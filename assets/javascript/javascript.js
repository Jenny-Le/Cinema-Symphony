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
    $.ajax({
        url: "https://api.thetvdb.com/login",
        type: "POST",
        data: JSON.stringify({
            "apikey": "095E931EC69FA5BB",
            "userkey": "C55905D75BC0C9B9",
            "username": "lejenny75"
        }),
        dataType: "json",
        contentType: "application/json"
    }).done(function(response) {
        console.log(response.token);
       
    });


    $("button").on("click", function() {
        var title = $("#searchText").val();
        var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=d840ff4";
        var posterImage = "http://img.omdbapi.com/?apikey=d840ff4";
        var posterTag = $("<img id='posterImg'>");


        var userText = $("#searchText").val().trim()
        database.ref().push({
            searchText: userText

        });



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
            let albumName = response.Title
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

        });




    });



});