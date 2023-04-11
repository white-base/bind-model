

// const jquery = require('jquery');

// var $ = require( "jquery" )


const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM("");
const $ = require( "jquery" )( window );

console.log('qw');

class Feature {
    load(url, callback) {
      $.ajax({ url })
        .done((data) => {
          callback.apply(this, [null, data])
        })
        .fail((jqXHR) => {
          callback.apply(this, [jqXHR.statusText])
        })
    }
  }

  module.exports = Feature;  