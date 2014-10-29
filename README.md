# JavaScript Kinetic Scrolling

Adapted from http://ariya.github.io/kinetic/. 

## Changes

Merged the code behind five separate demo into a reusable library. Separated the notion of capturing the user interaction from the one of updating the view as a function of that interaction. Rendering code moved to  3 renderers (default, photoSwipe, coverFlow)

## Original notes

\#1: **Basic drag-and-scroll** ([demo](http://ariya.github.io/kinetic/1/), [explanation](http://ariya.ofilabs.com/2013/08/javascript-kinetic-scrolling-part-1.html)).<br/>
No momentum effect yet, just a plain scroll view.

\#2: **Flick list** with momentum ([demo](http://ariya.github.io/kinetic/2), [explanation](http://ariya.ofilabs.com/2013/11/javascript-kinetic-scrolling-part-2.html)).<br/>
Smooth acceleration and deceleration.

\#3: **Snap-to-grid** flick list ([demo](http://ariya.github.io/kinetic/3), [explanation](http://ariya.ofilabs.com/2013/12/javascript-kinetic-scrolling-part-3.html)).<br/>
Inertial deceleration to stop at the right position.

\#4: **Horizontal swipe** to browse photos ([demo](http://ariya.github.io/kinetic/4), [explanation](http://ariya.ofilabs.com/2013/12/javascript-kinetic-scrolling-part-4.html)).<br/>
Parallax effect included.

\#5: **Cover Flow** with CSS transform ([demo](http://ariya.github.io/kinetic/5), [explanation](http://ariya.ofilabs.com/2014/01/javascript-kinetic-scrolling-part-5-cover-flow-effect.html)).<br/>
Flipping images in 3-D space

\#6: _Coming soon_.
