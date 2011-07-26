(function($){

var PaneSlider = function(element, options) {
    var obj = this;
    var elem = $(element);

    var defaults =  {
        btnLeft : null,
        btnRight : null,
        onClick : function() {},
        onPaneChange: function() {}
    };
    this.settings = $.extend(defaults, options || {});
    this.wrapper = null;
    
    this.currPane = 0;
    this.numPanes = 0;
    this.isSliding = false;
    
    this.starttime = 0;
    this.startX = -1;
    this.startY = -1;
    this.currX = -1;
    this.currY = -1;
    this.swipeAngle = null;
    this.swipeDirection = null;
    this.isMouseDown = false;
    
    this.numPanes = elem.find(".pane").length;
    this.wrapper = elem.find(".pane-container");
    this.paneWidth = elem.width();
    $(this.wrapper).css("left", "0");
    
    if (this.settings.btnLeft != null) {        
        $(this.settings.btnLeft).bind("click.paneslider", function(e) {obj.clickLeft(e);});
        $(this.settings.btnLeft).addClass("deactive");
    }
    if (this.settings.btnRight != null) {
        $(this.settings.btnRight).bind("click.paneslider", function(e) {obj.clickRight(e);});
	if (this.numPanes == 1) {
            $(this.settings.btnRight).addClass("deactive");
	} else {
            $(this.settings.btnRight).removeClass("deactive");
	}
    }
    
    elem.bind("mousedown.paneslider", function(e) {
        e.preventDefault();
        var target = $(e.target)[0];
        if (obj.settings.btnLeft != null && (target == $(obj.settings.btnLeft)[0] || target == $(obj.settings.btnLeft).children()[0])) {
            return;
        }
        if (obj.settings.btnRight != null && (target == $(obj.settings.btnRight)[0] || target == $(obj.settings.btnRight).children()[0])) {
            return;
        }
        if (obj.startX == -1) {
            obj.isMouseDown = true;
            obj.currX = -1;
            obj.currY = -1;
            obj.startX = e.pageX;
            obj.startY = e.pageY;
            obj.starttime = (new Date()).getTime();
        }
    });
    
    elem.bind("mousemove.paneslider", function(e) {
        e.preventDefault();
        obj.currX = e.pageX;
        obj.currY = e.pageY;
    
        if (!obj.isSliding && obj.startX != -1) {
            var swipeLength = Math.round(Math.sqrt(Math.pow(obj.currX - obj.startX,2)
                                    + Math.pow(obj.currY - obj.startY,2)));
        
            obj.calculateAngle();
            obj.determineSwipeDirection();
            if (obj.swipeDirection == "left") {
                // move right
                var left = -(obj.currPane * obj.paneWidth);
                if (obj.currPane < obj.numPanes - 1) {
                    left -= swipeLength;   
                } else {
                    if (swipeLength > 50) {
                        left -= 50;
                    } else {
                        left -= swipeLength;
                    }
                }
                $(obj.wrapper).css("left", left + "px");
            } else if (obj.swipeDirection == "right") {
                // move left
                var left = -(obj.currPane * obj.paneWidth);
                if (obj.currPane > 0) {
                    left += swipeLength;   
                } else {
                    if (swipeLength > 50) {
                        left += 50;
                    } else {
                        left += swipeLength;
                    }
                }
                $(obj.wrapper).css("left", left + "px");
            }
        }
    });
    
    elem.bind("mouseup.paneslider", function(e) {
        e.preventDefault();
        if (!obj.isMouseDown) {
            return;
        }
        var endtime = (new Date()).getTime();
        if (obj.startX != -1 && obj.currX != -1) {
            var swipeLength = Math.round(Math.sqrt(Math.pow(obj.currX - obj.startX,2)
                                          + Math.pow(obj.currY - obj.startY,2)));

            if (!obj.isSliding) {
                obj.calculateAngle();
                obj.determineSwipeDirection();
                var target = $(e.originalEvent.target)[0];
                if (swipeLength < 5) {
                    obj.touchCancel();
                    obj.settings.onClick(obj.currPane);
                    return;
                }
                var isHardSwipe = false;
                if (endtime - obj.starttime < 500) {
                    isHardSwipe = true;
                }
    
                if (obj.swipeDirection == "left") {
                    // move right
                    if ((isHardSwipe || swipeLength > (obj.paneWidth / 2)) && obj.currPane < obj.numPanes - 1) {
                        obj.slideLeft();
                    } else {
                        var left = -(obj.currPane * obj.paneWidth);
                        $(obj.wrapper).animate({"left": left + "px"}, 300);
                    }
                } else if (obj.swipeDirection == "right") {
                    // move left
                    if ((isHardSwipe || swipeLength > (obj.paneWidth / 2)) && obj.currPane > 0) {
                        obj.slideRight();
                    } else {
                        var left = -(obj.currPane * obj.paneWidth);
                        $(obj.wrapper).animate({"left": left + "px"}, 300);
                    }
                }
            }
        } else {
            obj.touchCancel();
            obj.settings.onClick(obj.currPane);
            return;
        }
        obj.touchCancel();
    });
    
    elem.bind("mouseleave.paneslider", function(e) {
        obj.touchCancel();
    });
    
    elem.bind("touchstart.paneslider", function(e) {
        e.preventDefault();
        var target = $(e.originalEvent.target)[0];
        if (obj.settings.btnLeft != null && (target == $(obj.settings.btnLeft)[0] || target == $(obj.settings.btnLeft).children()[0])) {
            if (!obj.isSliding) {
                obj.slideRight();
            }
            return;
        }
        if (obj.settings.btnRight != null && (target == $(obj.settings.btnRight)[0] || target == $(obj.settings.btnRight).children()[0])) {
            if (!obj.isSliding) {
                obj.slideLeft();
            }
            return;
        }
        if (obj.startX == -1) {            
            var touches = e.originalEvent.touches;
            if (touches.length == 1) {
                obj.isMouseDown = true;
                obj.startX = touches[0].pageX;
                obj.startY = touches[0].pageY;
                obj.starttime = (new Date()).getTime();
            } else {
                obj.touchCancel();
            }
        }
    });
    
    elem.bind("touchmove.paneslider", function(e) {
        e.preventDefault();
        var touches = e.originalEvent.touches;
        if (touches.length == 1) {
            obj.currX = touches[0].pageX;
            obj.currY = touches[0].pageY;
    
            if (!obj.isSliding && obj.currX != -1) {
                var swipeLength = Math.round(Math.sqrt(Math.pow(obj.currX - obj.startX,2)
                                        + Math.pow(obj.currY - obj.startY,2)));
            
                obj.calculateAngle();
                obj.determineSwipeDirection();
                if (obj.swipeDirection == "left") {
                    // move right
                    var left = -(obj.currPane * obj.paneWidth);
                    if (obj.currPane < obj.numPanes - 1) {
                        left -= swipeLength;   
                    } else {
                        if (swipeLength > 50) {
                            left -= 50;
                        } else {
                            left -= swipeLength;
                        }
                    }
                    $(obj.wrapper).css("left", left + "px");
                } else if (obj.swipeDirection == "right") {
                    // move left
                    var left = -(obj.currPane * obj.paneWidth);
                    if (obj.currPane > 0) {
                        left += swipeLength;   
                    } else {
                        if (swipeLength > 50) {
                            left += 50;
                        } else {
                            left += swipeLength;
                        }
                    }
                    $(obj.wrapper).css("left", left + "px");
                }
            }
        } else {
            obj.touchCancel();
        }
    });
    
    elem.bind("touchend.paneslider", function(e) {
        e.preventDefault();
        if (!obj.isMouseDown) {
            return;
        }
        var endtime = (new Date()).getTime();
        if (obj.startX != -1 && obj.currX != -1) {
            var swipeLength = Math.round(Math.sqrt(Math.pow(obj.currX - obj.startX,2)
                                          + Math.pow(obj.currY - obj.startY,2)));
            //alert("swipeLength: " + swipeLength);
            if (!obj.isSliding) {
                obj.calculateAngle();
                obj.determineSwipeDirection();
                if (swipeLength < 5) {
                    obj.touchCancel();
                    obj.settings.onClick(obj.currPane);
                    return;
                }
    
                var isHardSwipe = false;
                if (endtime - obj.starttime < 500) {
                    isHardSwipe = true;
                }
    
                if (obj.swipeDirection == "left") {
                    // move right
                    if ((isHardSwipe || swipeLength > (obj.paneWidth / 2)) && obj.currPane < obj.numPanes - 1) {
                        obj.slideLeft();
                    } else {
                        var left = -(obj.currPane * obj.paneWidth);
                        $(obj.wrapper).animate({"left": left + "px"}, 300);
                    }
                } else if (obj.swipeDirection == "right") {
                    // move left
                    if ((isHardSwipe || swipeLength > (obj.paneWidth / 2)) && obj.currPane > 0) {
                        obj.slideRight();
                    } else {
                        var left = -(obj.currPane * obj.paneWidth);
                        $(obj.wrapper).animate({"left": left + "px"}, 300);
                    }
                }
            }
        } else {
            obj.touchCancel();
            obj.settings.onClick(obj.currPane);
            return;
        }
        obj.touchCancel();
    });
    
    this.setPane = function(paneNum, animate) {
        obj.currPane = paneNum;
        var left = -(obj.currPane * obj.paneWidth);
        if (left != $(obj.wrapper).css("left")) {
            $(obj.wrapper).stop();
            if (animate) {
                $(obj.wrapper).animate({"left": left + "px"}, 300);
            } else {
                $(obj.wrapper).css("left", left + "px");
            }
        }
    
        if (obj.settings.btnLeft != null) {
            if (obj.currPane > 0) {
                $(obj.settings.btnLeft).removeClass("deactive");
            } else {            
                $(obj.settings.btnLeft).addClass("deactive");
            }
        }
        if (obj.settings.btnRight != null) {
            if (obj.currPane < obj.numPanes - 1) {
                $(obj.settings.btnRight).removeClass("deactive");
            } else {
                $(obj.settings.btnRight).addClass("deactive");
            }
        }
    };

    this.destroy = function() {
        if (this.settings.btnLeft != null) {        
            $(this.settings.btnLeft).unbind("click.paneslider");
        }
        if (this.settings.btnRight != null) {
            $(this.settings.btnRight).unbind("click.paneslider");
        }
        $(elem).data("paneslider", null);        
        return elem.unbind(".paneslider");
    };

    this.slideRight = function() {
        if (!obj.isSliding) {
            if (obj.currPane > 0) {
                obj.isSliding = true;
                obj.currPane--;
                var left = -(obj.currPane * obj.paneWidth);
                $(obj.wrapper).stop();
                $(obj.wrapper).animate({"left": left + "px"}, 500, function() {obj.slideFinished();});
            }
        }
    };
    
    this.slideLeft = function() {
        if (!obj.isSliding) {            
    
            if (obj.currPane < obj.numPanes - 1) {
                obj.isSliding = true;
                obj.currPane++;
                var left = -(obj.currPane * obj.paneWidth);
                //$(obj.wrapper).stop();
                $(obj.wrapper).animate({"left": left + "px"}, 500, function() {obj.slideFinished();});
            }
        }
    };
    
    this.slideFinished = function() {
        obj.isSliding = false;
        if (obj.settings.btnLeft != null) {
            if (obj.currPane > 0) {
                $(obj.settings.btnLeft).removeClass("deactive");
            } else {            
                $(obj.settings.btnLeft).addClass("deactive");
            }
        }
        if (obj.settings.btnRight != null) {
            if (obj.currPane < obj.numPanes - 1) {
                $(obj.settings.btnRight).removeClass("deactive");
            } else {
                $(obj.settings.btnRight).addClass("deactive");
            }
        }
    
        obj.settings.onPaneChange(obj.currPane);
    };
    
    this.calculateAngle = function() {
        var X = obj.startX - obj.currX;
        var Y = obj.currY - obj.startY;
        var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
        var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
        obj.swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
        if ( obj.swipeAngle < 0 ) { obj.swipeAngle =  360 - Math.abs(obj.swipeAngle); }
    };
    
    this.determineSwipeDirection = function() {
        if ( (obj.swipeAngle <= 45) && (obj.swipeAngle >= 0) ) {
            obj.swipeDirection = "left";
        } else if ( (obj.swipeAngle <= 360) && (obj.swipeAngle >= 315) ) {
            obj.swipeDirection = "left";
        } else if ( (obj.swipeAngle >= 135) && (obj.swipeAngle <= 225) ) {
            obj.swipeDirection = "right";
        } else if ( (obj.swipeAngle > 45) && (obj.swipeAngle < 135) ) {
            obj.swipeDirection = "down";
        } else {
            obj.swipeDirection = "up";
        }
    };
    
    this.touchCancel = function() {
        obj.startX = -1;
        obj.startY = -1;
        obj.currX = -1;
        obj.currY = -1;
        obj.swipeAngle = null;
        obj.swipeDirection = null;
        obj.isMouseDown = false;
        
        if (!obj.isSliding) {
            var left = -(obj.currPane * obj.paneWidth);
            if (left != $(obj.wrapper).css("left")) {
                $(obj.wrapper).stop();
                $(obj.wrapper).animate({"left": left + "px"}, 300);
            }
        }
    };
    
    this.clickLeft = function(e) {
        e.preventDefault();
        e.stopPropagation();
        obj.slideRight();
    };
    
    this.clickRight = function(e) {
        e.preventDefault();
        e.stopPropagation();
        obj.slideLeft();
    };

}

$.fn.extend({
    paneslider : function(options) {
        return this.each(function() {
            if ($(this).data("paneslider")) {
                return;
            }
            var paneslider = new PaneSlider(this, options);
            $(this).data("paneslider", paneslider);
        });
    }
});



})( jQuery );
