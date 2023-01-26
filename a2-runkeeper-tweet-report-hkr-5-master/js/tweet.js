"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either "live_event", "achievement", "completed_event", or "miscellaneous"
    get source() {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.includes("#RKLive"))
            return "live_event";
        else if (this.text.includes("#FitnessAlerts"))
            return "achievement";
        else if (this.text.includes("completed") || this.text.includes("posted"))
            return "completed_event";
        else if (this.text.includes("Runkeeper"))
            return "miscellaneous";
        else
            return "undefined";
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        //TODO: identify whether the tweet is written
        return !this.text.includes("@Runkeeper");
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        const end = this.text.indexOf("https://t.co/");
        return this.text.slice(0, end);
    }
    get activityType() {
        if (this.source != "completed_event") {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const start = this.text.includes(" km ") ? this.text.indexOf(" km ") : this.text.indexOf(" mi ");
        const end = this.text.includes(" - ") ? this.text.indexOf(" - ") : this.text.indexOf(" with");
        // If either start or end could not be found, return unknown
        if (start == -1 || end == -1)
            return "unknown";
        const activity = this.text.slice(start + 4, end);
        // Remove unspecified activity tweets
        return activity == "activity" ? "unknown" : activity;
    }
    get distance() {
        if (this.source != "completed_event") {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const start = this.text.indexOf("Just completed a ");
        const end = this.text.includes(" km ") ? this.text.indexOf(" km ") : this.text.indexOf(" mi ");
        // If either start or end could not be found, return 0
        if (start == -1 || end == -1)
            return 0;
        // Converting km to mi in case needed
        return this.text.includes(" mi ") ? Number(this.text.slice(start + 17, end)) : Number(this.text.slice(start + 17, end)) / 1.609;
    }
    getHTMLTableRow(rowNumber) {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const linkStart = this.text.indexOf("https://t.co/");
        const linkEnd = this.text.indexOf(" #Runkeeper", linkStart);
        const link = this.text.slice(linkStart, linkEnd);
        const textWithLink = `${this.text.slice(0, linkStart)}<a target="_blank" href="${link}">${link}</a>${this.text.slice(linkEnd)}`;
        return `<tr><td>${rowNumber + 1}</td><td>${this.activityType}</td><td>${textWithLink}</td></tr>`;
    }
}
