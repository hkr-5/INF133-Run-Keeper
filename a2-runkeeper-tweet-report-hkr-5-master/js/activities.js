function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert("No tweets returned");
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	// Filter unknown activities and remove
	tweet_array = tweet_array.filter(({ activityType }) => activityType != "unknown");

	// Create object with activity type as key to track count, distance and if-weekend
	const activityCounts = {};
	tweet_array.forEach(({ activityType, distance, time }) => {
		const isWeekend = time.getDay() == 0 || time.getDay() == 6; // Index based on day of the week

		// If activity doesn"t exist, create new key in activityCounts
		if (!activityCounts[activityType]) {
			activityCounts[activityType] = {
				count: [distance],
				weekend: [isWeekend],
			};
		} 
		else {
			activityCounts[activityType].count.push(distance);
			activityCounts[activityType].weekend.push(isWeekend);
		}
	})

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": { "field": "activityType", "type": "nominal", "title": "Activity Type"},
		"y": { "field": "activityType", "aggregate": "count", "title": "Log Count"}
	  }
	};
	vegaEmbed("#activityVis", activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	// Convert activities count to an array to sort by activity count
	const activitiesByCount = Object.entries(activityCounts).sort((a, b) => b[1].count.length - a[1].count.length);

	// Set top 3 activities
	const firstActivity = activitiesByCount[0][0];
	const secondActivity = activitiesByCount[1][0];
	const thirdActivity = activitiesByCount[2][0];

	// Filter tweet array to only include top 3 activities
	tweet_array = tweet_array.filter(({ activityType }) => (
		activityType == firstActivity ||
		activityType == secondActivity ||
		activityType == thirdActivity 
	)).map(({ activityType, distance, time }) => ({
		activityType,
		distance,
		time
	}));

	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": tweet_array
		},
		//TODO: Add mark and encoding
		"mark": "point",
		"encoding": {
		  "x": { "field": "time", "type": "nominal",  "title": "time (days)", "timeUnit": "day"},
		  "y": { "field": "distance", "type": "quantitative"},
		  "color": { "field": "activityType", "type": "nominal", "title": "Activity Type"}
		}
	};

	distance_vis_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": tweet_array
		},
		//TODO: Add mark and encoding
		"mark": "point",
		"encoding": {
		  "x": { "field": "time", "type": "nominal",  "title": "time (days)", "timeUnit": "day"},
		  "y": { "field": "distance", "type": "quantitative", "aggregate": "mean"},
		  "color": { "field": "activityType", "type": "nominal", "title": "Activity Type"}
		}
	};
	vegaEmbed("#distanceVis", distance_vis_spec, {actions:false});
	vegaEmbed("#distanceVisAggregated", distance_vis_aggregated_spec, {actions:false});

	//Add event listener to click
	let showMeans = false;
	const handleClick = () => {
		showMeans = !showMeans;
		if (showMeans) {
			document.getElementById("distanceVis").style.display = "none";
			document.getElementById("distanceVisAggregated").style.display = "block";
			document.getElementById("aggregate").innerText = "Show all activities";
		} 
		else {
			document.getElementById("distanceVis").style.display = "block";
			document.getElementById("distanceVisAggregated").style.display = "none";
			document.getElementById("aggregate").innerText = "Show means";
		}
	}
	document.getElementById("aggregate").addEventListener("click", handleClick);
	document.getElementById("distanceVis").style.display = "block";
	document.getElementById("distanceVisAggregated").style.display = "none";

	// Utility function to get average from array of distances
	const averageArray = (arr) => arr.reduce((accumulator, current) => accumulator + current, 0) / arr.length;

	// Determine longest/shortest average distance activities
	let longestAvgActivity = firstActivity;
	let shortestAvgActivity = firstActivity;

	[secondActivity, thirdActivity].forEach(activity => {
		const longest = averageArray(activityCounts[longestAvgActivity].count);
		const shortest = averageArray(activityCounts[shortestAvgActivity].count);
		if (averageArray(activityCounts[activity].count) > longest) {
			longestAvgActivity = activity;
		}
		if (averageArray(activityCounts[activity].count) < shortest) {
			shortestAvgActivity = activity
		}
	});

	// Given longest average distance activity determine events occuring on weekdays/weekends
	const longestActivityWeekendCount = activityCounts[longestAvgActivity].weekend.filter(isWeekend => isWeekend).length;
	const longestActivityWeekdayCount = activityCounts[longestAvgActivity].weekend.filter(isWeekend => !isWeekend).length;

	// Update element text
	document.getElementById("numberActivities").innerText = activitiesByCount.length;
	document.getElementById("firstMost").innerText = firstActivity;
	document.getElementById("secondMost").innerText = secondActivity;
	document.getElementById("thirdMost").innerText = thirdActivity;
	document.getElementById("longestActivityType").innerText = longestAvgActivity;
	document.getElementById("shortestActivityType").innerText = shortestAvgActivity;
	document.getElementById("weekdayOrWeekendLonger").innerText = longestActivityWeekendCount > longestActivityWeekdayCount ? "weekends" : "weekdays";
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
