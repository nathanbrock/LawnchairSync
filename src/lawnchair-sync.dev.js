/*

Lawnchair Sync Plugin

Example Usage:

var store = new Lawnchair({name:'json-feed'}, function() {
    this.sync({
		url: 'http://www.domain.com/feed.json',
    }, function(data) {
		console.log(data);
    });
})

ToDo
- Support calling from specified point.
- Redefine TTL and refetch times.
- Remove jQuery dependancy.
*/
Lawnchair.plugin((function () {

    'use strict';

    var syncDefaults = {
        url: false,
        ttl: 30,
        key: 'id',
        force: false,
        ajax: {
            data_type: 'json',
            data: false,
            jsonp: false,
            queue: false
        },
        callback: {
            prestore: false
        }
    };

    var options = {},
        store = null,
        returnCallback = function () {};

    var syncSetOptions = function (user_options) {
        options = extend(syncDefaults, user_options);
        store = user_options.store;

        if (!options.url) {
            throw "Lawnchair Sync: 'url option must be supplied.'";
        }
    };

    /*
     * Checks the sync ttl and determines if it should grab any updated content.
     */
    var syncCheck = function () {
        // Nuking the store leaves the _syncttl_ behind. If the index
        var index = store.indexer.all();

        store.get('_syncttl_', function (last_sync) {
            if (options.force || last_sync === null || last_sync.value <= getTimestamp() || index.length === 0) {
                syncFetch();
            } else {
                store.all(function (data) {
                    returnCallback(data);
                });
            }
        });
    };

    /*
     * Stores the retrieved content and sets/updates the ttl for the next cache time.
     */
    var syncStore = function (data) {
        if (options.callback.prestore !== false) {
            data = options.callback.prestore(data);
        }

        var arr = [];

        if (data.length > 0) {
            for (var item in data) {
                arr.push({
                    key: data[item][options.key],
                    value: data[item]
                });
            }
        }

        store.batch(arr, function () {
            var new_ttl = getTimestamp() + (options.ttl * 60 * 1000);

            store.save({
                key: '_syncttl_',
                value: new_ttl
            }, function () {
                if (store.indexer) {
                    store.indexer.del(this.name + '._syncttl_');
                }
            });

            store.all(function (data) {
                returnCallback(data);
            });
        });
    };

    /*
     * Fetch new content
     */
    var syncFetch = function () {
        var ajaxOpts = {
            url: options.url,
            data: options.ajax.data,
            dataType: options.ajax.data_type,
            success: function (data) {
                syncStore(data);
            },
            error: syncFetchError
        };

        if (options.ajax.jsonp !== false) {
            ajaxOpts.jsonpCallback = options.ajax.jsonpCallback;
        }

        if (options.ajax.queue === true) {
            $.ajaxQueue(ajaxOpts);
        } else {
            $.ajax(ajaxOpts);
        }
    };

    var syncFetchError = function (a, b) {
        console.log(a, b);
    };

    var extend = function (defaults, params) {
        var obj = {};
        for (var attrnameA in defaults) {
            obj[attrnameA] = defaults[attrnameA];
        }
        for (var attrnameB in params) {
            obj[attrnameB] = params[attrnameB];
        }
        return obj;
    };

    var getTimestamp = function () {
        return Date.now();
    };

    return {
        sync: function (options, callback) {
            returnCallback = callback;
            syncSetOptions(options);
            syncCheck();
        },
    };

})());