require('es6-promise').polyfill();
require('isomorphic-fetch');
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;
const download = require('image-downloader');
var fs= require('fs');
var path = require('path');
const uuidv4 = require('uuid/v4');

const unsplash = new Unsplash({
    applicationId: "919c8f209e83154142dda2b4bb61197ca7acaa86230feaa2715b40b78d464de1",
    secret: "8f5989b4993cbfea9c97f010eb54d99d30ec83a2b32c165cd323bf2fd7203fc9",
    callbackUrl: "{CALLBACK_URL}"
  });

  unsplash.collections.getCollectionPhotos(2403296, 1, 10, "latest")
  .then(toJson)
  .then(async function (json) {
      console.log(json)
    for (var i = 0; i < json.length; i++) {
        var url = json[i].urls.regular;
        var id = uuidv4();
        const options = {
            url: url,
            dest: '/Users/minh/Downloads'
        }
       
        await download.image(options)
        .then(({ filename, image }) => {
            var filename = path.basename(filename);
            var oldPath = '/Users/minh/Downloads/' + filename;
            var newPath = '/Users/minh/Downloads/male/' + filename + '.jpg';

            fs.rename(oldPath, newPath, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            })  
        })
        .catch((err) => {
            console.error(err)
        })
    }
});
