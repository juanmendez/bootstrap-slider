/**
 * Bootstrap Slider created by Juan Mendez @juanmendezinfo/contact@juanmendez.info
 * Please feel free to make changes, or provide any findings to my contact locations above.
 * https://github.com/juanmendez/bootstrap-slider
 */
;(function (bootstrapslider) {
    if (typeof define === "function" && define.amd) {
        define( 'bootstrapslider', ['module'],
        function ( module )
        {
            var path =  module.config();

            //mouse_core needs to be loaded prior to touch_punch.
            require.config( (
                  function(touch_shim){
                    var config = {shim:{}};
                    config.shim[ path['touch_punch'] ] = touch_shim;
                    return config;
                })({deps: [path['jquery'], path['mouse_core']], exports: 'TouchPunch'}));

            require( [path['jquery'], path['touch_punch']], function($){
               bootstrapslider($);
            });
        });
    } else {
        bootstrapslider( jQuery || $ );
    }
}(function($){

        $.widget( "jm.slider", $.ui.mouse, {
            options: {
                min:0,
                now: 0,
                max:100,
                disabled:false
            },
            _dim:{ /*dimensions*/
                twidth:0, /*thumbnail width*/
                bwidth:0, /*progress width*/
                dwidth:0 /*dragging width*/
            },
            _mypercent:0, /*slider percent dragged..*/
            _initialized:false, /*widget hasn't started yet*/
            _action:'', /*current action used to update the slider set(via javascript)|drag(mouse)|init(component created)*/
            _create: function() {
                this._action = 'init';
                /*internal progress-bar element*/
                this._bar = $(this.element.find('.progress-bar')[0]);
                this._bar.css('transition', 'width 0s ease 0s' );

                /*lets insert thumb inside*/
                this._thumb = $( "<div class='slider-bar' />" );
                this.element.append( this._thumb );

                var the_options = {};
                $.extend( the_options, this.options, { now:this._bar.attr('aria-valuenow'), max:this._bar.attr('aria-valuemax'), min:this._bar.attr('aria-valuemin') } );
                this._setOptions( the_options );
                this._mouseInit();
                this.refresh();
                this._initialized = true;
            },
            _setOption: function( key, value ) {

                if( key == 'now' || key=='max' || key=='min' )
                    value = parseFloat( value );

                this._super( key, value );

                if( key == "now" && value != this._mypercent && this._initialized )
                {
                    this._action = "set";
                    this.refresh();
                }
                else
                if( key == "disabled" && $.type(value) == "boolean" )
                {
                    if( value )
                    {
                        this._mouseDestroy();
                        this._trigger( "disabled", null, true );
                    }
                    else
                    {
                        this._mouseInit();
                        this._trigger( "disabled", null, false );
                    }
                }
            },
            _setOptions: function( options ) {
                this._super( options );
            },
            refresh:function(){
                this._measure();

                if( this.options.now )
                {
                    var now = this._nowToPercent();
                    var x = this._percentToX(now);
                    this._updatepos( x );
                }
            },
            /*
             * from percent find the x value in the progress bar
             * */
            _percentToX:function( p ){

                var p = ( p * ( this._dim.dwidth ) ) / 100 + this._dim.ht_width;
                return Math.round(p*100)/100;
            },
            /*
             * from dragging position find the percentage scrolled.
             */
            _xToPercent:function(x){

                var p = (( x * 100 ) / this._dim.dwidth);

                return Math.round(p*100)/100;
            },
            /*
             find out what is the dragging percent based on options.now
             */
            _nowToPercent:function(){
                var max = this.options.max - this.options.min;
                var now = this.options.now-this.options.min;
                return (now*100)/max;
            },
            /*
             find out the value of options.now from the dragging percentage.
             */
            _percentToNow:function(){
                var max = this.options.max - this.options.min;

                var now = ( this._mypercent * max ) / 100 + this.options.min;

                return Math.round( now * 100 ) / 100;
            },
            /*
                based on x value place thumb in the progress-bar
                and fire up change and/or complete events
             */
            _updatepos:function( x ){
                //make sure thumb has limits to be relocated
                var x = Math.max( 0,x - this._dim.ht_width );
                x = Math.min( this._dim.dwidth, x );

                //switch from pixels to css percent to go along responsive design
                var css_percent = (x * 100) / this._dim.bwidth;
                this._thumb.css( "left", css_percent + '%'  );
                this._bar.css( "width", css_percent + "%" );

                this._mypercent = this._xToPercent(x);
                this.options['now'] = this._percentToNow();

                this._bar.attr('aria-valuenow', this.options['now'] );
                this._trigger( "change", null, {value:this.options['now'], action:this._action} );

                if( this._mypercent == 100 )
                    this._trigger( "complete", null, {value:this.options['now'], action:this._action} );


            },
            /*upon create and dragging start we make sure we updte measurements*/
            _measure: function() {
                this._dim.twidth = this._thumb.width();
                this._dim.bwidth = this.element.width();
                this._dim.dwidth = this._dim.bwidth - this._dim.twidth;
                this._dim.ht_width = this._dim.twidth/2 + this._bar.offset().left;
            },
            _destroy: function() {

                this._mouseDestroy();
                this._thumb.remove();
            },
            _mouseDrag: function(e){

                this._updatepos(e.pageX);
                e.stopPropagation();

            },
            _mouseStart:function(e){
                this._action = "drag";
                this._measure();
            }
        });

        /*
            if any progress bootstrap component has as data "slider" defined
            we go ahead and treat progress bar as a new slider
         */
        $(window).on( 'load', function(){
            $(".progress").each( function(){
                var $progress = $(this);

                if( $progress.hasClass('slider') )
                {
                    $progress.slider({ disabled: true })
                }
            } );
        });

        /*
        whenever the window changes in size make sure to update the slider
        so the thumb updates its current location. it is in percentage.
         */
        $(window).resize(function() {
            $(".progress").each( function(){
                var $progress = $(this);

                if( $progress.slider )
                {
                    $progress.slider('refresh');
                }

            } );
        });
    }
));
