"use strict";

function fetch() {
  return [{
    name: 'Alice'
  }];
}

function getList(page) {
  return new Promise(function ($return, $error) {
    var list;
    return Promise.resolve(fetch(page)).then(function ($await_1) {
      try {
        list = $await_1;
        return $return(list);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}

(function () {
  return new Promise(function ($return, $error) {
    return Promise.resolve(getList(1)).then(function ($await_2) {
      try {
        console.log($await_2);
        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
})();