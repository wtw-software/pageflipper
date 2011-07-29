pageflipper
=======

Is a jquery plugin for creating a panel of pages the user can flip trough using either touch events or mouse events. It feels as smooth and responsive as flipping pages in a native touch app. It is especially designed for the iPad.

### Quick Examples

   <script type="text/javascript">
      $(document).ready(function() {

         $('#pageflipper').pageflipper();

         $( '#page1' ).focus( function() {
            console.log('#page1 in focus');
         } );

         $( '#page2' ).focus( function() {
            console.log('#page2 in focus');
         } );

         $( '#page3' ).focus( function() {
            console.log('#page3 in focus');
         } );

      });

      
   </script>
    
   <body>

   <div id='pageflipper'>
      <ul>
         <li>
            <p>Page 1</p>
         </li>
         <li>
            <p>Page 2</p>
         </li>
         <li>
            <p>Page 3</p>
         </li>
      </ul>
   </div>

   </body> 


Credits
------