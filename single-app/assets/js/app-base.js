var app = angular.module('imageflow', [ 'ngRoute' ]);

app.run(['$rootScope', '$location', 'shared', 'currentImage',
    function($rootScope, $location, shared, currentImage) {
        /**
         * Listen to the modal close event
         * and reset the route to make sure
         * the "Add Media" will trigger
         * the modal again in-case the modal
         * is closed on bg click.
         * and reset the shared.uploaded to false
         **/
        $(document).on('close.fndtn.reveal', '[data-reveal]',
            function(){
                /* Reset the location path */
                if($location.path() != '/') {
                    $rootScope.$apply(function () {
                        $location.path('/');
                    });
                }
                /* Reset the uploaded image */
                shared.uploaded = false;
            }
        );
    }
]);

/** ROUTES **/
app.config( function( $routeProvider ) {
    $routeProvider.when( '/mediaGrid', {
        templateUrl: '01-media-grid.html',
        controller: 'mediaGridCtrl',
    });
    $routeProvider.when( '/source', {
        templateUrl: '02-choose-source.html',
        controller: 'sourceCtrl',
    });
    $routeProvider.when( '/select', {
        templateUrl: '03-upload-image.html',
        controller: 'sourceCtrl',
    });
    $routeProvider.when( '/uploading', {
        templateUrl: '04-media-grid-uploading.html',
        controller: 'uploadingCtrl',
    });
    $routeProvider.when( '/fullWidth', {
        templateUrl: '05-full-width.html',
        controller: 'fullWidthCtrl',
    });
    /* Default to root */
    $routeProvider.otherwise('/');
})

/** GLOBAL VAR FOR CURRENT IMAGES **/
app.service('currentImage', function() {
    this.images = [];
});

app.service('shared', function(){
    this.soon = function(){
        alert('Coming Soon!');
    }

    this.insertImages = function() {
        $location.path('/');
        $('#media-modal').foundation('reveal', 'close' );
        $('body').trigger( 'insertImages' );
    }

    this.selected = [];
    this.selectImage = function(image){
        selected.push(image);
    }

    /* Used to check the uploaded image */
    this.uploaded = false;

});

/**
 * Directive to watch the uploaded image and
 * the images already selected on the grid
 * and keep it consistent with other views
 */
app.directive('imageWatcher',['currentImage', 'shared',
    function(currentImage, shared) {
        return {
            link: function (scope, element, attrs) {
                /**
                 * Keep selected images consistent
                 */
                /* Check the array first */
                if(currentImage.images.length > 0) {
                    /* Watch the img src when it gets resolved */
                    scope.$watch(attrs.imageWatcher, function(thisimageSrc){
                        /*
                         * Now we have the src of the images so lets check
                         * if it was already selected
                         **/
                        if(currentImage.images.indexOf(thisimageSrc) != -1) {
                            /* Image was already selected so let's make it appear as one */
                            element.addClass('selected').find('i').toggle();
                        }
                    });
                    /* Call showFooter() but only once */
                    if(scope.$last)
                        scope.showFooter();
                }

                /**
                 * Keep uploaded image consistent
                 */
                /* Check the current img index and the uploaded value */
                if(attrs.index == 0 && !shared.uploaded)
                /* Hide it if uploaded is false */
                    element.addClass('hide');
            }
        }
    }
]);

app.controller( 'mediaGridCtrl', ['$rootScope', '$scope', 'currentImage', 'shared', '$http', '$location', function( $rootScope, $scope, currentImage, shared, $http, $location ) {

    /** OPEN MODAL **/
    //if($scope.secondtime===1) {
    //} else {
    if(!$('#media-modal').hasClass('open'))
        $('#media-modal').foundation('reveal', 'open' );
    //}

    $scope.modalTitle = 'Select Media';

    $scope.selectedImages = currentImage;
    /* Don't empty the array */
    // $scope.selectedImages.images = [];

    $http.get('assets/js/data.json').then(function(res){
        $scope.images = res.data.images
    });

    $scope.imageSelect = function(index, event) {
        /**
         * Let's handel the image select process
         * in a way that we can rely on
         * note: event is not necessary here
         **/
        var imageSrc = $scope.images[index].large;
        /*
         * Step 1:
         * Check the existence of this image in our array
         * imageExists will return the index in our array if it finds it
         */
        var imageExists = $scope.selectedImages.images.indexOf(imageSrc);
        // image already exists
        if(imageExists != -1){
            // Remove it from the array
            $scope.selectedImages.images.splice( imageExists, 1 );
            // It doesn't exists
        } else {
            // Add it to the array
            $scope.selectedImages.images.push( imageSrc );
        }
        /*
         * Step 2:
         * Now we can simply toggle the selected class and the icon
         * as we are already handling the add or remove from the array
         */
        $('[data-index="'+index+'"]').find('.fa').toggle();
        $('[data-index="'+index+'"]').toggleClass('selected');

        $scope.showFooter();
    }

    $scope.deSelect = function(){
        $('div.grid-wrap.selected').each(function(){
            $(this).removeClass('selected');
            $(this).find('i.fa').hide();
        })
        /* Empty the array before calling showfooter() */
        $scope.selectedImages.images = [];
        $scope.showFooter();
    }

    $scope.showFooter = function() {
        /*
         * Watch the array and not the classes
         * for more reliable results
         **/
        var imagesCount = $scope.selectedImages.images.length;
	
	
        if( imagesCount > 0 ) {
            $('#bottom-toolbar').fadeIn();
            $('#selected-count').text('');
	    if (imagesCount > 1) {
                $('#selected-items').text(imagesCount + ' Selected');
                $('#selected-count').text('(' + imagesCount + ')');
            }
        } else {
            $('#bottom-toolbar').fadeOut();
            $('#selected-items').text('');
        }
    }

    $scope.insertImages = function() {
        $location.path('/');
        $('#media-modal').foundation('reveal', 'close' );
        $('body').trigger( 'insertImages' );
        /* Here we should empty the array */
        $scope.selectedImages.images = [];
    }

    $scope.goHome = function(){
        $location.path('/');
        /* Here we should empty the array */
        $scope.selectedImages.images = [];
    }

    $scope.fullView = function(){
        $location.path('/fullWidth');
    }

    $scope.soon = function(){
        shared.soon();
    }
}]);

app.controller( 'textAreaCtrl', ['$rootScope', '$scope', 'currentImage', 'shared', '$http', '$location', function( $rootScope, $scope, currentImage, shared, $http, $location ) {

    $('body').on('insertImages', function() {
        $.each( currentImage.images, function( key, value ) {
            $scope.curVal = $('#tinyMCE').html();
            $scope.newVal = $scope.curVal + '<img src="' + value + '" />';
            $('#tinyMCE').html( $scope.newVal );
        });
    });

}]);

app.controller( 'sourceCtrl', ['$rootScope', '$scope', 'currentImage', 'shared', '$http', '$location', function( $rootScope, $scope, currentImage, shared, $http, $location ) {

    //$rootScope.secondtime = 1;

    $scope.modalTitle = 'Upload File';

    $scope.goHome = function(){
        $location.path('/');
        /* Here we should empty the array */
        $scope.selectedImages.images = [];
    }

}]);

app.controller( 'uploadingCtrl', ['$rootScope', '$scope', 'currentImage', 'shared', '$http', '$location', function( $rootScope, $scope, currentImage, shared, $http, $location ) {

    //$rootScope.secondtime = 1;

    $scope.selectedImages = currentImage;

    $scope.modalTitle = 'Select Media';

    /**
     * Here we should switch the shared.uploaded to true
     */
    shared.uploaded = true;

    $http.get('assets/js/data.json').then(function(res){
        $scope.images = res.data.images;
        setTimeout(function(){
            $('#uploading').fadeOut('slow');
            /**
             * Trigger click after the upload proccess is done
             * to select the newly uploaded image.
             * Triggering click will naturally trigger $scope.imageSelect()
             */
            $('.grid-wrap[data-index="0"] img').trigger('click');
        }, 500 );
    });

    $scope.imageSelect = function(index, event) {
        /**
         * Let's handel the image select process
         * in a way that we can rely on
         * note: event is not necessary here
         **/
        var imageSrc = $scope.images[index].large;
        /*
         * Step 1:
         * Check the existence of this image in our array
         * imageExists will return the index in our array if it finds it
         */
        var imageExists = $scope.selectedImages.images.indexOf(imageSrc);
        // image already exists
        if(imageExists != -1){
            // Remove it from the array
            $scope.selectedImages.images.splice( imageExists, 1 );
            // It doesn't exists
        } else {
            // Add it to the array
            $scope.selectedImages.images.push( imageSrc );
        }
        /*
         * Step 2:
         * Now we can simply toggle the selected class and the icon
         * as we are already handling the add or remove from the array
         */
        $('[data-index="'+index+'"]').find('.fa').toggle();
        $('[data-index="'+index+'"]').toggleClass('selected');

        $scope.showFooter();
    }

    $scope.deSelect = function(){
        $('div.grid-wrap.selected').each(function(){
            $(this).removeClass('selected');
            $(this).find('i.fa').hide();
        })
        /* Empty the array before calling showfooter() */
        $scope.selectedImages.images = [];
        $scope.showFooter();
    }

    $scope.showFooter = function() {
        /*
         * Watch the array and not the classes
         * for more reliable results
         **/
        var imagesCount = $scope.selectedImages.images.length;

        if( imagesCount > 0 ) {
            $('#bottom-toolbar').fadeIn();
            $('#selected-count').text('');
            if (imagesCount > 1) {
                $('#selected-items').text(imagesCount + ' Selected');
                $('#selected-count').text('(' + imagesCount + ')');
            }
        } else {
            $('#bottom-toolbar').fadeOut();
            $('#selected-items').text('');
        }
    }

    $scope.insertImages = function() {
        $location.path('/');
        $('#media-modal').foundation('reveal', 'close' );
        $('body').trigger( 'insertImages' );
        /* Here we should empty the array */
        $scope.selectedImages.images = [];
    }

    $scope.goHome = function(){
        $location.path('/');
        /* Here we should empty the array */
        $scope.selectedImages.images = [];
    }

}]);

app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
        }, 1);
    };
});

app.controller( 'fullWidthCtrl', ['$rootScope', '$scope', 'currentImage', 'shared', '$http', '$location', function( $rootScope, $scope, currentImage, shared, $http, $location ) {

    //$('#media-modal').foundation('reveal', 'open' );
    //$rootScope.secondtime = 1;

    $scope.modalTitle = 'Select Media';
    $scope.selectedImages = currentImage;
    //$scope.selectedImages.images = [];

    $scope.$on('$viewContentLoaded', function() {
        $('#grid_menu').css("display","none");
        $('#full_width_menu').css("display","block");
    });

    // Start Position
    $scope.$on('onRepeatLast', function(scope, element, attrs){

        //Size adjust
        mediamodalheight = parseInt( $('#media-modal').css("height") );
	console.log(mediamodalheight);
        aux = mediamodalheight-130-40;

        positioncount= 0;

        $('div.fullwidth-wrap img').each(function(index, value) {
            var obj = $(this).parents('div.card-container');
            var selector = $(this).parents('div.fullwidth-wrap');
	    var front = selector.siblings('.front');
            if($.inArray($(this).attr('src'),currentImage.images)>-1){
                selector.toggleClass('selected');
		front.toggleClass('selected');
                $(this).siblings('i.fa').css("display","block");
                var m = currentImage.images.length;
                if( m > 0 ) {
                    $('#bottom-toolbar').fadeIn();
                    $('#selected-count').text('');
                    if (m > 1) {
                        $('#selected-items').text(m + ' Selected');
                        $('#selected-count').text('(' + m + ')');
                    }
                }
            } else {
                $(this).siblings('i.fa').css("display","block");
            }
            obj.css( "position", "absolute" );
            obj.css( "top", 12 );
            obj.css( "left", positioncount );

            positioncount = positioncount+1000;


            //Size adjust
            /* $(this).css("max-height",aux);
             if($(this).height() < aux ) {
             aux2 = (aux - $(this).height() ) / 2 ;
             $(this).css("top", aux2);
             }*/

        });

        //Size adjust

        $('.fw-image-wrap').css("height",aux);
        $('.fullwidth-wrap').css("height",aux);
	$('#full-width-area').css("height",(aux+20));
        $('div.metawrap div.meta').css("height",aux);
        $('.meta-wrap').css("height",aux);
        $('#cg-button').css("display", "inline");
        $('#fw-button').css("display", "none");

        var h = $('div.fullwidth-wrap').length;
        $('#totalimg').text(h);

    });

    // Click RIGHT

    function moveright() {
        if (( parseInt( $('div.card-container').last().css("left") ) > 0 ) && ( parseInt($('div.card-container').first().css("left"))%1000 === 0) ) {
            $('div.card-container').each(function(index, value) {
                var obj2 = $(this);
                obj2.addClass("transi");
                leftposition = $(this).css("left");
                var leftposition = parseInt($(this).css("left")) -1000;
                $(this).css("left", leftposition);
            });
            myInteger = parseInt($('#actualimg').html());
            $('#actualimg').text((myInteger+1));
        }
    }

    $('a.right-arrow').click(function() {
        moveright();
    });

    $("#full-width-area").on("swipeleft",function(){
        moveright();
    });

    //Click LEFT

    function moveleft() {
        if (( parseInt($('div.card-container').first().css("left")) < 0 )
            && (parseInt($('div.card-container').first().css("left"))%1000 === 0)) {
            $('div.card-container').each(function(index, value) {
                var obj2 = $(this);
                obj2.addClass("transi");
                leftposition = $(this).css("left");
                var leftposition = parseInt($(this).css("left")) +1000;
                $(this).css("left", leftposition);
            });
            myInteger = parseInt($('#actualimg').html());
            $('#actualimg').text((myInteger-1));
        }
    }

    $('a.left-arrow').click(function() {
        moveleft();
    });

    $("#full-width-area").on("swiperight",function(){
        moveleft();
    });

    $http.get('assets/js/data.json').then(function(res){
        $scope.images = res.data.images;
        /**
         * Here we should check if to
         * include the uploaded image or not
         * as we are also showing the images count,
         * hiding it is not enough
         */
        if(!shared.uploaded)
            $scope.images.splice(0, 1);
    });


    $scope.imageSelect = function(index, event) {
        /**
         * Let's handel the image select process
         * in a way that we can rely on
         * note: event is not necessary here
         **/
        var imageSrc = $scope.images[index].large;
        /*
         * Step 1:
         * Check the existence of this image in our array
         * imageExists will return the index in our array if it finds it
         */
        var imageExists = $scope.selectedImages.images.indexOf(imageSrc);
        // image already exists
        if(imageExists != -1){
            // Remove it from the array
            $scope.selectedImages.images.splice( imageExists, 1 );
            // It doesn't exists
        } else {
            // Add it to the array
            $scope.selectedImages.images.push( imageSrc );
        }
        /*
         * Step 2:
         * Now we can simply toggle the selected class
         * as we are already handling the add or remove from the array
         */
        $('[data-index="'+index+'"]').find('.fullwidth-wrap').toggleClass('selected');
	$('[data-index="'+index+'"]').find('.meta-wrap').toggleClass('selected');

        $scope.showFooter();
    }

    $scope.deSelect = function(){
        /*$('div.fullwidth-wrap.selected i.fa').toggle();*/
        $('div.fullwidth-wrap.selected').removeClass('selected');
        $scope.selectedImages.images = [];
        $scope.showFooter();
    }

    $scope.showFooter = function() {
        /*
         * Watch the array and not the classes
         * for more reliable results
         **/
        var imagesCount = $scope.selectedImages.images.length;

        if( imagesCount > 0 ) {
            $('#bottom-toolbar').fadeIn();
            $('#selected-count').text('');
            if (imagesCount > 1) {
                $('#selected-items').text(imagesCount + ' Selected');
                $('#selected-count').text('(' + imagesCount + ')');
            }
        } else {
            $('#bottom-toolbar').fadeOut();
            $('#selected-items').text('');
        }

    }

    $scope.insertImages = function() {
        $location.path('/');
        $('#media-modal').foundation('reveal', 'close' );
        $('body').trigger( 'insertImages' );
        /* Here we should empty the array */
        $scope.selectedImages.images = [];
    }

    $scope.goHome = function(){
        $location.path('/');
        /* Here we should empty the array */
        $scope.selectedImages.images = [];
    }

    $scope.soon = function(){
        shared.soon();
    }

    $scope.flip = function(e){
        if ($(e.target).is('div#meta-data-view') || $(e.target).parents('div#meta-data-view').length > 0) {
	    obj = $(e.target).is('div#meta-data-view') ? $(e.target) : $(e.target).parents('div#meta-data-view');
            if (obj.hasClass('toggled')) {
		return;
	    }
	    obj.addClass('toggled');
	    obj.siblings().removeClass('toggled');
	    $('#crop, #rotate, #flip-h, #flip-v').addClass('disabled');
	    $(".flipper").velocity('reverse');

        } else if($(e.target).is('div#edit-view') || $(e.target).parents('div#edit-view').length > 0) {
	    obj = $(e.target).is('div#edit-view') ? $(e.target) : $(e.target).parents('div#edit-view');
            if (obj.hasClass('toggled')) {
		return;
	    }
	    obj.addClass('toggled');
	     obj.siblings().removeClass('toggled');
	     obj.siblings().removeClass('disabled');
           $(".flipper").velocity({ rotateY: "180deg"}, 1000);

        }
    }

}]);