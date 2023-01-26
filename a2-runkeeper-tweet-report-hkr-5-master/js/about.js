function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert("No tweets returned");
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	const options = {year: "numeric", month: "long", day: "numeric"};
	document.getElementById("numberTweets").innerText = tweet_array.length;	
	document.getElementById("firstDate").innerText = tweet_array[tweet_array.length - 1].time.toLocaleDateString(undefined, options);
	document.getElementById("lastDate").innerText = tweet_array[0].time.toLocaleDateString(undefined, options);

	// Update the total number of tweets by category
	Array.from(document.getElementsByClassName("completedEvents")).forEach(element => element.innerText = tweet_array.filter(tweet => tweet.source === "completed_event").length);
	Array.from(document.getElementsByClassName("liveEvents")).forEach(element => element.innerText = tweet_array.filter(tweet => tweet.source === "live_event").length);
	Array.from(document.getElementsByClassName("achievements")).forEach(element => element.innerText = tweet_array.filter(tweet => tweet.source === "achievement").length);
	Array.from(document.getElementsByClassName("miscellaneous")).forEach(element => element.innerText = tweet_array.filter(tweet => tweet.source === "miscellaneous").length);
	Array.from(document.getElementsByClassName("written")).forEach(element => element.innerText = tweet_array.filter(tweet => tweet.written && tweet.source === "completed_event").length);
	console.log(tweet_array.filter(tweet => tweet.source === "miscellaneous"));
	// Update the percentage of total number of tweets by category
	function formatPct(value) {
		// Return percentage notation with two digits
		return value.toFixed(2) + "%"
	}
	Array.from(document.getElementsByClassName("completedEventsPct")).forEach(element => element.innerText = math.format(tweet_array.filter(tweet => tweet.source === "completed_event").length / tweet_array.length * 100, formatPct));
	Array.from(document.getElementsByClassName("liveEventsPct")).forEach(element => element.innerText = math.format(tweet_array.filter(tweet => tweet.source === "live_event").length / tweet_array.length * 100, formatPct));
	Array.from(document.getElementsByClassName("achievementsPct")).forEach(element => element.innerText = math.format(tweet_array.filter(tweet => tweet.source === "achievement").length / tweet_array.length * 100, formatPct));
	Array.from(document.getElementsByClassName("miscellaneousPct")).forEach(element => element.innerText = math.format(tweet_array.filter(tweet => tweet.source === "miscellaneous").length / tweet_array.length * 100, formatPct));
	Array.from(document.getElementsByClassName("writtenPct")).forEach(element => element.innerText = math.format(tweet_array.filter(tweet => tweet.written && tweet.source === "completed_event").length / tweet_array.filter(tweet => tweet.source === "completed_event").length * 100, formatPct));
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
