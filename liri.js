var keys = require('./keys');
var Twitter = require('twitter');
const fs = require('fs');
var endOfLine = require('os').EOL;
function log(data) {
    console.log(data);
    fs.appendFile('./log.txt', data + endOfLine, function(err) {
        if (err) throw err;
    });
}
function tweetTweet() {
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });
    var params = {
        screen_name: 'ThereAintNoJust'
    };
    var o = "";
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < 20; i++) {
                o += tweets[i].text + endOfLine;
                o += tweets[i].created_at + endOfLine;
                o += endOfLine;
            }
            log(o);
        }
    });
}
function spotThis(song) {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify({
        id: "8f3ec1f43e3a4b3bb3291596cb0a294b",
        secret: "4493f321a5d746aeaec07b84f0a42d2c"
    });
    var a = 'the sign Ace of Base';
    if (process.argv.slice(3) != "" && song === undefined) {
        a = process.argv.slice(3);
    } else if (song != undefined) {
        a = song;
    }
    spotify.search({
        type: 'track',
        query: a
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var o = "";
        for (i = 0; i < data.tracks.items.length; i++) {
            o += data.tracks.items[i].artists[0].name;
            o += endOfLine;
            o += data.tracks.items[i].name;
            o += endOfLine;
            o += data.tracks.items[i].external_urls.spotify;
            o += endOfLine;
            o += data.tracks.items[i].album.name;
            o += endOfLine;
            o += endOfLine;
            o += "--------------------------------";
            o += endOfLine;
      }
      log(o);
    });
}
function watchThis() {
    var a;
    if (process.argv.slice(3) != "") {
        a = process.argv.slice(3);
    } else {
        a = 'Mr. Nobody.';
    }
    var request = require('request');
    var rt = "Rotten Tomatoes Rating of the movie not found.";
    request.get({
        url: 'http://www.omdbapi.com/?apikey=40e9cece&t=' + a,
        json: true
    }, function(e, r, user) {
        if (typeof variable !== 'undefined') {
            rt = user.Ratings[1].Value;
        }
        if (typeof user.Title !== 'undefined') {
            log(user.Title);
            log(user.Year);
            log(user.imdbRating);
            log(rt);
            log(user.Country);
            log(user.Language);
            log(user.Plot);
            log(user.Actors);
            log("");
        } else {
            log("Movie not found.");
            log("");
        }
    });
}

function errors() {
  var e = ["PEBCAK", "EBKAC", "POBCAK", "One Delta Ten Tango", "Eye Dee Ten Tango", "PICNIC", "IBM error", "layer 8 issue", "wetware bug", "loose nut behind the keyboard", "short between the headphones","defective PTT button actuator", "OHT", "Error 40", "ICC", "Cas-18", "carbon based error"];
  return e[Math.floor(Math.random() * e.length)];
}

switch (process.argv[2]) {
    case "my-tweets":
        tweetTweet();
        break;
    case "spotify-this-song":
        spotThis();
        break;
    case "movie-this":
        watchThis();
        break;
    case "do-what-it-says":
        var text = fs.readFileSync('random.txt', 'utf8');
        var args = text.split(",");
        switch (args[0]) {
            case "my-tweets":
                tweetTweet();
                break;
            case "spotify-this-song":
                spotThis(args[1]);
                break;
            case "movie-this":
                watchThis(args[1]);
                break;
            default:
                log(errors());
                log("");
        }
        break;
    default:
        log(errors());
        log("");
}
