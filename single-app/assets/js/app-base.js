var app = angular.module('imageflow', [ 'ngRoute' ]);

app.run( function() {
	
});

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
})

/** GLOBAL VAR FOR CURRENT IMAGES **/
app.service('currentImage', function() {
	this.images = [];
})

app.factory('shared', function(){
	return {
		soon: function(){
			 alert('Coming Soon!');
		}
	};
})

app.controller( 'mediaGridCtrl', ['$rootScope', '$scope', 'currentImage', 'shared', '$http', '$location', function( $rootScope, $scope, currentImage, shared, $http, $location ) {
    
	/** OPEN MODAL **/
	//if($scope.secondtime===1) {
	//} else {
    if(!$('#media-modal').hasClass('open'))
        $('#media-modal').foundation('reveal', 'open' );
	//}

	$scope.modalTitle = 'Select Media';
	
	$scope.selectedImages = currentImage;
	$scope.selectedImages.images = [];	
    
	$http.get('assets/js/data.json').then(function(res){
		$scope.images = res.data.images
	});
    
	$scope.imageSelect = function(key, e) {
		if( e.target.localName == 'img' || $(e.target).hasClass('image-wrap') ){
			var obj = $(e.target).parents('div.grid-wrap');
			obj.toggleClass('selected');
			$(e.target).siblings('i.fa').toggle();
			var img = $scope.images[obj.data('index')].large;
			
		} else {
			var obj = $(e.target);
			obj.toggleClass('selected');
			var img = $scope.images[obj.data('index')].large;
		}
		
		if( !obj.hasClass('selected') ){
			var index = $scope.selectedImages.images.indexOf( img );
			$scope.selectedImages.images.splice( index, 1 );
		} else {
			$scope.selectedImages.images.push( img );
		}
		$scope.showFooter();
	}
	
	$scope.deSelect = function(){
		$('div.grid-wrap.selected').each(function(){
			$(this).removeClass('selected');
			$(this).find('i.fa').hide();
		})
		$scope.showFooter();
		$scope.selectedImages.images = [];
	}
	
	$scope.showFooter = function() {
		var m = $('div.grid-wrap.selected').length;
		
		if( m > 0 ) {
			$('#bottom-toolbar').fadeIn();
			$('#selected-count').text('');
			if (m > 1) {
				$('#selected-items').text(m + ' Selected');
				$('#selected-count').text('(' + m + ')');
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
	}
	
	$scope.goHome = function(){
		$location.path('/');
	}
	
	$scope.soon = function(){
		shared.soon();
	}

    /**
     * Listen to the modal close event
     * and reset the route to make sure
     * the "Add Media" will trigger
     * the modal again in-case the modal
     * is closed on bg click.
     **/
    $(document).on('close.fndtn.reveal', '[data-reveal]',
        function(){
            if($location.path() != '/') {
                $scope.$apply(function () {
                    $location.path('/');
                });
            }
        }
    );

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
	}
	
}]);
app.controller( 'uploadingCtrl', ['$rootScope', '$scope', 'currentImage', 'shared', '$http', '$location', function( $rootScope, $scope, currentImage, shared, $http, $location ) {

	//$rootScope.secondtime = 1;
    
	$scope.selectedImages = currentImage,
	
	$scope.modalTitle = 'Select Media';
			
	$http.get('assets/js/data.json').then(function(res){
		$scope.images = res.data.images;
		setTimeout(function(){
			$('#uploading').fadeOut('slow');
			$scope.imageSelect(0, $('div.gridwrap'));
		}, 500 );
	});
	
	$scope.imageSelect = function(key, e) {
		if( e.target.localName == 'img' || $(e.target).hasClass('image-wrap') ){
			var obj = $(e.target).parents('div.grid-wrap');
			obj.toggleClass('selected');
			$(e.target).siblings('i.fa').toggle();
			var img = $scope.images[obj.data('index')].large;
			
		} else {
			var obj = $(e.target);
			obj.toggleClass('selected');
			var img = $scope.images[obj.data('index')].large;
		}
		
		if( !obj.hasClass('selected') ){
			var index = $scope.selectedImages.images.indexOf( img );
			$scope.selectedImages.images.splice( index, 1 );
		} else {
			$scope.selectedImages.images.push( img );
		}
		$scope.showFooter();
	}
	
	$scope.deSelect = function(){
		$('div.grid-wrap.selected').removeClass('selected');
		$scope.showFooter();
	}
	
	$scope.showFooter = function() {
		var m = $('div.grid-wrap.selected').length;
		
		if( m > 0 ) {
			$('#bottom-toolbar').fadeIn();
			$('#selected-count').text('');
			if (m > 1) {
				$('#selected-items').text(m + ' Selected');
				$('#selected-count').text('(' + m + ')');
			}
		} else {
			$('#bottom-toolbar').fadeOut();
			$('#selected-items').text('');
		}
		
	}
	
	$scope.insertImages = function() {
		$scope.selectedImages.images = [];		
		$.each( $('div.grid-wrap.selected'), function( value, key ) {
			$scope.selectedImages.images.push( $scope.images[$(this).data('index')].large );
		});
		$location.path('/');
		$('#media-modal').foundation('reveal', 'close' );
		
		$('body').trigger( 'insertImages' );
	}
	
	$scope.goHome = function(){
		$location.path('/');
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
		aux = mediamodalheight-132; 
		
		positioncount= 0;
		$('div.fullwidth-wrap img').each(function(index, value) { 
		    var obj = $(this).parents('div.fullwidth-wrap');            
		    if($.inArray($(this).attr('src'),currentImage.images)>-1){
			obj.toggleClass('selected');
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
		    positioncount=positioncount+1000;
	
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
		$('#cg-button').css("display", "inline"); 
		$('#fw-button').css("display", "none");        
		
	});

	// Click RIGHT
    
    function moveright() {
	    if (( parseInt($('div.fullwidth-wrap').last().css("left")) > 100 )
	    && (parseInt($('div.fullwidth-wrap').first().css("left"))%1000 === 0)) { 
		$('div.fullwidth-wrap').each(function(index, value) {
		    var obj2 = $(this); 
		    obj2.addClass("transi"); 
		    leftposition = $(this).css("left");
		    var leftposition = parseInt($(this).css("left")) -1000;
		    $(this).css("left", leftposition); 
		}); 
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
	    if (( parseInt($('div.fullwidth-wrap').first().css("left")) < 100 )
	    && (parseInt($('div.fullwidth-wrap').first().css("left"))%1000 === 0)) { 
		$('div.fullwidth-wrap').each(function(index, value) {
		    var obj2 = $(this); 
		    obj2.addClass("transi"); 
		    leftposition = $(this).css("left");
		    var leftposition = parseInt($(this).css("left")) +1000;
		    $(this).css("left", leftposition);   
		});
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
	});
    
	$scope.imageSelect = function(key, e) {
		if( e.target.localName == 'img' ||  e.target.localName == 'i' || $(e.target).hasClass('image-wrap') ){
			var obj = $(e.target).parents('div.fullwidth-wrap');
			obj.toggleClass('selected');
			//$(e.target).siblings('i.fa').toggle();
			var img = $scope.images[obj.data('index')].large;		
		} else {
			var obj = $(e.target);
			obj.toggleClass('selected');
			var img = $scope.images[obj.data('index')].large;
		}
		
		if( !obj.hasClass('selected') ){
			var index = $scope.selectedImages.images.indexOf( img );
			$scope.selectedImages.images.splice( index, 1 );
		} else {
			$scope.selectedImages.images.push( img );
		}
		$scope.showFooter();
	}
	
	$scope.deSelect = function(){
        /*$('div.fullwidth-wrap.selected i.fa').toggle();*/       
		$('div.fullwidth-wrap.selected').removeClass('selected');
		$scope.selectedImages.images = [];
		$scope.showFooter();
	}
	
	$scope.showFooter = function() {
		var m = $('div.fullwidth-wrap.selected').length;
		
		if( m > 0 ) {
			$('#bottom-toolbar').fadeIn();
			$('#selected-count').text('');
			$('#selected-items').text('');            
			if (m > 1) {
				$('#selected-items').text(m + ' Selected');
				$('#selected-count').text('(' + m + ')');
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
	}
	
	$scope.goHome = function(){
		$location.path('/');
	}
	
	$scope.soon = function(){
		shared.soon();
	}

	/*$scope.gobackgrid = function() {
        $scope.saveselectedimages = 1 ;
        window.location.href = "http://imageflow.pabloperea.com/single-app/#/mediaGrid";
	}*/
    
}]);