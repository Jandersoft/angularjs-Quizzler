/**
 *
 *  Gravatar AngularJS Directive used to display Gravatar image based on specified email.
 *  Uses RequireJS and the md5 cipher in the Crypto module
 *
 *  Usages:
 *
 *       <gravatar email="user.email" size="50" default-image="'monsterid'" ></gravatar>
 *           which injects into the DOM:
 *       '<img ng-src="http://www.gravatar.com/avatar/{{hash}}{{getParams}}"/>
 *
 *  Configuration:
 *
 *       angular.module( 'myApp')
 *              .directive( 'gravatar', Gravatar );
 *
 *
 *  @author      Thomas Burleson
 *  @copyright   Mindspace, LLC
 *
 *  @see utils.md5
 *
 */
(function( define, angular ) {
    "use strict";

    /**
     *  Declare the dependent files (encryption and supplant) that must be loaded and
     *  injected (outside of AngularJS)
     *
     *  @type {Array}
     */
    var dependencies = [ 'mindspace/utils/crypto/md5' ];

    /**
     * Register the Gravatar construction function with RequireJS
     *
     */
    define( dependencies, function ( md5 )
    {
            /**
             * Construction function
             * Does not need any AngularJS DI
             *
             * @constructor
             */
        var Gravatar = function( ) {

            var scope = null,
                /**
                 * Iterate the `scope.options` list
                 * to build a query string for the Gravatar img tag...
                 */
                generateParams = function ()
                {
                    var options = [];
                    scope.getParams = '';
                    angular.forEach(scope.options, function(value, key) {
                        if ( value ) {
                            options.push(key + '=' + encodeURIComponent(value));
                        }
                    });
                    if ( options.length > 0 ) {
                        scope.getParams = '?' + options.join('&');
                    }
                },
                /**
                 * EventHandler for `email` attribute changes
                 * @param email
                 */
                onEmailChange = function( email )
                {
                    if ( email ) {
                        // Encrypt email using md5 cipher
                        scope.hash = md5( email.trim().toLowerCase() );
                    }
                },
                /**
                 * EventHandler for `size` attribute changes
                 * @param size
                 */
                onSizeChange = function( size )
                {
                    scope.options.s = (angular.isNumber(size)) ? size : undefined;
                    generateParams();
                },
                /**
                 * EventHandler for `forceDefault` attribute changes
                 * @param forceDefault
                 */
                onForceDefault = function( forceDefault )
                {
                    scope.options.f = forceDefault ? 'y' : undefined;
                    generateParams();
                },
                /**
                 * EventHandler for `defaultImage` attribute changes
                 * @param defaultImage
                 */
                onImageChanged = function( defaultImage )
                {
                    scope.options.d = defaultImage ? defaultImage : undefined;
                    generateParams();
                };

            // Return configured, directive instance

            return {
                restrict : 'E',
                replace  : true,
                scope    : {
                    email       : '=',
                    size        : '=',
                    defaultImage: '=',
                    forceDefault: '='
                },
                link: function($scope, element, attrs)
                {
                    scope         = $scope;
                    scope.options = {};
                    scope.$watch( 'email',         onEmailChange   );
                    scope.$watch( 'size',          onSizeChange    );
                    scope.$watch( 'forceDefault',  onForceDefault  );
                    scope.$watch( 'defaultImage',  onImageChanged  );

                },
                template : '<img ng-src="http://www.gravatar.com/avatar/{{hash}}{{getParams}}"/>'
            };
        };

        // Publish the Gravatar directive construction function

        return Gravatar;

    });

})( define, angular  );
