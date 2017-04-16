'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [])


    .controller('View1Ctrl', function ($scope, $http) {
        $scope.restaurants = new Array();
        $scope.mostRecentReview;
        $scope.getRestaurants = function () {
            var placeEntered = document.getElementById("txt_placeName").value;

            if (placeEntered != null && placeEntered != "") {
                document.getElementById('div_ReviewList').style.display = 'none';

                //This is the API that gives the list of venues based on the place and search query.
                $http.get('https://developers.zomato.com/api/v2.1/search?q='+placeEntered+'&count=3&apikey=bde4225154ccf6e90950b95c228fe8b5').success(function (data) {
                    {
                        for (var i = 0; i < data.restaurants.length; i++) {
                            $scope.restaurants[i] = {
                                "name": data.restaurants[i].restaurant.name,
                                "id": data.restaurants[i].restaurant.id
                            };
                        }
                    }

                })

            }
        }

        $scope.getReviews = function (restaurantSelected) {

            //This is the API call being made to get the reviews(tips) for the selected place or venue.

            $http.get('https://developers.zomato.com/api/v2.1/restaurant?res_id=restaurantSelected.id&apikey=bde4225154ccf6e90950b95c228fe8b5').success(function (result) {

                $scope.mostRecentReview = result.user_rating.rating_text;

                //This is the Alchemy API for getting the sentiment of the most recent review for a place.
                var callback = $http.get("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment" +
                    "?apikey=d0e7bf68cdda677938e6c186eaf2b755ef737cd8" +
                    "&outputMode=json&text=" + $scope.mostRecentReview.text);
                callback.success(function (data) {
                    if(data!=null && data.docSentiment!=null)
                    {
                        $scope.ReviewWithSentiment = {"reviewText" : $scope.mostRecentReview.text,
                            "sentiment":data.docSentiment.type,
                            "score":data.docSentiment.score  };
                        document.getElementById('div_ReviewList').style.display = 'block';


                    }
                })
            })

        }

    });
