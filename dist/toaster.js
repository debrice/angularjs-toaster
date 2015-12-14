
/*
TMM toaster module
 */
angular.module('toaster', []);

angular.module('toaster').controller('toasterCtrl', function($scope, toasterService) {
  $scope.toasters = toasterService.toasters;
  return $scope.dismissAll = function(toasters) {
    var i, len, results, toaster;
    results = [];
    for (i = 0, len = toasters.length; i < len; i++) {
      toaster = toasters[i];
      results.push(toaster.promise.reject());
    }
    return results;
  };
});


/*
Service to be passed to a promise catch, will find the error
in the response and display it.
 */
angular.module('toaster').service('toasterCatchService', function(toasterService, $q) {
  return function(response) {
    var error, i, len, ref, ref1;
    if (((ref = response.data) != null ? ref.errors : void 0) != null) {
      ref1 = response.data.errors;
      for (i = 0, len = ref1.length; i < len; i++) {
        error = ref1[i];
        if (error.message) {
          toasterService.error(error.message);
        }
      }
    }
    return $q.reject(response);
  };
});


/*
Holds the dialog service
 */
angular.module('toaster').service('toasterService', function($q, $timeout) {
  var createToaster, timeout_call_to_action, timeout_info, toasters;
  toasters = {
    success: [],
    error: []
  };
  timeout_info = 4000;
  timeout_call_to_action = 8000;
  createToaster = function(type, message, call_to_action, timeout) {
    var closeToaster, deferred, toaster;
    deferred = $q.defer();
    toaster = {
      promise: deferred,
      type: type,
      message: message,
      call_to_action: call_to_action
    };
    closeToaster = function() {
      if (_.contains(toasters[type], toaster)) {
        return deferred.reject();
      }
    };
    if (timeout) {
      $timeout(closeToaster, timeout);
    }
    toasters[type].unshift(toaster);
    deferred.promise["finally"](function() {
      return _.pull(toasters[type], toaster);
    });
    deferred.promise.close = closeToaster;
    return deferred.promise;
  };
  return {
    success: function(message, call_to_action) {
      var timeout;
      if (call_to_action) {
        timeout = timeout_call_to_action;
      } else {
        timeout = timeout_info;
      }
      return createToaster('success', message, call_to_action, timeout);
    },
    fixed: function(message, call_to_action) {
      return createToaster('success', message, call_to_action);
    },
    error: function(message, call_to_action) {
      return createToaster('error', message, call_to_action);
    },
    addListener: function(callback) {
      return callbacks.push(callback);
    },
    removeListener: function(callback) {
      return _.pull(callbacks, callback);
    },
    broadcastChange: function() {
      var callback, i, len, results;
      results = [];
      for (i = 0, len = callbacks.length; i < len; i++) {
        callback = callbacks[i];
        results.push(callbacks());
      }
      return results;
    },
    toasters: toasters
  };
});
