###
Service to be passed to a promise catch, will find the error
in the response and display it.
###

angular.module('toaster').service 'toasterCatchService',
  (
    toasterService
    $q
  ) ->
    return (response) ->
      if response.data?.errors?
        for error in response.data.errors
          if error.message
            toasterService.error(error.message)

      return $q.reject(response)
