
/*
  * pageflipper, jQuery plugin
  *
  * @version:  0.0.2 beta
  * @description: A plugin for making a pageflipper where the user can flip trough 
  * pages using either touch or mouse events
  */

(function( $ ) {

  // pageflipper object, stored in pageflipper main element.data('pageflipper')
  var PageFlipper = function( element, settings ) {

    var self = this;
    this.$element = $( element );
    this.$pagepanel = this.$element.find( 'ul:first' ),
    this.$pages = this.$pagepanel.find( 'li' );

    this.settings = settings;

    this.nrofpages = this.$pages.length;
    this.pagewidth = this.$element.width();
    this.currpage = 0;
    this.currx = 0;

    // pageflipper css setup
    this.$element.css({
      'overflow': 'hidden'
    });
    this.$pagepanel.css({
      'height': '100%',
      'width': self.nrofpages * 100 + '%'
    });
    this.$pages.each(function() {
      $( this ).css({
        'display': 'inline-block',
        'float': 'left',
        'list-style': 'none',
        'height': '100%',
        'width': 100 / self.nrofpages + '%'
      })
    });

    // init buttons
    if(this.settings.buttonator){
      this.buttons = (function() {
      
      var $buttonpanel = $( (function() {
        var _panel = $( "<div></div>")
          .append( $( '<ul></ul>' )
            .css({
              width: 4*self.nrofpages+'%',
              margin: '0px auto 0px auto'
            })
        );
        self.$pages.each(function( index ) {
          var _button = $( '<li></li>')
            .css({
              'display': 'inline-block',
              'width': 100/self.nrofpages+'%',
              'height': '100%',
              'list-style': 'none',
            })
            .append( $( '<div></div>' )
              .addClass( 'pagebutton' )
              .css({
                'height': '8px',
                'width': '8px',
                'margin': '0px auto 0px auto'
              })
            )
            .appendTo(_panel.find('ul'));
        });
        return _panel;
      })() )
        .addClass( 'pagebuttonpanel' )
        .css({
          display: 'block',
          position: 'relative',
          height: '4%',
          width: '100%',
          'z-index': '100',
          bottom: '4%',
          margin: '0px auto 0px auto'
        })
        .appendTo(self.$element);

        var $buttons = $buttonpanel.find('ul').find('li').find('div');

        $buttons.each(function( index ) {
          $( this ).hover(function() {
            self.flipto( index )
          })
        });

        self.$pages.each(function( index ) {
          $( this ).focus( function() {
            $buttons.removeClass( 'active' );
            $ ($buttons[index] ).addClass('active');
          });
        });
        
        $($buttons[0] ).addClass('active');
      })(); 
    }
    
    // closure for binding flipp events
    (function() {
      var pageprevx = 0;
      var touchstartx;
      var touchprevx;
      var mousedown = false;
      self.$pagepanel.bind({
        
        touchstart: function( e ) {
          e.preventDefault();
          touchprevx = event.targetTouches[0].pageX;
          touchstartx = touchprevx;
        },
        
        touchmove: function( e ) {
          e.preventDefault();
          var movedx;
          var touchcurrx = event.targetTouches[0].pageX;
          if( touchcurrx > touchprevx ) {
            movedx = touchprevx - touchcurrx;
            self.currx -= movedx;
          } else if( touchcurrx < touchprevx ) {
            movedx = touchprevx - touchcurrx;
            self.currx -= movedx;
          }
          touchprevx = touchcurrx;
          self.setx( self.currx );
        },
        
        touchend: function( e ) {
          e.preventDefault();
          if( touchprevx < touchstartx ) {
            self.flipright();
          } else if ( touchprevx > touchstartx ) {
            self.flipleft();
          }
        },
        
        mousedown: function( e ) {
          e.preventDefault();
          touchprevx = event.pageX;
          touchstartx = touchprevx;
          mousedown = true;
        },
        
        mousemove: function( e ) {
          if(mousedown == true){
            e.preventDefault();
            var movedx;
            var touchcurrx = event.pageX;
            if( touchcurrx > touchprevx ) {
              movedx = touchprevx - touchcurrx;
              self.currx -= movedx;
            } else if( touchcurrx < touchprevx ) {
              movedx = touchprevx - touchcurrx;
              self.currx -= movedx;
            }
            touchprevx = touchcurrx;
            self.setx( self.currx ); 
          }
        },
        
        mouseup: function( e ) {
          e.preventDefault();
          if( touchprevx < touchstartx ) {
            self.flipright();
          } else if ( touchprevx > touchstartx ) {
            self.flipleft();
          }
          mousedown = false;
        }
      });
    })()

    this.setx(0); //Hack to eliminate glitch on first user flip

  }

  //sets the x axis offset of the pagepanel
  PageFlipper.prototype.setx = function( x ) {
    this.$pagepanel.css({
      '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', 0, 0, 1)',
    })
    this.currx = x;
  };

  //transitions the x axis offset of the pagepanel
  PageFlipper.prototype.transitionx = function( x, callback ) {
    var self = this;
    this.$pagepanel
      .addClass('pageflippertransition')
      .css({
        '-webkit-transition-duration': self.settings.page_transition_speed+'ms'
      })
      .css({
        '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', 0, 0, 1)',
      })
      .bind('webkitTransitionEnd', function( event ) {
        $( this ).css({
          '-webkit-transition': '',
        })
        self.currx = x;
        if( callback && typeof callback === 'function') callback()
      })
  };

  PageFlipper.prototype.flipleft = function() {
    var prevpage = this.currpage;
    (this.currpage - 1) >= 0 ? this.currpage -= 1: this.currpage = this.currpage;
    var x = (this.$element.width() * this.currpage) * -1;
    this.transitionx( x );
    if( prevpage != this.currpage) {
      $( this.$pages[prevpage] ).trigger( 'blur' ); 
      $( this.$pages[this.currpage] ).trigger( 'focus' ); 
    }
  };

  PageFlipper.prototype.flipright = function() {
    var prevpage = this.currpage;
    (this.currpage + 1) < this.nrofpages ? this.currpage += 1: this.currpage = this.currpage;
    var x = (this.$element.width() * this.currpage) * -1;
    this.transitionx( x );
    if( prevpage != this.currpage) {
      $( this.$pages[prevpage] ).trigger( 'blur' );
      $( this.$pages[this.currpage] ).trigger( 'focus' ); 
    }
  };

  PageFlipper.prototype.flipto = function( pindex ) {
    var prevpage = this.currpage;
    if(typeof pindex === "number" && pindex < this.nrofpages && pindex >= 0){
      this.currpage = pindex;
    }
    var x = (this.$element.width() * this.currpage) * -1;
    this.transitionx( x );
    if( prevpage != this.currpage) {
      $( this.$pages[prevpage] ).trigger( 'blur' );
      $( this.$pages[this.currpage] ).trigger( 'focus' ); 
    }
  };
  

  $.fn.pageflipper = function( method ) {
    
    var settings = {
      page_transition_speed: 320,
      buttonator: true
    };

    var $this = this,
          _pageflipper = $this.data( 'pageflipper' );

    //public plugin methods
    var methods = {
      
      init: function() {
        if( method && typeof method === 'object'){
          $.extend( settings, method)
        }
        if( !$this.data( 'pageflipper' ) ) {
          $this.data( 'pageflipper', new PageFlipper( $this, settings ) );
          _pageflipper = $this.data( 'pageflipper' )
        }
        return this;
      },
      
      flipleft: function() {
        _pageflipper.flipleft(); 
        return this;
      },

      flipright: function() {
        _pageflipper.flipright(); 
        return this;
      },

      flipto: function( pindex ) {
        _pageflipper.flipto( pindex ); 
        return this;
      },

      destroy: function() {
        $this.data( 'pageflipper', null );
        return this;
      }

    };

    //method-call logic, defaults to init
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'method ' +  method + ' does not exist on jquery.pageflipper' );
    }

  };

})( jQuery );

