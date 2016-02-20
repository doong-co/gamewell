(function(){
  'use strict';

  angular.module('msp.users')
         .service('msp.users.services', ['$q', '$resource', 'API_URL', userServices]);

  function userServices($q, $resource, API_URL) {

    return {
      /**
       * List of users
       * @return   {Promise}          A promise that resolves to an array
       */
      loadFriends : function() {
        return endPoints().friends.query().$promise;
      },

      /**
       * Load a specific user
       * @param    {Object}          params An object containing username, which would be a user's username or 'me'
       * @return   {Promise}                 A promise that resolves to an object
       */
      loadUser: function(params) {
        var deferred = $q.defer();

        if (params.username === 'me') {
          params.username = 'ritenv'; //HACK: usually logged-in username stored in localStorage / cookie, hard-coded for testing
        }

        endPoints().list.query(function(userList) {
          var user = _.find(userList, function(user) {
            return user.username === params.username;
          });

          deferred.resolve(user);
        });

        return deferred.promise;
      },

      /**
       * Load the currently logged-in user
       * @return   {Promise}          A promise that resolves to an object
       */
      loadCurrentUser: function() {
        return endPoints().currentUser.get().$promise;
      },
      publishGame: function(post) {
        var deferred = $q.defer();
        endPoints().publishGame.save(post, function(post) {
          deferred.resolve(post);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };

    /**
     * List of endpoints for this service
     * @return   {Object}          The end points
     */
    function endPoints() {
      return {
        list: $resource('src/dev/userList.json'),
        friends: $resource('src/dev/friendList.json'),
        currentUser: $resource('src/dev/currentUser.json'),
        publishGame: $resource(API_URL + '/post')
      }
    }

  }

})();
