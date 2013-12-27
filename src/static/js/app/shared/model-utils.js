define(function (require, exports, module) {
    var md5 = require('vendor/encrypt/md5');

    function url() {
        var original_url = Backbone.Model.prototype.url.call( this );
        var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) == '/' ? '' : '/' );
        return parsed_url;
    }

    function pendingIdForTask(task){
        var parts = [
        task.get('label'),
        task.get('description'),
        task.get('loe'),
        task.get('status'),
        task.get('project'),
        task.get('task_type')];

        return hex_md5(parts.join(''));
    }

    exports.url = url;
    exports.pendingIdForTask = pendingIdForTask;
});
