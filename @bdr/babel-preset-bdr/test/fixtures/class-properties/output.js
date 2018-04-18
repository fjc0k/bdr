"use strict";

exports.__esModule = true;
exports.default = void 0;

var People =
/*#__PURE__*/
function () {
  function People() {
    this.married = false;
    this.marriagePartner = null;
  }

  People.destroy = function destroy() {
    console.log('Everybody dies.');
  };

  var _proto = People.prototype;

  _proto.marry = function marry(anotherPeople) {
    this.married = true;
    this.marriagePartner = anotherPeople;
  };

  return People;
}();

exports.default = People;
People.species = 'mammal';
