// var apiURL = 'http://localhost:4200/totalrec';
var apiURL = 'https://api.jsonbin.io/v3/b/6734ff34acd3cb34a8a81a47';
window.compact = false;
var timer;

$(function () {
  var counter = document.getElementsByClassName('counter')[0];
  var current = parseInt(counter.innerText);

  timer = setInterval(function () {
    current = parseInt(counter.innerText); 

    if (current > 0) {
      var t = current - 1;
      if (t.toString().length === 1) {
        t = '0' + t.toString();
      }
      counter.innerText = t; 
    } else {
      counter.innerText = "59"; 
      callMonitorRender(); 
      document.getElementsByClassName('last-updated')[0].innerText = new Date().toLocaleTimeString(); // Update last updated time
    }
  }, 1000); 
});

function callMonitorRender() { 
  $.ajax({
    type: "GET",
    url: apiURL,
    dataType: "json",
    cache: false,
    success: function (response) {
      // data = response.result;
      data = response.record;
      console.log(data);

      var monitorHtml = '';
      var days = data.days.reverse();

      var w = window.innerWidth;
      var barLimit = 90;
      var svgW = window.compact ? 530 : 880;
      var svgH = window.compact ? 15 : 30;
      var barGap = window.compact ? 5.9 : 9.8;
      var barW = window.compact ? 3.25 : 6;

      if (w <= 768) {
        barLimit = 30;
        barGap = 19.8;
        barW = 12;
        svgW = 588;
        svgH = window.compact ? 30 : 60;
      }

      $.each(data.psp.monitors, function (i, monitorData) {
        var statusDot = '';
        var bars = '';

        var startI = 90 - barLimit;
        var dailyData = monitorData.dailyRatios.reverse();

        for (var i = startI; i < 90; i++) {
          var daily = dailyData[i];
          var notMonitored = false;
          var d = new Date(days[i]).getTime() / 1000;
          var dataDisplayDay = daily.ratio + '%';

          if (d < monitorData.createdAt - 86400) {
            notMonitored = true;
          } else {
            notMonitored = false;
          }

          var fillColor = "#3bd671"; // green color
          var fillOpacity = '1';

          if (notMonitored == true || daily.label == "black") {
            fillColor = "#687790";
            dataDisplayDay = "No Records";
          } else {
            if (daily.ratio < 100 && daily.ratio >= 99) {
              fillColor = "#3bd671"; // orange color
              fillOpacity = '0.5';
            } else if (daily.ratio < 99 && daily.ratio >= 95) {
              fillColor = '#f29030'; // orange color
            } else if (daily.ratio < 95) {
              fillColor = '#df484a'; // red color
            }
          }

          bars += '<rect height="' + svgH + '" width="' + barW + '" x="' + (i - startI) * barGap + '" y="0" fill="' + fillColor + '" fill-opacity="' + fillOpacity + '" rx="' + barW / 2 + '" ry="' + barW / 2 + '" uk-tooltip="<div class=\'uk-text-muted font-12\'>' + days[i] + '</div>\
            ' + dataDisplayDay + '" />';

          var barContained = '\
            <div class="psp-charts uk-margin-small-top uk-flex uk-flex-middle">\
                <svg width="' + svgW + '" height="' + svgH + '" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + svgW + ' ' + svgH + '">\
                ' + bars + '\
                </svg>\
            </div>';
        }

        monitorHtml += barContained;
      });

      $('.psp-monitor-list').html(monitorHtml);
    }
 })
}

