;(function($) {
  "use strict";

  var version = '2.0';
  var vernums = $.fn.jquery.split('.');

  $.fn.group_add_more = function(options) {
    var container = $(this);
    var queue = [];
    // default options
    var defaults = {
        addMoreClass: "field-add-more-submit",
        groupLabel: "Add More",
        groupClass: "group-add-more",
        hide: false
    };
    
    var settings = $.extend({}, defaults, options);

    var addmore = "." + settings.addMoreClass;
    var groupaddmore = "." + settings.groupClass;
    var processedClass = settings.groupClass + "-processed";
    
    if ($(container).hasClass(processedClass))
      return;

    $(container).append('<input type="submit" class="' + settings.groupClass + ' button" value="' + settings.groupLabel + '" />');
    
    if (settings.hide) {
      $(addmore, container).hide();

      $(container).bind("DOMNodeInserted", function() {
        $(this).find(addmore).hide();
      });      
    }
    
    function flush() {
      if (queue.length > 0) {
        var e = queue.pop();
        $(e).trigger("mousedown");
      }
    }
    
    $(groupaddmore, container).click(function() {
      $(addmore, container).each(function() {
        queue.push($(this));
      });
      flush();
      return false;
    })
    
    $(document).ajaxComplete(function() {
      flush();
    })
    
    $(container).addClass(processedClass);
  }
})(jQuery);
