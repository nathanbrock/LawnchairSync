# Lawnchair Sync

Lawnchair sync takes your lawnchair and synchronizes it with your JSON feed of choice.

*This be a work in progress*

## Requirements

- [Lawnchair](http://brian.io/lawnchair/)
- [jQuery](http://jquery.com/)

## Usages

	var store = new Lawnchair({name:'json-feed'}, function() {
    	this.sync({
			url: 'http://www.domain.com/feed.json',
			ttl: 60
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
	
## Examples

In progress.

## Testing

The lovely Jasmine is used to test the Lawnchair Sync lib. During the tests a number of JSON files are requested. This may well throw errors as resources fail to load and issues concerning 'Access-Control-Allow-Origin'. To test the lib, move to the root of the repo and enter the command below to run a simple web server for the purposes of testing.

	python -m SimpleHTTPServer