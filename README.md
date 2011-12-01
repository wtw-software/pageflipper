pageflipper
=======

A jQuery plugin for creating a panel of pages the user can flipp through using either touch events or mouse events. It feels as smooth and responsive as flipping pages in a native touch app. It is especially designed for the iPad and iPhone, but works well on a desktop. Not well tested on other touch devices yet.

## Usage
Load the necessary javascript and css files:

```html
<script type="text/javascript" src="path/to/jquery.pageflipper.js"></script>
<link rel="stylesheet" type="text/css" href="path/to/pageflipper.css"> 
```

Initialize the pageflipper on the wanted DOM element:

```javascript
$(document).ready(function() {

   $( '#pageflipper' ).pageflipper( );

   $( '#page1' ).focus( function( ) {
      console.log( '#page1 in focus' );
      //Do ajax or whatever
   });

   $( '#page2' ).focus( function( ) {
      console.log( '#page2 in focus' );
      //Do ajax or whatever
   });

   $( '#page3' ).focus( function( ) {
      console.log( '#page3 in focus' );
      //Do ajax or whatever
   });

});
```

The pageflipper needs a ul with a li pr page to work:

```html
<div id='pageflipper'>
   <ul>
      <li id='page1'>
         <p>Page 1</p>
      </li>
      <li id='page2'>
         <p>Page 2</p>
      </li>
      <li id='page3'>
         <p>Page 3</p>
      </li>
   </ul>
</div>
```

### Api

The pageflipper exposes a simple api for manipulating the pageflipper programmatically:

```javascript
$( '#pageflipper' ).pageflipper('flipleft') // flips one page to the left

$( '#pageflipper' ).pageflipper('flipright') // flips one page to the right

$( '#pageflipper' ).pageflipper('flipto', 3) // flips to the desired page, this case page 3

```


### Options

On initialization the pageflipper takes a object with options:

```javascript
$(document).ready(function() {

   $( '#pageflipper' ).pageflipper({
     page_transition_speed: 300, //measured in milliseconds, defaults to 320
     buttonator: true //determines if the buttons at the bottom is enabled, defaults to true
   });

});
```

Credits
------
Inspiration and some work based on Christian Laverton's panelslider.
Thanks to wtw software for open-sourcing the plugin.  

  
License
-------
Pageflipper sues a modified version of the MIT license.  
  
```
Copyright (C) 2011 by wtw-software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
with the software, with the following rights:  
use, copy, modify, merge, publish, and distribute copies of the Software, and 
to permit persons to whom the Software is furnished to do so, subject to the conditions listed below.
Note that the software can not be sold "as is", but distributed with and for use in other software is permitted.

Conditions:  
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
