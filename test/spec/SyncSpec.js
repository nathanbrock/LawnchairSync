describe("Lawnchair Sync dependencies", function() {
	it("lawnchair is loaded", function() {
		expect(Lawnchair).not.toBe(undefined);
	});

	it("lawnchair sync plugin is loaded", function() {
		var lawnchair = new Lawnchair({name: 'pie'}, function(){});
		expect(typeof lawnchair.sync).toBe('function');
	});

  it("jQuery is required for lawnchair sync", function() {
    expect($).not.toBe('undefined');
  });
});

var store = new Lawnchair({
  name: 'lawnchair-sync-test-plugin',
  adapter: 'dom'
}, function() {

  var store = this;

  describe('Lawnchair Sync with DOM adapter', function() {

    it('synchronize data with default options', function() {
      var sync_data = false;
      var flag = false;

      runs(function() {
        store.sync({
          url: 'test-data/test-1.json'
        }, function(data) {
          sync_data = data;
          flag = true;
        });
      });

      waitsFor(function() {
        return sync_data;
      }, 'Sync data was not returned.', 1000);

      runs(function() {
        expect(sync_data.length).toBe(6);
      });
    });

    it('synchronize with additional data', function() {
      var sync_data = false;

      runs(function() {
        store.sync({
          url: 'test-data/test-2.json',
          force: true
        }, function(data) {
          sync_data = data;
          flag = true;
        });
      });

      waitsFor(function() {
        return sync_data;
      }, 'Sync data was not returned.', 1000);

      runs(function() {
        expect(sync_data.length).toBe(13);
      });
    });

    it('replaces existing entries with additional data', function() {
      var sync_data = false;

      runs(function() {
        store.sync({
          url: 'test-data/test-3.json',
          force: true
        }, function(data) {
          sync_data = data;
          flag = true;
        });
      });

      waitsFor(function() {
        return sync_data;
      }, 'Sync data was not returned.', 1000);

      runs(function() {
        expect(sync_data.length).toBe(16);
      });
    });

    it('uses latest data that has replaced existing ID content', function() {
      var sync_data = false;

      runs(function() {
        store.get(11, function(data) {
          sync_data = data;
        });
      });

      waitsFor(function() {
        return sync_data;
      }, 'Data was not returned from store.', 1000);

      runs(function() {
        expect(sync_data.value.guid).toBe('093f2f8e-e46d-4078-8d99-bcac88595d16');
      });
    });

    it('nukes storage after previous tests are complete', function() {
      store.nuke();
    });

    it('synchronize with prestore callback method', function() {
      var sync_data = false;

      runs(function() {
        store.sync({
          url: 'test-data/github-events.json',
          callback: {
            prestore: function(data) {
              for(var i in data) {
                delete data[i].actor;
                delete data[i].org;
                delete data[i].payload;
                delete data[i].repo;
              }

              return data;
            }
          }
        }, function(data) {
          sync_data = data;
        });
      });

      waitsFor(function() {
        return sync_data;
      }, 'Sync data was not returned.', 1000);

      runs(function() {
        var actor = typeof sync_data[0].value.actor,
            org = typeof sync_data[0].value.org,
            payload = typeof sync_data[0].value.payload,
            repo = typeof sync_data[0].value.repo,
            created_at = typeof sync_data[0].value.created_at,
            id = typeof sync_data[0].value.id,
            public_flag = typeof sync_data[0].value['public'];

        expect(actor).toBe('undefined');
        expect(org).toBe('undefined');
        expect(payload).toBe('undefined');
        expect(repo).toBe('undefined');
        expect(created_at).toBe('string');
        expect(id).toBe('string');
        expect(public_flag).toBe('boolean');
      });
    });

    it('nukes storage after previous tests are complete', function() {
      store.nuke();
    });

  });

});