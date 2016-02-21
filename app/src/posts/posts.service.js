(function(){
  'use strict';

  angular.module('msp.posts')
         .service('msp.posts.services', ['$q', '$resource', 'API_URL', postServices]);

  function postServices($q, $resource, API_URL) {

    /**
     * A local list of all subscribed listeners for new post creation
     * @type {Array}
     */
    var newPostListeners = [];

    return {
      /**
       * Load the full feed
       * @return   {Promise}          A promise that resolves to an array
       */
      loadFeed : function() {
        var deferred = $q.defer();

        endPoints().list.query(function(postList) {
          endPoints().post.query(function(posts) {
            _.each(posts, function(post) {
              endPoints().like.query({post: post.id}, function(likes) {
                post.likes = likes.length;
              });
            });
            deferred.resolve(posts.concat(postList));
          }, function() {
            deferred.resolve(postList);
          });
        });

        return deferred.promise;
      },

      /**
       * Load the timeline of a specific user
       * @param    {Object}          params An object containing 'username'
       * @return   {Promise}                 A promise that resolves to an array
       */
      loadTimeline: function(params) {
        var deferred = $q.defer();

        endPoints().list.query(function(postList) {
          var timeline = _.filter(postList, function(post) {
            return post.user.username === params.username;
          });

          endPoints().post.query(function(posts) {
            deferred.resolve(posts.concat(timeline));
          }, function() {
            deferred.resolve(timeline);
          });
        });

        return deferred.promise;
      },

      /**
       * Save a post
       * @param    {Object}          post The full new post object to save
       * @return   {Promise}               A promise that reolves to an object
       */
      savePost: function(post) {
        var overrides = {
          _id: 'OBJ' + Math.round(Math.random() * 10000), //unique ID simulation (normally done on server)
          content: post.content
        };

        /**
         * NOTE: This is how you would do in an ideal API-driven env, but commented out for the coding challenge
         * @type {Resource}
         */
        // var Post = endPoints().newPost;
        // var newPost = new Post(post);
        // return newPost.$save.$promise;
        
        /**
         * Below is a hack for this coding challenge
         */
        var deferred = $q.defer();
        endPoints().newPost.get(function(newPost) {
          angular.extend(newPost, overrides);
          deferred.resolve(newPost);
          notifyNewPostListeners(newPost);
        });
        return deferred.promise;
      },
      like: function(postId) {
        var deferred = $q.defer();

        endPoints().like.save({post: postId}, function(likes) {
          deferred.resolve();
        }, function() {
          deferred.reject();
        });

        return deferred.promise;
      },
      /**
       * A custom event handler
       * @param    {String}          ev The event name
       * @param    {Function}        cb The listener to the event
       * @return   {Boolean}         Whether the event was added to queue
       */
      on: function(ev, cb) {
        if (ev === 'newpost') {
          newPostListeners.push(cb);
          return true;
        }
      }
    };

    /**
     * List of endpoints for this service
     * @return   {Object}          The end points
     */
    function endPoints() {
      return {
        list: $resource('src/dev/postList.json'),
        post: $resource(API_URL + '/post?sort=createdAt%20DESC'),
        like: $resource(API_URL + '/like'),
        newPost: $resource('src/dev/newPost.json')
      }
    }

    /**
     * Execute each listener
     * @param    {Object}          newPost The full new post object
     * @return   {Void}
     */
    function notifyNewPostListeners(newPost) {
      _.map(newPostListeners, function(listener) {
        listener(newPost);
      });
    }
  }

})();
