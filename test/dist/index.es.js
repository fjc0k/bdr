/*!
 * bdr v1.5.0
 * (c) 2018-present fjc0k <fjc0kb@gmail.com> (https://github.com/fjc0k)
 * Released under the MIT License.
 */
var x;
(function (x) {
    x[x["1"] = 1] = "1";
})(x || (x = {}));
var Test = (function () {
    function Test() {
        this.t = 0;
        this.t = 1;
    }
    Test.prototype.getT = function () {
        return this.t;
    };
    return Test;
}());

export default Test;
export { x };
