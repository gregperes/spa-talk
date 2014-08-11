(function () {

  var app = angular.module('todoApp', []);

  app.service('TodoService', function($http, $q, $location) {

    var baseUrl = "http://localhost:8000/todos";

    var todoService = {

      get: function () {

        var deferred = $q.defer();

        $http.get(baseUrl)
          .success(function (response) {
            deferred.resolve(response);
          });

        return deferred.promise;
      },

      add: function(todo) {

        var deferred = $q.defer();

        $http.post(baseUrl, todo)
          .success(function (response) {
            deferred.resolve(response);
          });

        return deferred.promise;
      },

      edit: function(todo) {
        
        var deferred = $q.defer();
        var url = baseUrl + "/" + todo._id;

        $http.put(url, todo)
          .success(function (response) {
            deferred.resolve(response);
          }); 

        return deferred.promise;
      },

      destroy: function(todo) {
        
        var deferred = $q.defer();
        var url = baseUrl + "/" + todo._id;

        $http.delete(url, todo)
          .success(function (response) {
            deferred.resolve(response);
          }); 

        return deferred.promise;
      }
    };

    return todoService;
  });

  app.controller("TodoCtrl", function($scope, TodoService) { 

    var get = function () {

      TodoService.get()
        .then(function (data) {

          $scope.todos = data;
        });
    };

    get();

    $scope.add = function () {

      var todo = { description: $scope.todoDescription };

      TodoService.add(todo)
        .then(function (data) { 

          $scope.todos.push(data);
        });

      $scope.todoDescription = "";
    };

    $scope.edit = function (todo) {

      TodoService.edit(todo);
    };

    $scope.destroy = function (todo) {

      TodoService.destroy(todo)
        .then(function (data) {
          
          get();
        });
    };
  });

})();