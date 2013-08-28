# Lawnchair Sync
**v0.1.0**

Lawnchair sync takes your Lawnchair and synchronises it with your JSON feed of choice.

## Requirements

- [Lawnchair](http://brian.io/lawnchair/)
- [jQuery](http://jquery.com/)

## Demo

You can find a demo of Lawnchair Sync in the form of a Github stars viewer at [http://nbrock.github.io/LawnchairSync/](http://nbrock.github.io/LawnchairSync/)


## Usages

	var store = new Lawnchair({name:'json-feed'}, function() {
    	this.sync({
			url: 'http://www.domain.com/feed.json',
			ttl: 60,
			store: store
    	}, function(data) {
			console.log(data);
    	});
	})

## Options

- url - The URL of the feed you wish to sync from. **required**
- ttl - The time to live for the cached data. *Default: 30 (minutes)*
- key - A unique key for the data to be indexed by. *Default: id*
- force - Set to true to force data to sync. *Default: false*
- ajax - options used during use of the jQuery ajax method.
- callback
	- prestore - Make adjustments to the data before saving. *Default: false*