## Bootstrap Slider

[Live demo](http://jsfiddle.net/juanmendez/v9zkB/)

[Sample demo](http://juanmendez.info/source/tutorial/bootstrap/slider/bootstrapslider_sample.html)

[Requirejs demo](http://juanmendez.info/source/tutorial/bootstrap/slider/bootstrapslider_requirejs.html)


Thanks to all who have used this Bootstrap extension. I appreciate your feedback and allow me to make it fit your needs.

By using the widget factory pattern from Jquery UI, we can have on top of github the core functionality in order to create or extend functionality to Bootstrap.
The jquery ui file provided was extracted from http://jqueryui.com/download/ and it only uses at Core (Mouse|Widget|Core)

This humble extension provides a way to make the built in progress bar into a slider.

All required javascript and css files are found in this repository's html files. Please read along Bootstrap Progress found at http://getbootstrap.com/components/#progress

To update a progress bar you need to append slider class
<div class="progress slider">...</div>

You can modify the new slider-bar's width, and in this case I increased the height for the whole component

```
<style>
    .slider-bar{
        display:block; width:80px; background-color:darkred; position:relative;
    }

    .slider, .slider-bar{
        height:30px;
    }
</style>
```

The slider makes use of aria-* attributes from the the progress bar
```
<div class="progress slider">
      <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="30" role="progressbar" class="progress-bar">
          <span class="sr-only">60%</span>
      </div>
</div>
```

If you would like to do it at runtime, it works this way.

```
$p = $(".progress);
$p.slider({max:100, min:0, now:30} );
```

There are two events dispatched by $p, sliderchange and slidercomplete

```
$p.on( "sliderchange", function(e,result){
console.log( "action: " + result.action + ", value: " + result.value );
});

$p.on( "slidercomplete", function(e,result){
console.log( 'slider completed!' );
});
```

result is an object having action and value. Action tells how the slider updated graphically the thumbbar. 'init' when the slider has just being created, 'drag' when the user is shifting the slider, 'set' when the value was assigned via javascript.

value is the current value also modified at aria-valuenow.

In order to update via javascript we do the following
`$p.slider( "option", "now", value );`

We can also update min and max in the same way. Make sure in this case to refresh the slider doing the following:
`$p.slider( "refresh" );`

An additional option is to disable the slider and be notified
```
$p.slider( "option", "disabled", true );
$p.slider( "sliderdisabled", function(e,result){
//result is true for slider being disabled, and false when slider is enabled
} );
```

This extension works for cursor and finger gestures. I tested on touchscreen desktop, cursor, and android phone and tablet.
