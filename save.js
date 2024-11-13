// function callMonitorList(apiPageValue, initialLoad) {

//   if (apiPageValue === undefined) {
//     apiPageValue = 1;
//   }

//   var retryLimit = 2;

//   $.ajax({
//     type: "GET",
//     url: apiURL,
//     dataType: "json",
//     cache: false,
//     success: function (data) {

//       var downCount = data.statistics.counts.down;
//       var upCount = data.statistics.counts.up;
//       var pausedCount = data.statistics.counts.paused;
//       var totalCount = data.statistics.counts.total;
//       var totalMonitors = data.psp.totalMonitors;

//       // Set up variables for status change checking
//       try {
//         // localStorage is accessible so we can save..
//         var oldStatusUp = localStorage.getItem("PSPStatusUp['" + pspi + "'']") || null;
//         var oldStatusDown = localStorage.getItem("PSPStatusDown['" + pspi + "'']") || null;
//         localStorage.setItem("PSPStatusUp['" + pspi + "'']", upCount);
//         localStorage.setItem("PSPStatusDown['" + pspi + "'']", downCount);
//       } catch (e) {
//         // localStorage is not accessible - fallback to window method
//         var oldStatusUp = window.oldStatusUp;
//         var oldStatusDown = window.oldStatusDown;
//         window.oldStatusUp = upCount;
//         window.oldStatusDown = downCount;
//       }

//       var statusChanged = false;

//       if (oldStatusUp != upCount || oldStatusDown != downCount) {
//         statusChanged = true;
//       }

//       // Display actual counts
//       $('#totalCount').text(totalMonitors);
//       $('#upCount').text(upCount);
//       $('#downCount').text(downCount);
//       $('#pausedCount').text(pausedCount);

//       window.timeZone = data.psp.timezone;

//       $(".psp-main-status-dot").removeClass('is-grey is-error is-warning');

//       if (downCount == 0 && (pausedCount != totalMonitors)) {
//         $('.psp-main-status').html('All systems <span class="uk-text-primary">operational</span>');
//       } else if (upCount == 0 && pausedCount == 0) {
//         $(".psp-main-status-dot").addClass('is-error');
//         $('.psp-main-status').html('All systems <span class="uk-text-danger">down</span>');
//         playAlertSound();
//       } else if (downCount != 0 && (pausedCount != totalMonitors)) {
//         $(".psp-main-status-dot").addClass('is-warning');
//         $('.psp-main-status').html('Some systems down');
//         playAlertSound();
//       } else if (pausedCount == totalMonitors) {
//         $(".psp-main-status-dot").addClass('is-grey');
//         $('.psp-main-status').html('System is not monitored');
//       }

//       var monitorHtml = '';

//       // START Generate monitor list

//       if (pausedCount == totalMonitors) {
//         $('.psp-monitor-list').html('<div class="uk-text-center uk-text-muted">All monitors are paused!</div>');
//       } else {

//         var days = data.days.reverse();

//         if (window.showB) {
//           var w = window.innerWidth;
//         }

//         var barLimit = 90;
//         var svgW = window.compact ? 530 : 880;
//         var svgH = window.compact ? 15 : 30;
//         var barGap = window.compact ? 5.9 : 9.8;
//         var barW = window.compact ? 3.25 : 6;

//         if (w <= 768) {
//           barLimit = 30;
//           barGap = 19.8;
//           barW = 12;
//           svgW = 588;
//           svgH = window.compact ? 30 : 60;
//         }

//         $('.psp-day-number').text(barLimit);

//         $.each(data.psp.monitors, function (i, mon) {

//           if (window.hidePM && mon.statusClass == "black") {
//             // do nothing
//           } else {
//             var statusDot = '';
//             var bars = '';

//             if (window.showB) {

//               var startI = 90 - barLimit;
//               var dailyData = mon.dailyRatios.reverse();

//               // Generate bars for monitor
//               for (var i = startI; i < 90; i++) {
//                 var daily = dailyData[i];
//                 var notMonitored = false;
//                 var d = new Date(days[i]).getTime() / 1000;
//                 var dataDisplayDay = daily.ratio + '%';

//                 if (d < mon.createdAt - 86400) {
//                   notMonitored = true;
//                 } else {
//                   notMonitored = false;
//                 }

//                 /* set up a bar color based on value */
//                 var fillColor = "#3bd671"; // green color
//                 var fillOpacity = '1';

//                 if (notMonitored == true || daily.label == "black") {
//                   fillColor = "#687790";
//                   dataDisplayDay = "No Records";
//                 } else {
//                   if (daily.ratio < 100 && daily.ratio >= 99) {
//                     fillColor = "#3bd671"; // orange color
//                     fillOpacity = '0.5';
//                   } else if (daily.ratio < 99 && daily.ratio >= 95) {
//                     fillColor = '#f29030'; // orange color
//                   } else if (daily.ratio < 95) {
//                     fillColor = '#df484a'; // red color
//                   }
//                 }

//                 bars += '<rect height="' + svgH + '" width="' + barW + '" x="' + (i - startI) * barGap + '" y="0" fill="' + fillColor + '" fill-opacity="' + fillOpacity + '" rx="' + barW / 2 + '" ry="' + barW / 2 + '" uk-tooltip="<div class=\'uk-text-muted font-12\'>' + days[i] + '</div>\
//                                 ' + dataDisplayDay + '" />';

//                 var barContained = '\
//                                     <div class="psp-charts uk-margin-small-top uk-flex uk-flex-middle">\
//                                         <svg width="' + svgW + '" height="' + svgH + '" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + svgW + ' ' + svgH + '">\
//                                         ' + bars + '\
//                                         </svg>\
//                                     </div>';
//               }

//             }


//             // Generate status dot for monitor
//             if (mon.statusClass == "success") {
//               statusDot = '<div class="uk-text-primary" title="Operational"><span class="dot" aria-hidden="true"></span><span class="uk-visible@s m-l-10">';
//               statusDot += window.compact ? 'Up' : 'Operational';
//               statusDot += '</span></div>';
//             } else if (mon.statusClass == "danger") {
//               statusDot = '<div class="uk-text-danger" title="Down"><span class="dot is-error" aria-hidden="true"></span><span class="uk-visible@s m-l-10">Down</span></div>';
//             } else {
//               statusDot = '<div class="uk-text-muted" title="Not monitored"><span class="dot is-grey" aria-hidden="true"></span><span class="uk-visible@s m-l-10">';
//               statusDot += window.compact ? 'N/A' : 'Not monitored';
//               statusDot += '</span></div>';
//             }

//             // Generate HTML for monitor row
//             monitorHtml += '\
//                             <div class="psp-monitor-row">\
//                                 <div class="uk-flex uk-flex-between uk-flex-wrap">';
//             if (window.compact) {
//               monitorHtml += '<div class="psp-monitor-row-header uk-text-muted uk-flex uk-flex-auto uk-flex-between">';
//             } else {
//               monitorHtml += '<div class="psp-monitor-row-header uk-text-muted uk-flex uk-flex-auto">';
//             }
//             if (window.enableD) {
//               monitorHtml += '<a title="' + mon.name + '" class="psp-monitor-name uk-text-truncate uk-display-inline-block" href="' + pageUrl + '/' + mon.monitorId + '">\
//                                             ' + mon.name + '\
//                                             <svg class="icon icon-plus-square uk-flex-none"><use xlink:href="/assets/symbol-defs.svg#icon-arrow-right"></use></svg>\
//                                             </a>';
//             } else {
//               monitorHtml += '<span class="psp-monitor-name uk-text-truncate uk-display-inline-block">' + mon.name + '</span>';
//             }

//             monitorHtml += '<div class="uk-flex-none">';

//             if (window.showUP) {
//               if (!window.compact) {
//                 monitorHtml += '<span class="m-r-5 m-l-5 uk-visible@s">|</span>';
//               }
//               monitorHtml += '<span class="uk-text-primary uk-visible@s">' + mon[barLimit + 'dRatio']['ratio'] + '%</span>';
//             }

//             if (mon.url !== null) {
//               if (mon.type !== 'Heartbeat') {
//                 monitorHtml += '<svg class="icon icon-help-circle font-12 uk-flex-none uk-visible@s" uk-tooltip title="<div class=\'uk-text-muted font-12\'>' + mon.type + '</div><div class=\'font-12\'>' + mon.url + '</div>"><use xlink:href="/assets/symbol-defs.svg#icon-help-circle"></use></svg>';
//               } else {
//                 monitorHtml += '<svg class="icon icon-help-circle font-12 uk-flex-none" uk-tooltip title="<div class=\'uk-text-muted font-12\'>' + mon.type + '</div>"><use xlink:href="/assets/symbol-defs.svg#icon-help-circle"></use></svg>';
//               }
//             }

//             monitorHtml += '\
//                                             <div class="uk-hidden@s uk-margin-small-left">' + statusDot + '</div>\
//                                         </div>\
//                                     </div>';

//             if (window.showB && window.compact) {
//               monitorHtml += barContained;
//             }

//             monitorHtml += '<div class="psp-monitor-row-status uk-visible@s">' + statusDot + '</div>';

//             if (window.showUP) { monitorHtml += '<div class="uk-hidden@s uk-text-primary">' + mon['30dRatio']['ratio'] + '%</div>'; }


//             monitorHtml += '</div>';

//             if (window.showB && !window.compact) {
//               monitorHtml += barContained;
//             }

//             monitorHtml += '</div>';
//           }
//         });

//         // Fill monitor list html
//         $('.psp-monitor-list').html(monitorHtml);

//       }

//       $('.psp-monitor-preloader').addClass('uk-hidden');

//       $('.psp-calendar-link').attr('href', pageUrl + '/' + data.psp.monitors[0].monitorId + '/calendar');
//       $('.psp-history-link').attr('href', pageUrl + '/history');
//       // END Generate monitor list


//       // Latest downtime
//       if (window.enableD && data.statistics.latest_downtime !== null && window.showO) {
//         var downtime = data.statistics.latest_downtime;
//         $('.psp-latest-downtime').html('<a href="' + pageUrl + '/' + downtime.monitorID + '#logs">Latest downtime</a> detected ' + downtime.ago + '.');
//       }

//       if (window.showO == false) {
//         $('.outage-days').text('30');
//       }

//       if (initialLoad) {
//         callEventFeed(false, null, null); // fromNow? ; fromDate, toDate
//         // display favicon with downcount
//         initFaviconBadge(downCount);
//       } else if (statusChanged) {
//         callEventFeed(true, null, null); // fromNow? ; fromDate, toDate
//         // display favicon with downcount
//         initFaviconBadge(downCount);
//       }

//       // Monitors paging
//       if (data.psp.totalMonitors > data.psp.perPage) {

//         var lastPage = Math.ceil(data.psp.totalMonitors / data.psp.perPage);
//         var pageLimit = 50;
//         var startPoint = 1;
//         var breakLimit = 5;

//         var paginationHtml = '<ul class="uk-pagination uk-flex-center">';

//         var currentPage = apiPageValue;

//         var previousPage = currentPage == 1 ? 1 : currentPage - 1;
//         var nextPage = currentPage + 1;

//         var disabledClass = currentPage == 1 ? 'uk-disabled' : '';

//         paginationHtml += '<li class="' + disabledClass + '"><a href="#" data-page="1">«</a></li>';
//         paginationHtml += '<li class="' + disabledClass + '"><a href="#" data-page="' + previousPage + '">&lsaquo;</a></li>';

//         if (lastPage < pageLimit) {
//           pageLimit = lastPage;
//         } else {
//           if (currentPage > breakLimit) {
//             startPoint = currentPage - breakLimit;
//             pageLimit = startPoint + (pageLimit - 1);

//             if (pageLimit > lastPage) {
//               pageLimit = lastPage;
//             }
//           }
//         }
//         for (var i = startPoint; i <= pageLimit; i++) {
//           var active = currentPage == i ? 'uk-active' : '';
//           paginationHtml += '<li class="' + active + '"><a href="#" data-page="' + i + '">' + i + '</a></li>';
//         }

//         disabledClass = currentPage == lastPage ? 'uk-disabled' : '';
//         paginationHtml += '<li class="' + disabledClass + '"><a href="#" data-page="' + nextPage + '">&rsaquo;</a></li>';
//         paginationHtml += '<li class="' + disabledClass + '"><a href="#" data-page="' + lastPage + '">»</a></ul>';

//         $('.psp-monitor-pagination').html(paginationHtml);
//       }

//       // Fill overall statistic
//       if (data.statistics.uptime) {
//         var n = 1;
//         $.each(data.statistics.uptime, function (k, v) {
//           $('#overall-uptime div:nth-child(' + n + ') h3').addClass(v.label).html(v.ratio + '%');
//           n++;
//         });
//       }

//     },
//     error: function (error) {
//       console.log(error);
//     }
//   });
// }

// /* Set Favicon badge library */
// function initFaviconBadge(count) {
//   if (count > 0) {
//     favicon.badge(count);
//   } else {
//     favicon.reset();
//   }
// }


// $(function () {

//   /* Main init */
//   var cInt = setInterval(countdown, 1000);
//   $('.last-updated').text(new Date().toLocaleTimeString());
//   callMonitorList(1, true);

//   /* END Main init */
//   $('.psp-monitor-pagination').on('click', 'a', function (e) {

//     $('.psp-monitor-list').html('');
//     $('.psp-monitor-preloader').removeClass('uk-hidden');
//     e.preventDefault();
//     var p = parseInt($(this).data('page'));
//     $('.psp-monitor-pagination').attr('data-page', p);
//     callMonitorList(p, false);
//     $('html, body').animate({
//       scrollTop: $("#monitors").offset().top - 50
//     }, 200);
//     return false;

//   });
// });