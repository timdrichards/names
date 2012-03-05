var fs   = require('fs');
var path = require('path');

var dbfile = 'names.json';

function loadDB(cb) {
    fs.readFile(dbfile, function (err, data) {
        if (err) {
            throw new Error('Error reading database: ' + err);
        }
        cb(JSON.parse(data));
    });
}

function saveDB(names, cb) {
    var json = JSON.stringify(names);
    fs.writeFile(dbfile, json, function (err) {
        if (err) {
            throw new Error('Could not write ' + dbfile);
        } 
        cb();
    });
}

function toList(names) {
    var s = '<ul>';
    for (var i = 0; i < names.length; i++)
        s += '<li>' + names[i] + '</li>';
    s += '</ul>';
    return s;
}

exports.index = function(req, res){
    var name = req.params.name;

    path.exists(dbfile, function (exists) {
        if (!exists) {
            var names = name ? [name] : [];
            var json  = JSON.stringify(names);
            saveDB(names, function () {
                res.render('index', { 
                    'title' : 'Names',
                    'names' : toList(names) });
            });
        } else {
            loadDB(function (names) {
                if (name) names.push(name);
                saveDB(names, function () {
                    res.render('index', { 
                        'title' : 'Names',
                        'names' : toList(names) });
                });
            });
        }
    });
};