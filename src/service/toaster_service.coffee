###
Holds the dialog service
###
angular.module('toaster').service 'toasterService',
  (
    $q
    $timeout
  ) ->
    toasters =
      success: []
      error:[]

    timeout_info = 4000
    timeout_call_to_action = 8000

    createToaster = (type, message, call_to_action, timeout) ->
      deferred = $q.defer()

      toaster =
        promise: deferred
        type: type
        message: message
        call_to_action: call_to_action

      closeToaster = ->
        if _.contains toasters[type], toaster
          deferred.reject()

      if timeout
        $timeout closeToaster, timeout

      toasters[type].unshift toaster

      deferred.promise.finally ->
        _.pull toasters[type], toaster

      deferred.promise.close = closeToaster
      return deferred.promise

    success: (message, call_to_action) ->
      if call_to_action
        timeout = timeout_call_to_action
      else
        timeout = timeout_info

      return createToaster 'success', message, call_to_action, timeout

    fixed: (message, call_to_action) ->
      return createToaster 'success', message, call_to_action

    error: (message, call_to_action) ->
      return createToaster 'error', message, call_to_action

    addListener: (callback) ->
      callbacks.push callback

    removeListener: (callback) ->
      _.pull(callbacks, callback)

    broadcastChange: ->
      for callback in callbacks
        callbacks()

    toasters: toasters
