angular.module('toaster').controller 'toasterCtrl',
  (
    $scope
    toasterService
  ) ->
    $scope.toasters = toasterService.toasters

    $scope.dismissAll = (toasters) ->
      for toaster in toasters
        toaster.promise.reject()
