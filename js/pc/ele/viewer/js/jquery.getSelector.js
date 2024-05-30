(function ($) {
    $.fn.getSelector = function () {
        element = this[0];

        // Get the xpath for this element.
        // This was easier than calculating the DOM using jQuery, for now.
        var xpath = '';
        for (; element && element.nodeType == 1; element = element.parentNode) {
            var id = $(element.parentNode).children(element.tagName).index(element) + 1;
            id > 1 ? (id = '[' + id + ']') : (id = '');
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }

        // Return CSS selector for the calculated xpath
        return xpath
            .substr(1)
            .replace(/\//g, ' > ')
            .replace(/\[(\d+)\]/g, function ($0, i) { return ':nth-child(' + i + ')'; });
    };
})(jQuery);