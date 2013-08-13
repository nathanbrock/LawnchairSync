$(document).ready(function () {

  'use strict';

  var output_stars = function (data) {
    $.each(data, function (key, value) {
      $(".stars-table").find('tbody')
      .append($('<tr>')
        .append($('<td>')
          .append($('<a>')
            .attr('href', value.value.html_url)
            .text(value.value.name)
            )
          )
        .append($('<td>')
          .append($('<a>')
            .attr('href', value.value.html_url)
            .text(value.value.html_url)
            )
          )
        .append($('<td>')
          .append($('<a>')
            .attr('href', value.value.owner.html_url)
            .text(value.value.owner.login)
            )
          )
        .append($('<td>').text(value.value.watchers_count))
        );
    });
  };

  // Syncs the latest 30 starred from Github for <github user>
  var sync = function () {
    nuke();

    store.sync({
      url: 'https://api.github.com/users/' + $('#github-username').val() + '/starred',
      store: store
    }, output_stars);
  };

  // Clears out the examples localstorage and table rows.
  var nuke = function () {
    store.nuke();
    $('.stars-table').find('tbody').html('');
  };

  // Lawnchair Object.
  var store = new Lawnchair({
    name: 'lawnchair-sync-github-stars-example',
    adapter: 'dom'
  }, function () {
    this.all(output_stars);
  });

  // Event handling
  $('.sync-stars').click(sync);
  $('.nuke-stars').click(nuke);
});