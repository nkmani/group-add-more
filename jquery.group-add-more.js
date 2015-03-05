;(function($) {
  "use strict";

  var version = '3.0';
  var vernums = $.fn.jquery.split('.');

  $.fn.group_add_more = function(options) {
    var container = $(this);
    var data;
    // default options
    var defaults = {
        addMoreClass: "",
        groupAddMoreLabel: "Add More",
        groupAddMoreClass: "group-add-more",
        fieldTableClass: "",
        addMoreBtnSelector: "",
        drupal: 7,
        hide: false,
        initRows: false,
        numInitRows: 1,
        verbose: false
    };
    
    var settings = $.extend({}, defaults, options);

    var processedClass = settings.groupClass + "-processed";
    
    var pendingRows = 0;
    var queue = [];
    
    if ($(container).hasClass(processedClass))
      return;

    switch(settings.drupal) {
    case 7:
      if (settings.addMoreClass == "")
        settings.addMoreClass = "field-add-more-submit";
      if (settings.fieldTableClass == "")
        settings.fieldTableClass = "field-multiple-table";
      if (settings.addMoreBtnSelector == "")
        settings.addMoreBtnSelector = "." + settings.addMoreClass; 
      break;
    case 6:
      if (settings.addMoreClass == "")
        settings.addMoreClass = "content-add-more";
      if (settings.fieldTableClass == "")
        settings.fieldTableClass = "content-multiple-table";
      if (settings.addMoreBtnSelector == "")
        settings.addMoreBtnSelector = "." + settings.addMoreClass + " input"; 
      break;
    }

    var addmore = "." + settings.addMoreClass;
    var groupaddmore = "." + settings.groupAddMoreClass;
    var fieldtable = "." + settings.fieldTableClass;

    $(container).append('<input type="submit" class="' + settings.groupAddMoreClass + ' button" value="' + settings.groupAddMoreLabel + '" />');
    
    if (settings.hide) {
      $(addmore, container).hide();

      $(container).bind("DOMNodeInserted", function() {
        $(this).find(addmore).hide();
      });      
    }
    
    if (settings.initRows) {
      addrow();
      flush();
    }

    function flush() {
      if (queue.length > 0) {
        var o = queue.pop();
        if (o.type == "obj") {
          var btn = o.val;
          if (settings.verbose)
            console.log("triggering on " + $(btn).attr("id"));
          $(btn).trigger("mousedown");          
        } else if (o.type == "sel"){
          var inp = $(o.val);
          if ($(inp).length > 0) {
            if (settings.verbose)
              console.log("triggering on " + $(inp).attr("id"));
            $(inp).trigger("mousedown");                      
          } else {
            console.log("Could not find input from " + btn)
          }
        }
      }
    }
    
    function addrow() {
      $(settings.addMoreBtnSelector, container).each(function() {
        var p = null;
        var pid = "";
        
        switch(settings.drupal) {
        case 7:
          p = this;
          do {
            p = $(p).parent();
            if ($(p).hasClass("form-wrapper")) {
              pid = $(p).attr("id");
              break;              
            }
          } while (pid.length == 0);
          break;
          
        case 6:
          p = this;
          do {
            p = $(p).parent();
            pid = $(p).attr("id");
          } while (pid.length == 0);
          break;
        }

        if (pid.length == 0) {
          console.log("Could not find parent for input " + this);
          return;
        }
        
        var t = $(p).find(fieldtable);
        if (t.length == 0) {
          console.log("Could not find table with class " + fieldtable + " near add-more button");
          return;
        }
        
        var nr = $(t).find("tbody > tr").length;
        var id = $(t).attr('id');
        console.log(id + " " + nr + " " + settings.numInitRows);        
        if (nr < settings.numInitRows) {
          for (var i = nr; i<settings.numInitRows; i++) {
            queue.push({type:"sel", val:"#"+pid+" " + settings.addMoreBtnSelector});
          }
        }
      });
    }

    $(document).ajaxSuccess(function() {
      //setTimeout(flush, 500);
      flush();
    });
    
    $(groupaddmore, container).click(function() {
      $(settings.addMoreBtnSelector, container).each(function() {
        queue.push({type:"obj", val:this});
      });
      flush();
      return false;
    })
    
    $(container).addClass(processedClass);
  }
})(jQuery);
