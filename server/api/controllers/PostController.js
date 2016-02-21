/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var path = require('path');
var unzip = require('unzip-wrapper');

module.exports = {
  restricted: function(req, res) {
    return res.send("If you can see this you are authenticated.");
  },
  open: function(req, res) {
    return res.ok("This action is open.");
  },
  jwt: function(req, res) {
    return res.ok("You have a JSON web token.");
  },
  uploadGame: function(req, res) {

    req.file('game').upload({
      maxBytes: 1000000000,
      dirname: '../public/games'
    }, function whenDone(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded');
      }
      var pathFile = uploadedFiles[0].fd;
      var gameId = path.basename(pathFile, '.zip');
      var gameUrl = path.join(path.dirname(pathFile), gameId);

      unzip(pathFile, {fix: true, target: gameUrl}, function(err) {
        if (err) {
          console.log(err.message);
          return res.badRequest(err.message);
        }
        
        fs.unlink(pathFile, function(err) {
          if (err) {
            console.log(err.message);
            return res.badRequest(err.message);
          }
        
          return res.send({
            message: 'Game uploaded successfully!',
            gameId: gameId
          }); 
        });

      });
    });
  }
};
