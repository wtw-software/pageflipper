/*
  * PROTOTYPE
*/

function PageFlipperStandalone(args, pages) {

      this.$element = $("<div id='" + this.id + "'></div>")
      for (attr in args) {
        this.$element[attr](args[attr]);
      }

      this.$element.css({
        'overflow': 'hidden'
      })

      this.$pageContainer = $("<div class='pageContainer'></div>")
      .css({
        'height': '100%',
        'width': pages.length * 100 + '%'
      });

      for (var i = 0; i < pages.length; i++) {
        pages[i].css['width'] = 100 / pages.length + '%';
        var page = new Page(pages[i]);
        this.$pageContainer.append(page.$element);
      }

      this.$element.append(this.$pageContainer);
      this.$element.appendTo(this.appendTo);

      //Bind touch events
      (function(PageFlipperStandalone) {

        var PageX = 0;
        var touchStartX;
        var touchPrevX;
        var direction;

        var PageWidth = PageFlipperStandalone.$pageContainer.width() / pages.length;

        var maxX = 0;
        var minX = ((PageWidth) * (pages.length - 1)) * -1;

        var currPageNr = 0;

        var moveCounter = 0;

        PageFlipperStandalone.$pageContainer.bind('touchstart',
        function(e) {
          e.preventDefault();
          touchPrevX = event.targetTouches[0].pageX;
          touchStartX = event.targetTouches[0].pageX;
          direction = undefined;
        })



        PageFlipperStandalone.$pageContainer.bind('touchmove',
        function(e) {
          e.preventDefault();

          moveCounter++;

          var touchCurrX = event.targetTouches[0].pageX;

          var movedPX;

          //Going left
          if (touchCurrX < touchPrevX) {
            movedPX = touchPrevX - touchCurrX;
            if (currPageNr == pages.length - 1) movedPX = 2;
            //slow drag if fdivpping past last page
            PageX -= movedPX;
          }
          //Going right
          else if (touchCurrX > touchPrevX) {
            movedPX = touchCurrX - touchPrevX;
            if (currPageNr == 0) movedPX = 2;
            //slow drag if fdivpping past first page
            PageX += movedPX;
          }

          //Determin direction only after the user has moved 2 increments //to get a more accurate measurment
          if (moveCounter > 2) {
            if (touchCurrX < touchPrevX) {
              direction = 'left';
            } else if (touchCurrX > touchPrevX) {
              direction = 'right';
            }
          }

          //Set page 'left' using 3d transform to make use of hardware accelleration
          $(this).css({
            "-webkit-transform": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + PageX + ", 0, 0, 1)"
          })

          touchPrevX = touchCurrX;
        })

        PageFlipperStandalone.$pageContainer.bind('touchend',
        function(e) {
          e.preventDefault();
          moveCounter = 0;
          $(this).css({
            "-webkit-transition-property": "-webkit-transform",
            "-webkit-transition-duration": "320ms",
            "-webkit-transition-timing-function": "cubic-bezier(0.0, 0.2, 0.58, 1.0)"
          })
          switch (direction) {
            case 'left':
              if (currPageNr < pages.length - 1) currPageNr += 1;
              PageX = (currPageNr * PageWidth) * -1;
              break;
            case 'right':
              if (currPageNr > 0) currPageNr -= 1;
              PageX = (currPageNr * PageWidth) * -1;
              break;
          }
          $(this).css({
            "-webkit-transform": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + PageX + ", 0, 0, 1)"
          })
          moveCounter = 0;
        });

        PageFlipperStandalone.$pageContainer.bind('webkitTransitionEnd',
        function(event) {
          $(this).css({
            "-webkit-transition": "",
          })
        })


      })(this);
    }


    function Page(args) {
      this.$element = $("<div class='Page'></div>");
      for (attr in args) {
        this.$element[attr](args[attr]);
      }
      this.$element.css({
        'display': 'inline-block',
        'height': '100%'
      })
    }

    