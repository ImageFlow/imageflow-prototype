var app = angular.module('imageflow', [ 'ngRoute' ]);

app.run( function() {
	
});

app.config( function( $routeProvider ) {
	$routeProvider.when( '/mediaGrid', {
		templateUrl: '01-media-grid.html',
		controller: 'mediaGridCtrl',
	});
})

app.service('currentImage', function() {
	this.images = [];
})

app.controller( 'mediaGridCtrl', ['$rootScope', '$scope', 'currentImage', '$http', function( $rootScope, $scope, currentImage, $http ) {
	/** OPEN MODAL **/
	$('#media-modal').foundation('reveal', 'open' );
	
	$scope.selectedImages = currentImage,
		
	$http.get('assets/js/data.json').then(function(res){
		$scope.images = res.data.images
	});
	
	$scope.imageSelect = function(key, e) {
		if( e.target.localName == 'img' || $(e.target).hasClass('image-wrap') ){
			$(e.target).parents('div.grid-wrap').toggleClass('selected');
		} else {
			$(e.target).toggleClass('selected');
		}
		$scope.showFooter();
	}
	
	$scope.showFooter = function() {
		var m = $('div.grid-wrap.selected').length;
		
		if( m > 0 ) {
			$('#bottom-toolbar').fadeIn();
			$('#selected-count').text('');
	      	$('#selected-items').text(m + ' Selected');
	      	$('#selected-count').text('(' + m + ')');
		} else {
			$('#bottom-toolbar').fadeOut();
			$('#selected-items').text('');
		}
		
	}
	
	$scope.insertImages = function() {
		console.log( $scope.selectedImages );
		
		$.each( $('div.grid-wrap.selected'), function( value, key ) {
			$scope.selectedImages.images.push( $scope.images[$(this).data('index')] );
		});
		
		console.log( $scope.selectedImages );
	}
	
}]);