---
layout: post
title: Build a local search based app with geolocation
comments: true
tags: [javascript, geolocation, app.js, yahoo YQL, mobile, webapp]
---

Use native browser based geolocation and Yahoo's YQL to build a local search based webapp.

---

In this tutorial, we will be building a local search based app with geolocation
(using [Yahoo's YQL](https://developer.yahoo.com/yql/console/) API). We will be
using the user search term to query against Yahoo's API and get the right local
data back.

### 1. Picking A Mobile Javascript Framework

I've been on the hunt for a lightweight javascript mobile app framework for
sometime. Some of the contenders included
[Framework7](http://www.idangero.us/framework7), [Ionic](ionicframework.com/),
[jQuery Mobile](http://jquerymobile.com/), [Lungo](http://lungo.tapquo.com/) and
[Mobile Angular UI](http://mobileangularui.com/) which are ALL great options in
my opinion...but I wanted something super-lightweight with a minimal footprint.
I came across [App.js](http://code.kik.com/app/) by Kik (yep the same company
who brought you Kik Messenger). App.js seemed to fit all the criteria I was
looking for--lightweight, native-like interactions and easily customizable.

With App.js, you can get a mobile webapp up in running in no time at all. The
best part is, you can use just Javascript, CSS and HTML to have an almost
native-like experience on basic apps.

**Side note**
If you want a "more comprehensive" framework, pick something like [Ionic](ionicframework.com/). App.js
is a great framework for light, minimal apps but if you want to build something more
robust, Ionic has a great following and plenty of native feature support.

### 2. Setup App.js template

Kik does provide a nice App.js starter template, but you can skip a few extra
steps and clone my version. This way you don't have to worry about setting up
the javscript and css files.

```
git clone git@github.com:cdmedia/appjs-starter-kit.git
```

This is a great starting point for the app. Visit the project on your localhost and
you can play around with all the nice features App.js includes like stack management, page transitions, and UI
components.

### 3. Add Font Awesome

We are going to add one more stylesheet to our `index.html` template. Just below the reference to `app.min.css` add:

{% highlight html %}
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
{% endhighlight %}

### 4. Add our styling

In your `css/style.css` file add the following code. I won't bother to go
through all the CSS, but just know this will help clean up some things down the
line.

{% highlight css %}
.list-distance {
  float: right;
  font-size: 12px;
  font-weight: bold;
  color: #AFAFAF;
}
.app-page .placeholder.active {
  display: block;
}
.app-button a {
  color: #fff;
  text-decoration: none;
}
.app-page .placeholder {
  margin: 0;
  width: 100%;
  height: 100px;
  color: #999;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -55px;
}
.app-page .placeholder span:before {
  display: block;
  margin: 0 auto 16px;
  height: 65px;
  width: 65px;
  -webkit-background-size: 100%;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  content: "\f002";
  font-family: FontAwesome;
  font-size: 50px;
}
.app-page .loader {
  margin: 0;
  width: 100%;
  height: 100px;
  color: #999;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -55px;
}
.app-page .loader i {
    color: #999;
}
span.rating-stars {
  color: rgb(180, 180, 66);
}
span.no-ratings {
  font-size: 12px;
  color: #6A6767;
  font-weight: bold;
}
span.latest-review-date {
  font-size: 12px;
  color: #7C7C7C;
  line-height: 20px;
}
p.latest-review {
  font-style: italic;
}
{% endhighlight %}

### 5. Add our list view template

Open up your `index.html` file. Now just remove everything in the `<body>` tags and paste in this as a starting point.

{% highlight html %}
<body>
  <div class="app-page" data-page="listView">
    <div class="app-topbar blue">
      <div class="app-title">My Local App</div>
    </div>
    <div class="app-content">
      <form action="">
          <input id="search" class="app-input no-icon-android" type="search" placeholder="Search...">
          <input type="submit" style="display:none">
      </form>
      <div class="results">
        <div class="placeholder search"><span></span>Search for something local...</div>
        <div class="loader"><i class="fa fa-spinner fa-spin fa-3x"></i></div>
      </div>
    </div>
  </div>
  <script src="js/zepto.js"></script>
  <script src="js/app.min.js"></script>
  <script src="js/app.js"></script>
</body>
{% endhighlight %}

What we have done here is created an app.js `data-page` for our `listView` which will
display a list of local suggestions based on our search query. App.js allows these data pages
to "stack" ontop of one another, similar to native mobile applications.

We can place all our content in the `<div class="app-content">`. In there you can
see we have a simple search form we will use to get the user's search query. Just below
is the `<div class="results">` div which is where our search results will populate. We also
threw in a nice Font Awesome spinning loader which will show the user that the app is "thinking"
(give the app enough time to submit a YQL query without the user losing interest or think it's broken).

### 6. Setting up the Javascript

Now that we have our list view template made, we can start to get this app working.
Open up your `js/app.js` file and delete whatever is in there. We will go through step by step.

*Side-note* : There will be lots of `console.log()` sprinkled throughout the source to make sure everything's running smoothly. Feel free to remove or
ignore these (I actually suggest removing all of them completely after you are done building as they are memory hogs).

First thing we will do is create a controller for our list view and then init our app to load
the list view on initial load state:

{% highlight js %}
App.controller('listView', function (page) {
  console.log('Ready');
});

try {
    App.restore();
} catch (err) {
    App.load('listView');
}
{% endhighlight %}

Now if you visit your index.html in your browser, you should see the console logged with 'Ready'.

### 7. Geolocation

Next step is to get the user's location. Luckily, Javascript [already has a built in API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation) for
getting a user's location so we don't have to rely on any outside libraries for this.

First, let's declare some geo variables that we will be using later. At the top of your
`js/app.js` file before your `App.controller(...`, add:

{% highlight js %}
var geoAvailable = false;
var geoData = [];
var geoPlace = [];
{% endhighlight %}

Next, we are going to check to make sure that the browser supports the geolocation API
and if it doesn't, throw an app.js pop up error. Just below the previous variables add:

{% highlight js %}
if ("geolocation" in navigator) {
    geoAvailable = true;
} else {
    geoAvailable = false;
    App.dialog({
      title        : 'Geolocation Error',
      text         : 'Looks like we cannot find you. Please upgrade to a newer browser',
      okButton     : 'OK'
    });
}
{% endhighlight %}

Also, just below your gelocation check we are going to hide the search placeholder:

{% highlight js %}
$('.placeholder').hide();
{% endhighlight %}

Now that we have made sure we can use geolocation, let's start using it. We are going to
create a getGeolocation function that will return the current position. Just below the `$('.placeholder').hide();`:

{% highlight js %}
/*
 * Get geolocation
 */
function getGeolocation() {
    var success = function(position) {
        geoData.push(position);
        //getGeoPlace(position); // Get zip code using position from geolocation
        console.log(position);
        return position;
    };
    var error = function(error) {
        switch(error.code)
        {
            case error.PERMISSION_DENIED:
                App.dialog({
                    title        : 'Geolocation Error',
                    text         : 'Looks like we cannot find you. Please enable location services for this site.',
                    okButton     : 'OK'
                });
            break;
            case error.POSITION_UNAVAILABLE: alert("could not detect current position");
            break;
            case error.TIMEOUT:
                App.dialog({
                    title        : 'Geolocation Error',
                    text         : 'Retrieving position timeout. Please try reloading the page.',
                    okButton     : 'OK'
                });
            break;
            default: alert("unknown error");
            break;
        }
        return false;
    };
    window.navigator.geolocation.getCurrentPosition(success, error, {timeout:10000});
}
{% endhighlight %}

Let's break down what's going on in this function. You can see we have 2 function variables declared: success and error
along with the Javascript function to get the current geolocaton. We call the `window.navigator.geolocation.getCurrentPosition()` function
with our variables as parameters to handle success and error.

On successful geolocation, we return the current position. In addition, we will also push the current position to our `geoData` array for use later on.
We also have a `getGeoPlace()` function where we are calling with the return position...
but we will get to this later so don't worry about that right now (notice it's commented out).

On geolocation error, we call App.js pop-up dialogs with a few suggestions to the user on how to fix
the problem.

**Note:**  If a user DOES end up denying location access, the only way to fix this is for the
user to open their browser location settings and change them on their own...there's no way
to force the user to give their location.

Now remove the `console.log` and call the function inside our `listView` controller:

{% highlight js %}
App.controller('listView', function (page) {
  // Get initial geolocation for search
  getGeolocation();
});
{% endhighlight %}

If you refresh your index.html, you should now see your geolocation logged in the javascript console.

### 8. Yahoo YQL

Great we now have our geo coordinates, but now what? Luckily, there are plenty of APIs in
which you can utilize geolocation. We are going to take advantage of [Yahoo's YQL](https://developer.yahoo.com/yql/console/), a query
language with all kinds of goodies and data to play with.

YQL is structured similar to SQL, so querys can be easily written and understood. For our local search app,
we are going to be querying 2 tables in Yahoo's database: Geo place and local search (as we need to get
geo place in order to build a local search query).

We will start off with a generic YQL query function we can use for both. Add this just above your
`getGeolocation()` function:

{% highlight js %}
// YQL serves JSONP (with a callback) so all we have to do
// is create a script element with the right 'src':
function YQLQuery(query, callback) {
    this.query = query;
    this.callback = callback || function(){};
    this.fetch = function() {
        if (!this.query || !this.callback) {
            throw new Error('YQLQuery.fetch(): Parameters may be undefined');
        }
        var scriptEl = document.createElement('script'),
            uid = 'yql' + +new Date(),
            encodedQuery = encodeURIComponent(this.query.toLowerCase()),
            instance = this;
        YQLQuery[uid] = function(json) {
            instance.callback(json);
            delete YQLQuery[uid];
            document.body.removeChild(scriptEl);
        };
        scriptEl.src = 'https://query.yahooapis.com/v1/public/yql?q='
                     + encodedQuery + '&format=json&callback=YQLQuery.' + uid;
        document.body.appendChild(scriptEl);
    };
}
{% endhighlight %}

This function accepts a YQL query statement and a callback in order to run after
a successful query.

The goal of this app is to get local interests based on location but Yahoo's YQL Query for
getting local items doesn't allow us to just pass in geolocation coordinates. In order to get
local interest, we need to get the "Geo Place" first (aka zipcode or area). We will query Yahoo's YQL
with our geolocation coordinates to the geo place. Once we get the geo place, we will be able to retreive local interests.

Let's build a function to get our geo place based on our geolocation coordinates. Place this
above our `getGeolocation()` function and make sure to uncomment the `getGeoPlace(position);` inside
our `getGeolocation()` function as well:

{% highlight js %}
/*
 * Get geo place location based on Yahoo YQL
 * @position Navigator geolocation object
 */
function getGeoPlace(position) {
    var callback = function(data) {
        function yPlace(place) {
            this.place = place;
        }
        var place = new yPlace(data.query.results.Result);
        geoPlace.push(place); // Store geoPlace data in geoData variable
        console.log(place);
    };
    var query = 'SELECT * FROM geo.placefinder WHERE text="' + position.coords.latitude + ',' + position.coords.longitude + '" and gflags="R"';
    var place = new YQLQuery(query, callback);
    place.fetch();
}
{% endhighlight %}

Here we are using the geolocation coordinates to create a YQL statement that will then be
passed into our `YQLQuery()` function. After that function has run, the `getGeoPlace()` callback
function is called that get's the result data and pushes it to the `geoPlace` array for later use.
Now when we perform our search based on a search query, we will have the geolocation and geo place
stored in variables.

Let's build one more function that will peform a search based on a user's inputted search
keyword. Add this just below `getGeoPlace()` function:

{% highlight js %}
/*
 * Perform a search based on input
 * @input Input value
 */
function performSearch(input) {
    var value = input.value;
    value = value.trim(); // Clean up spaces from the search query
    input.blur(); // Unfocus search input
    // Build YQL Search query
    var zipcode = geoPlace[0].place.uzip;
    var query = 'SELECT * FROM local.search(20) WHERE query="' + value + '" and location="' + zipcode + '"';
    var request = new YQLQuery(query, buildResults);
    request.fetch();
    console.log(request);
}
{% endhighlight %}

Here we are taking the user's input text, trimming it to make sure there isn't any funky spacing, navigate
away from the input and then query. Similar to above, we are going to use the `YQLQuery()` function to query against
Yahoo's database, but this time to get local search results based on geo place. Notice, we only need the first
zipcode `geoPlace[0].place.uzip` since the user is in only one location at a time. Also, notice that our
callback for the `YQLQuery()` is `buildResults`. We will be getting to this next, but this will build all the results
after our `YQLQuery()` has run. Finally, we will call the YQLQuery's `.fetch()` to fetch the data from YQL.

In order to avoid any javascript errors, just below the `performSearch()` function add an empty
for our `YQLQuery()` from above.

{% highlight js %}
/*
 * Build results
 * @data YQL query data
 */
function buildResults(data) {
  console.log(data);
}
{% endhighlight %}

Now let's plug that into our list view controller and see the magic happen:

{% highlight js %}
App.controller('listView', function (page) {
    getGeolocation(); // Get initial geolocation for search
    $('.loader').show(); // Show loader while geo is working
    setTimeout(function() {
        $('.loader').hide();
        $('.placeholder').show();
    }, 2500); // Give us a bit of time for the geolocation to work
    // Get HTML elements
    var form        = page.querySelector('form'),
        input       = page.querySelector('form .app-input'),
        placeHolder = page.querySelector('.placeholder'),
        resultTmpl  = page.querySelector('.result');
    form.addEventListener('submit', function(e) {
         e.preventDefault();
        // If user tries to search before geo is loaded
        if (typeof geoPlace[0] === "undefined") {
            App.dialog({
                    title        : 'Whooooah',
                    text         : 'Slow down there, sonny...we are still trying to figure out where you are. Try searching again.',
                    okButton     : 'OK'
                });
        } else {
            performSearch(input);
        }
    });
});
{% endhighlight %}

Notice we've added a few more things to this function. First, we are going to show the loader
while the app is working. We are also going to set a timeout function to give us a bit of time
when the user initially opens the app. This way, we can try and gather geolocation and geo place.
Next, we are going to grab all the template elements that we will need. Last, we will add an
event listener to check if the user submits a new search. If the user submits before geo is loaded, we
will throw a dialog error. Otherwise, we will peform a search based on the search input text.

Now try performing a search. You should be able to see all the local results populate your javascript console.

### 9. Rendering the results

Awesome. Now we have all the data, we just have to render it on the page. Luckily, we don't have to
do too much since App.js already looks pretty nice as it is. For the list view, all we really need
is the title of the place and how far away it is. Let's build a function that will render our results.
Just below `performSearch()`, replace the `buildResults()` function from above with this:

{% highlight js %}
/*
 * Build results
 * @data YQL query data
 */
function buildResults(data) {
    var results = data.query.results.Result;
    var resultCount = data.query.count;
    var location = results[0].City + ', ' + results[0].State;
    var container = '<ul class="app-list"><label>Displaying ' + resultCount + ' results near ' + location + '</label></ul>';
    $('.placeholder').hide(); // Hide placeholder
    $('.loader').show();
    setTimeout(function() {
        $('.loader').hide();
        // Build results list
        $('.results').empty();
        $('.results').append(container);
        $.each(results, function(i, val){
            var listContent = '<li class="result-item-' + val.id + '">' + val.Title + '<span class="list-distance">' + val.Distance + ' m</span></li>';
            $('.app-list').append(listContent);
            $('.result-item-' + val.id).on('click', function(){
                App.load('detailView', val);
            });
            console.log(val);
        });
    }, 2000);
    console.log(data);
}
{% endhighlight %}

In this function we will insert our data into our template. First, we will set up a few variables
based on our input data (result data from YQL). We will then add a small label below the
title displaying the city, state and result count. Then, we will hide the results placeholder and show
the loader while the query processes. We then set a timeout to give the YQLQuery a little bit time to process
in which we hide the loader, empty out the results div (on each new search), and then append items to
the results container using our YQL data. One more thing to note: we also add a unique id to each
result item in order to build out a "detail view" later. Here we will add a click event for later use
to load the 'detailView' and pass in the individual items' data with `App.load('detailView', val)`.

Now when you peform a search, results should populate in the results area. Try searching "pizza".

### 9. Building the detail view

Now that we have a list view of local items, we need to have a way for the user to
get more information, call or get the address. First let's create a template in our `index.html`.
Add this just after the `<div class="app-page" data-page="listView"></div>` div node.

{% highlight html %}
<div class="app-page" data-page="detailView">
  <div class="app-topbar blue">
    <div class="app-button left" data-back data-autotitle></div>
    <div class="app-title">Details</div>
  </div>
  <div class="app-content">
    <div class="app-section">
      <h3 class="title"></h3>
      <div><span class="address"></span><span class="city-state"></span></div>
      <div><span class="distance"></span></div>
      <div><span class="phone"></span></div>
      <div><span class="rating-stars"></span><span class="no-ratings"></span></div>
    </div>
    <div class="app-section">
      <div class="app-button blue"><a href="#" class="call"><i class="fa fa-phone"></i> Call</a></div>
      <div class="app-button green"><a href="#" class="directions"><i class="fa fa-map-marker"></i> Get Directions</a></div>
      <div class="app-button orange"><a href="#" class="website"><i class="fa fa-laptop"></i> Website</a></div>
    </div>
    <div class="review-section"></div>
  </div>
</div>
{% endhighlight %}

Here we are creating another app page called "detailView". In the `<div class="app-content">`, we
have some blank divs and spans which will be populated once the app data comes in.

Now let's create a controller for our detail view. Just below the `App.controller('listView', function (page)...`
function add:

{% highlight js %}
App.controller('detailView', function (page, data) {
    this.transition = 'rotate-right';

    $(page).find('.title').text(data.Title);
    $(page).find('.address').text(data.Address + ' ');
    $(page).find('.city-state').text(data.City + ', ' + data.State);
    $(page).find('.distance').text(data.Distance + ' miles away');
    $(page).find('.phone').text(data.Phone);

    // Ratings
    var numberOfRatings = parseInt(data.Rating.TotalRatings);
    var averageRating = parseInt(data.Rating.AverageRating);
    if(numberOfRatings > 0) {
        for(i=0; i < 5; i++){
            // Good stars
            if(i < averageRating){
                $(page).find('.rating-stars').append('<i class="fa fa-star"></i>');
            }else{
                $(page).find('.rating-stars').append('<i class="fa fa-star-o"></i>');
            }

        }
        $(page).find('.no-ratings').text(' (' + numberOfRatings + ' Ratings)');
    }

    // Reviews
    var totalReviews = parseInt(data.Rating.TotalReviews);
    var latestReviewDate = new Date(data.Rating.LastReviewDate * 1000);
    var latestReview = data.Rating.LastReviewIntro;
    if(totalReviews > 0){
        $(page)
            .find('.review-section')
            .html('<div class="app-section"><h4>' + totalReviews + ' Reviews</h4><div><span class="latest-review-date">' + latestReviewDate + '</span><p class="latest-review">' + latestReview + '</p></div></div>');
    }

    // Update links
    $(page).find('.call').attr("href", 'tel:' + data.MapPhone);
    $(page).find('.directions').attr("href", data.MapUrl).attr("target", "_blank");
    $(page).find('.website').attr("href", data.BusinessUrl).attr("target", "_blank");

});
{% endhighlight %}

Now onto the detail view controller. Notice that we have `data` as an additional parameter in the
`App.controller()`. This is where the geo place detail data will be entering into the function
(seen in the `buildResults()` function as `App.load('detailView', val)`). We will then use an App.js transition to define a nice rotate
transition into our view. Next, we will find the basic HTML elements and add in the right data based on
the appropriate field using App.js `$(page).find()` function. Now onto the rating section: Here we will parse the data into integars
(since they come in as strings) and make sure there are some ratings. If there are, we will
display open/closed stars based on the rating. Then in the reviews section, we parse the
number of reviews and last review date. If there are reviews, we'll add the data to the
HTML. Last, we will update the contact links with the associated geo place.

### Conclusion

![Local Search App](https://raw.githubusercontent.com/cdmedia/cdmedia.github.io/master/public/img/tuts/loclii-demo.gif)

There you have it, we have built a local search web app w/ geolocation using Yahoo's YQL.
You can view the full source on [github](https://github.com/cdmedia/loclii) or see a working [demo here](http://cdmedia.github.io/loclii).
Please feel free to leave questions/comments/suggestions!
