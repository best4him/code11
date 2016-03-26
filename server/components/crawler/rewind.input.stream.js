/**
 * Created by AncientMachine on 13.01.2016.
 */
function RewindInputStream() {
  var content = "";
}

RewindInputStream.prototype.getContent = function () {
  return this.content;
}

RewindInputStream.prototype.setContent = function (content) {
  this.content = content;
};

module.exports = RewindInputStream;
