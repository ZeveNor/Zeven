
var apiURL = 'https://stats.uptimerobot.com/api/getMonitorList/vVXxLj0Nu3?page=2&_=1731512595501';
window.compact = false;

$(function () {
  var counter = document.getElementsByClassName('counter')[0];
  var current = parseInt(counter.innerText);
  callMonitorRender();
  // if (current > 0) {
  //   var t = current - 1;
  //   if (t.toString().length == 1) {
  //     t = '0' + t.toString();
  //   }
  //   counter.innerText = t;
  // }
  // else {
  //   counter.innerText = "59";
  //   callMonitorRender();
  //   document.getElementsByClassName('last-updated')[0].innerText = new Date().toLocaleTimeString();
  // }
});

function callMonitorRender() { 
  $.ajax({
    type: "GET",
    url: apiURL,
    dataType: "json",
    cache: false,
    success: function (data) {
      console.log(data);
      
      var downCount = data.statistics.counts.down;
      var upCount = data.statistics.counts.up;
      var pausedCount = data.statistics.counts.paused;
      var totalCount = data.statistics.counts.total;
      var totalMonitors = data.psp.totalMonitors;

      var timezone = data.psp.timezone;

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

          /* set up a bar color based on value */
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

        // Generate status dot for monitor
        if (monitorData.statusClass == "success") {
          statusDot = '<div class="uk-text-primary" title="Operational"><span class="dot" aria-hidden="true"></span><span class="uk-visible@s m-l-10">';
          statusDot += window.compact ? 'Up' : 'Operational';
          statusDot += '</span></div>';
        } else if (monitorData.statusClass == "danger") {
          statusDot = '<div class="uk-text-danger" title="Down"><span class="dot is-error" aria-hidden="true"></span><span class="uk-visible@s m-l-10">Down</span></div>';
        } else {
          statusDot = '<div class="uk-text-muted" title="Not monitored"><span class="dot is-grey" aria-hidden="true"></span><span class="uk-visible@s m-l-10">';
          statusDot += window.compact ? 'N/A' : 'Not monitored';
          statusDot += '</span></div>';
        }

        // Generate HTML for monitor row
        monitorHtml += '\
          <div class="psp-monitor-row">\
          <div class="uk-flex uk-flex-between uk-flex-wrap">';

        monitorHtml += '<div class="psp-monitor-row-header uk-text-muted uk-flex uk-flex-auto">';
        monitorHtml += '<a title="' + monitorData.name + '" class="psp-monitor-name uk-text-truncate uk-display-inline-block" href="' + pageUrl + '/' + monitorData.monitorId + '">\
          ' + monitorData.name + '\
          <svg class="icon icon-plus-square uk-flex-none"></svg>\
          </a>';
        monitorHtml += '<div class="uk-flex-none">';

        monitorHtml += '<span class="m-r-5 m-l-5 uk-visible@s">|</span>';

        monitorHtml += '<div class="psp-monitor-row-status uk-visible@s">' + statusDot + '</div>';
        monitorHtml += '<div class="uk-hidden@s uk-text-primary">' + monitorData['30dRatio']['ratio'] + '%</div>';
        monitorHtml += '</div>';
        monitorHtml += barContained;
        monitorHtml += '</div>';
      });

      $('.psp-monitor-list').html(monitorHtml);
    }
 })
}

