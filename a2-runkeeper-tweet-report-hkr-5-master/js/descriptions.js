function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert("No tweets returned");
		return;
	}

	//TODO: Filter to just the written tweets
	writtenTweets = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at)).filter(tweet => tweet.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const input = document.getElementById("textFilter");
	const table = document.getElementById("tweetTable");
	const searchCount = document.getElementById("searchCount");
	const searchText = document.getElementById("searchText");

	// Implementing debouncing
	const debounce = (callback, wait) => {
		let timeout;
		return (...args) => {
			const context = this;
			clearTimeout(timeout);
			timeout = setTimeout(() => callback.apply(context, args), wait);
		};
	}

	searchCount.innerHTML = "0";
	searchText.innerHTML = "";
	input.addEventListener("keyup", debounce((e) => {
		// Reset table
		console.log("called")
		table.replaceChildren([]);

		const search = e.target.value;
		// Set search string
		searchText.innerHTML = search;
		
		if (search == "") {
			// If search string is empty then don"t filter tweets
			searchCount.innerHTML = "0";
			return;
		}

		// Get subset of tweets containing search string
		const filteredTweets = writtenTweets.filter(tweet => tweet.text.includes(search));
		searchCount.innerHTML = filteredTweets.length;
		
		// Append to table
		filteredTweets.forEach((tweet, index) => {
			const element = document.createElement("template");
			element.innerHTML = tweet.getHTMLTableRow(index);
			table.appendChild(element.content.firstChild);
		});
	}, 300));
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
