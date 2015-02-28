;(function($) {
  "use strict";

  var version = '1.0';
  var vernums = $.fn.jquery.split('.');

  $.fn.group_add_more = function(options) {
    var container = $(this);
    var data;
    // default options
    var defaults = {
        addMoreClass: "content-add-more",
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
    
    $(groupaddmore, container).click(function() {
      $(addmore + " input", container).trigger("mousedown");
      return false;
    })
    
    $(container).addClass(processedClass);
  }
})(jQuery);

/*

$( document ).ready(function() {
  $(".node-form .group-images").group_add_more({hide: true, groupLabel: "Group Add", groupClass: "my-group-add-more"});
});

*/

