

( function( $ ) {
   

   $.widget( "ui.pageflipper", {
      
      //defaults
      options: {
         page_transition_speed: 320,
         buttonator: true
      },

      _panel: undefined,

      _pages: undefined,

      _create: function() {
         this._panel = this.element.find( 'ul:first' );
         this._pages =this._panel.find( 'li' );
      },

      _init: function() {
      },

      flipright: function(  ) {},

      flipleft: function(  ) {},

      flipto: function( pindx ) {},

      destroy: function() {
         $.widget.prototype.destroy.apply(this, arguments); // default destroy
      }

   } );


})( jQuery );