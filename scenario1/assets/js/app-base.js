var app = angular.module('imageflow', [ 'ngRoute' ]);

app.run( function() {
	
});

app.config( function( $routeProvider ) {
	$routeProvider.when( '/mediaGrid', {
		templateUrl: '01-media-grid.html',
		controller: 'mediaGridCtrl',
	});
	$routeProvider.when( '/source', {
		templateUrl: '02-choose-source.html',
		controller: 'sourceCtrl',
	});
	$routeProvider.when( '/uploading', {
		templateUrl: '04-media-grid-uploading.html',
		controller: 'uploadingCtrl',
	});
})

app.service('currentImage', function() {
	this.images = [];
})

app.controller( 'mediaGridCtrl', ['$rootScope', '$scope', 'currentImage', '$http', '$location', function( $rootScope, $scope, currentImage, $http, $location ) {
	/** OPEN MODAL **/
	$('#media-modal').foundation('reveal', 'open' );
	
	$scope.modalTitle = 'Select Media';
	
	$scope.selectedImages = currentImage,
		
	$http.get('assets/js/data.json').then(function(res){
		$scope.images = res.data.images
	});
	
	$scope.imageSelect = function(key, e) {
		if( e.target.localName == 'img' || $(e.target).hasClass('image-wrap') ){
			$(e.target).parents('div.grid-wrap').toggleClass('selected');
			$(e.target).siblings('i.fa').toggle();
		} else {
			$(e.target).toggleClass('selected');
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
app.controller( 'textAreaCtrl', ['$rootScope', '$scope', 'currentImage', '$http', '$location', function( $rootScope, $scope, currentImage, $http, $location ) {
	
	$('body').on('insertImages', function() {
		$.each( currentImage.images, function( key, value ) {
			$scope.curVal = $('#tinyMCE').html();
			$scope.newVal = $scope.curVal + '<img src="' + value + '" />';
			$('#tinyMCE').html( $scope.newVal );
		});
	});
	
}]);
app.controller( 'sourceCtrl', ['$rootScope', '$scope', 'currentImage', '$http', '$location', function( $rootScope, $scope, currentImage, $http, $location ) {
		
	$scope.modalTitle = 'Upload File';
	
	$scope.goHome = function(){
		$location.path('/');
	}
	
}]);
app.controller( 'uploadingCtrl', ['$rootScope', '$scope', 'currentImage', '$http', '$location', function( $rootScope, $scope, currentImage, $http, $location ) {
	
	$scope.selectedImages = currentImage,
	
	$scope.modalTitle = 'Select Media';
	
	$scope.selectedImages = currentImage,
		
	$http.get('assets/js/data.json').then(function(res){
		$scope.images = res.data.images
	});		
	
	 $('#uploading').delay(200).fadeOut('slow');
	
	$scope.imageSelect = function(key, e) {
		if( e.target.localName == 'img' || $(e.target).hasClass('image-wrap') ){
			$(e.target).parents('div.grid-wrap').toggleClass('selected');
			$(e.target).siblings('i.fa').toggle();
		} else {
			$(e.target).toggleClass('selected');
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