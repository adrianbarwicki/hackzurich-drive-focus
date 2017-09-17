angular.module('starter.controllers', [])

.constant('API_URL', "http://drive-focus.vq-labs.com")

.service('hzTimeFormatter', function() {
  var convert = function(sec) {
    if (sec < 60) {
      return sec + 's';
    }

    return Math.floor(sec / 60) + ':' + (sec % 60);
  };

  return {
    convert: convert
  };
})
.service('hzApi', function($http, API_URL) {
  var checkStatus = function(cb) {
    return $http
    .get(API_URL + '/driver/behaviour')
    .then(response => {
      cb(response.data.extracted);
    }, err => {
      console.error(err);
    })
  };

  return {
    checkStatus: checkStatus
  };
})

.service('hzTripRewards', function() {
  var rewards = [];

  return {
    addReward: function(totalDistance, withFocus, withoutFocus) {
      // the use of the app is rewarded, driving with focus is incentivied while witout is being penalised
      var points = totalDistance + (2 * withFocus) - (10 * withoutFocus);

      // we do not allow negative points... negative feedback to the user!
      points = points < 0 ? 0 : points.toFixed(0);

      rewards.push({
        points: points,
        totalDistance: totalDistance.toFixed(1),
        withFocus: withFocus.toFixed(1),
        withoutFocus: withoutFocus.toFixed(1)
      })
    },
    getLast: function() {
      return rewards[rewards.length - 1]
    }
  };
})

.controller('AppCtrl', function($scope, $state, $interval, hzApi, hzTripRewards, hzTimeFormatter) {
  $scope.drivingData = null;
  $scope.isDriveMode = false;
  $scope.isFocused = true;
  $scope.start = start;
  $scope.stop = stop;

  $scope.calcTime = calcTime;

  $scope.displayTime = function() {
    return hzTimeFormatter.convert(calcTime())
  };

  var runningInterval;

  // it is not the best idea to invoke the $digest every sec, but for a 2sec fix, that's a good trade-off
  $interval(function() {
    $scope.now = Date.now();
  }, 1000);

  initDrivingData();

  // private
  function calcTime() {
    var time = ($scope.now / 1000 | 0) - $scope.drivingData.startTime;

    return time < 0 ? 0 : time;
  }

  // private
  function initDrivingData() {
    $scope.drivingData = {
      startTime: 0,
      lastFocusDistance: 0,
      totalDistance: 0,
      withFocus: 0,
      withoutFocus: 0
    };
  }

  // public
  function start() {
    $scope.isDriveMode = true;
    $scope.drivingData.startTime = Date.now() / 1000 | 0;

    runningInterval = $interval(function() {
      var distanceDelta = 0.2;

      hzApi.checkStatus(function(extractedInfo) {
        extractedInfo = extractedInfo || { isFocused: true };

        if (!extractedInfo.isFocused) {
          $scope.isFocused = false;

          $scope.drivingData.lastFocusDistance = 0;
          $scope.drivingData.withoutFocus = Math.round(($scope.drivingData.withoutFocus + distanceDelta) * 100) / 100;
        } else {
          $scope.isFocused = true;

          $scope.drivingData.lastFocusDistance = Math.round(($scope.drivingData.lastFocusDistance + distanceDelta) * 100) / 100;
          $scope.drivingData.withFocus = Math.round(($scope.drivingData.withFocus + distanceDelta) * 100) / 100;
        }
        
        // we round it up to two decimal places, as js sucks in handling addition of floats.
        $scope.drivingData.totalDistance = Math.round(($scope.drivingData.totalDistance + distanceDelta) * 100) / 100;
      });
    }, 1000);
  };

  // public
  function stop() {
    clearInterval(runningInterval);

    $scope.isDriveMode = false;

    var totalTimeInSeconds = calcTime();

    hzTripRewards.addReward(
      $scope.drivingData.totalDistance,
      $scope.drivingData.withFocus,
      $scope.drivingData.withoutFocus,
      totalTimeInSeconds
    );

    initDrivingData();

    $state.go('results');
  }
})

.controller('ResultCtrl', function($scope, $state, hzTripRewards) {
  $scope.reward = hzTripRewards.getLast();
  $scope.startOver = startOver;
  
  if (!$scope.reward) {
    startOver();
  }

  function startOver() {
    $state.go('driving');
  }
});
