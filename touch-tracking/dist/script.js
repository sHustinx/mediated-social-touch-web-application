var MultiTouch = function(options) {

  const socket = io("http://168.119.29.140:3000");

  var defaults = {
    id: 'touchpoints',
    touchTemplate: '<div class="touchpoint"></div>'
  };

  options = $.extend({}, defaults, options);
  var el = document.getElementById(options.id);
  el.style.width = '100%';
  el.style.height = '100%';
  
  var touchpoints = {},
      halfWidth,
      halfHeight;
  
  function resetCanvas (e) {
    halfWidth = $(el).width()/2; 
    halfHeight = $(el).height()/2;
  }
  
  $(document).resize(resetCanvas);
  resetCanvas();

  moveTouch = function(id, x, y) {
    if (touchpoints[id]) {
      /*console.log("touchpoints", {
        "width": $(el).width(),
        "height": $(el).height(),
        "touchpoints": {"id": id, "x": x, "y": y},
        "intensity": parseInt($("#calc-intensity").val(), 10)
      })*/
      $.each(touchpoints, function (i, touch) {
        console.log(touch);
      });

      socket.emit("touchpoints", {
        "width": $(el).width(),
        "height": $(el).height(),
        "touchpoints": {"id": id, "x": x, "y": y},
        "intensity": parseInt($("#calc-intensity").val(), 10)
      });
      touchpoints[id].css({
        'transform': 'translate('+x+'px, '+y+'px)'
      });
    }
  }
  
  removeTouch = function(id) {
    touchpoints[id].remove();
    delete touchpoints[id];
  }
  
  var self = {
    init: function () {
      $(el)
      .on('touchstart mousedown', self.onTouchStart)
      .on('touchmove mousemove drag', self.onTouchMove)
      .on('touchend mouseup', self.release);
    },
    onTouchStart: function (event) {
      event.preventDefault();
      
      // place touches by index
      var touches = (event.originalEvent && event.originalEvent.touches) ? event.originalEvent.touches : [event];
      
      $.each(touches, function (i, touch) {
        var id = touch.identifier != null ? touch.identifier : 'mouse';
        var tmpl = $(options.touchTemplate);        
        
        // new touch element
        if(!touchpoints[id]) {
          touchpoints[id] = tmpl.appendTo(el);
        }
        
        moveTouch(id, touch.pageX, touch.pageY);
      });
    },
    
    onTouchMove: function(event) {
      event.preventDefault();
      
      var touches = (event.originalEvent && event.originalEvent.touches) ? event.originalEvent.touches : [event];
      
      $.each(touches, function (i, touch) {
        var id = touch.identifier != null ? touch.identifier : 'mouse';
        moveTouch(id, touch.pageX, touch.pageY);         
      });        
    },
    
    release: function (event) {
      event.preventDefault();
      
      var touches = (event.originalEvent && event.originalEvent.changedTouches) ? event.originalEvent.changedTouches : [event];
      
      $.each(touches, function (i, touch) {
        var id = touch.identifier != null ? touch.identifier : 'mouse';
        
        removeTouch(id);
      });
    }
  };
  return self.init();
};

$(function () {

  $("#start-overlay").on('click touchend', function() {
    $("#start-overlay").fadeOut("slow");
  });

  new MultiTouch({
    id: 'touchpoints',
    touchTemplate: '<div class="touchpoint"></div>'
  });
});

$('.menu-btn').on('click', function(e) {
  e.preventDefault;
  $(this).toggleClass('menu-btn_active');
  $('.menu-nav').toggleClass('menu-nav_active');
})

$("input").on("input change", function (event) {
  var parameterName =  $(this).attr("id").split("calc-")[1];

  switch (parameterName) {
    case "intensity":
      $("#calc-intensity_value").html("Intensity: " + $(this).val() + '&ensp;'.repeat(3 - $(this).val().toString().length));
      break;
  }

  //var intensity = parseInt($("#calc-intensity").val(), 10);
});