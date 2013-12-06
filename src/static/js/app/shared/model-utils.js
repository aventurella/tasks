define(function (require, exports, module) {
    function url() {
        var original_url = Backbone.Model.prototype.url.call( this );
        var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) == '/' ? '' : '/' );
        return parsed_url;
    }

    exports.url = url;
});
