// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

//= require jquery_ujs
//= require turbolinks
//= require ./jquery.cookie.js
//= require ./updateChart.js
//= require ./timeago.min.js
//= require ./tablesorter.js
//= require ./nested_form.js
//= require ./noapi.js
//= require ./rest.js
//= require ./validate.min.js
//= require ./channels.js
//= require ./sidebar.js
//= require ./prettify.js
//= require ./docs.js
//= require ./custom.js
//= require ./general.js

// Moved these here so we don't have to specify a path for the charts based
// on hostname. See "show.html.erb" and vendor/assets/javascripts path. 20190321
//
// NOTE: these changes require compilation!
//= require highcharts-7.0.3.js
//= require exporting.js

