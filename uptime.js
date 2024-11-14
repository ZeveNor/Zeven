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
      var barLimit = 70; 
      var svgW = '100%';
      var svgWVW = '980'; 
      var svgH = window.compact ? 15 : 55;
      var barGap = window.compact ? 5.9 : "14";    
      var barW = window.compact ? 3.25 : "10"; 
      
      var rxR = 0;

      if (w <= 1500) { 
        barLimit = 30;   
        svgWVW = '530';  
        barGap = 17.5;  
        barW = 14;
      }
      if (w <= 991) {
        barLimit = 30;
        svgWVW = '770';
        barGap = 25.7;
        barW = 20;
        rxR = 0;
      }
      
      if (w <= 500) { 
        barLimit = 7;
        svgWVW = '300';
        barGap = 42; 
        barW = 35;
        rxR = 0;
      }


      // if (w <= 768) {
      //   barLimit = 30;
      //   barGap = 19.8;
      //   barW = 10; 
      //   svgW = "100%";
      //   svgWVW = '868';
      //   svgH = window.compact ? 30 : 60;
      // }

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
          // bars += '<rect  height="' + svgH + '" width="' + barW + '" x="' + (i - startI) * barGap + '" y="0" fill="' + fillColor + '" fill-opacity="' + fillOpacity + '" rx="' + barW / 2 + '" ry="' + barW / 2 + '" uk-tooltip="<div class=\'uk-text-muted font-12\'>' + days[i] + '</div>\
          //   ' + dataDisplayDay + '" />'; 
          bars += '<rect  height="' + svgH + '" width="' + barW + '" x="' + (i - startI) * barGap + '" y="0" fill="' + fillColor + '" fill-opacity="' + fillOpacity + '" rx="' + rxR + '" ry="' + rxR + '" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" title="' + days[i] + '" data-bs-content="' + dataDisplayDay +'" />';
          // var barContained = '\
          //   <div class="psp-charts">\
          //       <svg width="' + svgW + '" height="' + svgH + '" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + svgW + ' ' + svgH + '">\
          //       ' + bars + '\
          //       </svg>\
          //   </div>';
          var barContained = `
            <div class="psp-charts">
              <svg width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${svgWVW} ${svgH}">
                ${bars}
              </svg>
              <script>
                $(document).ready(function(){
                $('[data-bs-toggle="popover"]').popover();
                console.log("Clicked");
                const popover = new bootstrap.Popover('.popover-dismiss', {
                  trigger: 'focus'
                })
              });
              <\/script>
            </div>
          `;
        }

        monitorHtml += barContained;
      });
      $('.psp-monitor-list').html(monitorHtml);
    }
    
  })

  // var monitorHtml = `
  // <svg width="100%" height="55" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 835 55"> 
  //   <rect height="55" width="10" x="0" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 19, 2024" data-bs-original-title="September 19, 2024"></rect>
  //   <rect height="55" width="10" x="15" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 20, 2024" data-bs-original-title="September 20, 2024"></rect>
  //   <rect height="55" width="10" x="30" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 21, 2024" data-bs-original-title="September 21, 2024"></rect>
  //   <rect height="55" width="10" x="45" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 22, 2024" data-bs-original-title="September 22, 2024"></rect>
  //   <rect height="55" width="10" x="60" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 23, 2024" data-bs-original-title="September 23, 2024"></rect>
  //   <rect height="55" width="10" x="75" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 24, 2024" data-bs-original-title="September 24, 2024"></rect>
  //   <rect height="55" width="10" x="90" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 25, 2024" data-bs-original-title="September 25, 2024"></rect>
  //   <rect height="55" width="10" x="105" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 26, 2024" data-bs-original-title="September 26, 2024"></rect>
  //   <rect height="55" width="10" x="120" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 27, 2024" data-bs-original-title="September 27, 2024"></rect>
  //   <rect height="55" width="10" x="135" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 28, 2024" data-bs-original-title="September 28, 2024"></rect>
  //   <rect height="55" width="10" x="150" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 29, 2024" data-bs-original-title="September 29, 2024"></rect>
  //   <rect height="55" width="10" x="165" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="September 30, 2024" data-bs-original-title="September 30, 2024"></rect>
  //   <rect height="55" width="10" x="180" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 1, 2024" data-bs-original-title="October 1, 2024"></rect>
  //   <rect height="55" width="10" x="195" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 2, 2024" data-bs-original-title="October 2, 2024"></rect>
  //   <rect height="55" width="10" x="210" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 3, 2024" data-bs-original-title="October 3, 2024"></rect>
  //   <rect height="55" width="10" x="225" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 4, 2024" data-bs-original-title="October 4, 2024"></rect>
  //   <rect height="55" width="10" x="240" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 5, 2024" data-bs-original-title="October 5, 2024"></rect>
  //   <rect height="55" width="10" x="255" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 6, 2024" data-bs-original-title="October 6, 2024"></rect>
  //   <rect height="55" width="10" x="270" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 7, 2024" data-bs-original-title="October 7, 2024"></rect>
  //   <rect height="55" width="10" x="285" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 8, 2024" data-bs-original-title="October 8, 2024"></rect>
  //   <rect height="55" width="10" x="300" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 9, 2024" data-bs-original-title="October 9, 2024"></rect>
  //   <rect height="55" width="10" x="315" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 10, 2024" data-bs-original-title="October 10, 2024"></rect>
  //   <rect height="55" width="10" x="330" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 11, 2024" data-bs-original-title="October 11, 2024"></rect>
  //   <rect height="55" width="10" x="345" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 12, 2024" data-bs-original-title="October 12, 2024"></rect>
  //   <rect height="55" width="10" x="360" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 13, 2024" data-bs-original-title="October 13, 2024"></rect>
  //   <rect height="55" width="10" x="375" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 14, 2024" data-bs-original-title="October 14, 2024"></rect>
  //   <rect height="55" width="10" x="390" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 15, 2024" data-bs-original-title="October 15, 2024"></rect>
  //   <rect height="55" width="10" x="405" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 16, 2024" data-bs-original-title="October 16, 2024"></rect>
  //   <rect height="55" width="10" x="420" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 17, 2024" data-bs-original-title="October 17, 2024"></rect>
  //   <rect height="55" width="10" x="435" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 18, 2024" data-bs-original-title="October 18, 2024"></rect>
  //   <rect height="55" width="10" x="450" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 19, 2024" data-bs-original-title="October 19, 2024"></rect>
  //   <rect height="55" width="10" x="465" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 20, 2024" data-bs-original-title="October 20, 2024"></rect>
  //   <rect height="55" width="10" x="480" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 21, 2024" data-bs-original-title="October 21, 2024"></rect>
  //   <rect height="55" width="10" x="495" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 22, 2024" data-bs-original-title="October 22, 2024"></rect>
  //   <rect height="55" width="10" x="510" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 23, 2024" data-bs-original-title="October 23, 2024"></rect>
  //   <rect height="55" width="10" x="525" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 24, 2024" data-bs-original-title="October 24, 2024"></rect>
  //   <rect height="55" width="10" x="540" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 25, 2024" data-bs-original-title="October 25, 2024"></rect>
  //   <rect height="55" width="10" x="555" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 26, 2024" data-bs-original-title="October 26, 2024"></rect>
  //   <rect height="55" width="10" x="570" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 27, 2024" data-bs-original-title="October 27, 2024"></rect>
  //   <rect height="55" width="10" x="585" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 28, 2024" data-bs-original-title="October 28, 2024"></rect>
  //   <rect height="55" width="10" x="600" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 29, 2024" data-bs-original-title="October 29, 2024"></rect>
  //   <rect height="55" width="10" x="615" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 30, 2024" data-bs-original-title="October 30, 2024"></rect>
  //   <rect height="55" width="10" x="630" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="October 31, 2024" data-bs-original-title="October 31, 2024"></rect>
  //   <rect height="55" width="10" x="645" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 1, 2024" data-bs-original-title="November 1, 2024"></rect>
  //   <rect height="55" width="10" x="660" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 2, 2024" data-bs-original-title="November 2, 2024"></rect>
  //   <rect height="55" width="10" x="675" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 3, 2024" data-bs-original-title="November 3, 2024"></rect>
  //   <rect height="55" width="10" x="690" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 4, 2024" data-bs-original-title="November 4, 2024"></rect>
  //   <rect height="55" width="10" x="705" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 5, 2024" data-bs-original-title="November 5, 2024"></rect>
  //   <rect height="55" width="10" x="720" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 6, 2024" data-bs-original-title="November 6, 2024"></rect>
  //   <rect height="55" width="10" x="735" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 7, 2024" data-bs-original-title="November 7, 2024"></rect>
  //   <rect height="55" width="10" x="750" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 8, 2024" data-bs-original-title="November 8, 2024"></rect>
  //   <rect height="55" width="10" x="765" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 9, 2024" data-bs-original-title="November 9, 2024"></rect>
  //   <rect height="55" width="10" x="780" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 10, 2024" data-bs-original-title="November 10, 2024"></rect>
  //   <rect height="55" width="10" x="795" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 11, 2024" data-bs-original-title="November 11, 2024"></rect>
  //   <rect height="55" width="10" x="810" y="0" fill="#687790" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="No Records" aria-label="November 12, 2024" data-bs-original-title="November 12, 2024"></rect>
  //   <rect height="55" width="10" x="825" y="0" fill="#3bd671" fill-opacity="1" rx="5" ry="5" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="100.00%" aria-label="November 13, 2024" data-bs-original-title="November 13, 2024"></rect>
  // </svg>
  // <script>
  //   $(document).ready(function () {
  //       $('[data-bs-toggle="popover"]').popover();
  //     });
  // </script>
  // `
  // $('.psp-monitor-list').html(monitorHtml);
}
