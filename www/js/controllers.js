angular.module('starter.controllers', [])

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

.controller('AppCtrl', function($scope, $state, $interval, hzTripRewards) {
  $scope.drivingData = null;
  $scope.isDriveMode = false;
  $scope.isFocused = true;
  $scope.start = start;
  $scope.stop = stop;

  var runningInterval;

  initDrivingData();

  // private
  function initDrivingData() {
    $scope.drivingData = {
      lastFocusDistance: 0,
      totalDistance: 0,
      withFocus: 0,
      withoutFocus: 0
    };
  }

  // public
  function start() {
    $scope.isDriveMode = true;

    runningInterval = $interval(function() {
      var distanceDelta = 0.2;
      
      /**
       * HARD-CODED ALERT WHEN USER LOOSES FOCUS ON THE ROAD
       */
      if ($scope.drivingData.totalDistance > 1.0 && $scope.drivingData.totalDistance < 2.4) {
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
    }, 1000);
  };

  // public
  function stop() {
    clearInterval(runningInterval);

    $scope.isDriveMode = false;

    hzTripRewards.addReward(
      $scope.drivingData.totalDistance,
      $scope.drivingData.withFocus,
      $scope.drivingData.withoutFocus
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
