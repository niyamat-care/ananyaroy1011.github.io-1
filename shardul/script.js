(function(){
// setup your carousels as you normally would using JS
// or via data attributes according to the documentation
// https://getbootstrap.com/javascript/#carousel
$('#video-carousel').carousel({ interval: false }); //Disable auto-slide
}());

/*
* Video carousel - Dynamically load in YouTube videos based on 'data-id'
*/
//Load the YouTube Iframe API
var tag = document.createElement('script');

tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


//This will be the object name for interacting with the videos in the rest of this code
var videoArray = new Array();

//Function: onYouTubePlayerAPIReady - Run when API is ready
function onYouTubePlayerAPIReady() {

//Look for video 'data-id' in the '.youtube-video' div
var videos = document.querySelectorAll('#video-carousel .youtube-video');


//Loop through each div found
for (var i = 0; i < videos.length; i++) {

//Create an array to hold the video IDs from 'data-id'
dataset = videos[i].dataset.id;
cclang = videos[i].dataset.lang;
ccpolicy = videos[i].dataset.cc;
	
//This will be the variable name for inserting videos into the HTML divs
var divID = 'vid-' + i.toString();

//Setup video object, configure how videos should be presented
videoArray[i] = new YT.Player(divID, {
height: '100%',
width: '100%',
playerVars: {
'autoplay': 0,
'controls': 1,
'modestbranding': 1,
'rel': 0,
'showinfo': 0,
'loop': 1,
'iv_load_policy': 3,
'cc_lang_pref': cclang,
'cc_load_policy': ccpolicy
},
videoId: dataset, //Uses current looped ID from array
events: {
'onReady': onPlayerReady,
'onStateChange': onPlayerStateChange
}
});

}
}

//Function: onPlayerReady - Run when video player is ready
function onPlayerReady(event) {

//When the Bootstrap Carousel moves
$('#video-carousel').on('slide.bs.carousel', function () {

//Find each Iframe within '#video-carousel'
$(this).find('iframe').each(function(){

//Pause all YouTube videos
event.target.pauseVideo();

});


//Show custom video button
//$('.play-button-wrapper .btn-video').show();

});


}

//Function: onPlayerStateChange - Run when a videos state has changed
function onPlayerStateChange(event) {

//Find all custom video buttons within '#video-carousel'
$("#video-carousel").find('.play-button-wrapper .btn-video').each(function(){

//If video has Ended
if (event.data == YT.PlayerState.ENDED) {
$(this).fadeIn("Slow");//Fade out
$(this).find('i').attr("class", "fa fa-play");
}

//If video is Playing
if (event.data == YT.PlayerState.PLAYING) {
$(this).find('i').attr("class", "fa fa-pause");//Change icon
$(this).fadeOut("Slow");//Fade out
}

//If video is Paused
if (event.data == YT.PlayerState.PAUSED) {
$(this).fadeIn("Slow");//Fade out
$(this).find('i').attr("class", "fa fa-play");
}

//If video is Buffering
if (event.data == YT.PlayerState.BUFFERING) {
$(this).find('i').attr("class", "fa fa-circle-o-notch fa-spin fa-fw");
}

});
}

//Bind Click and Touchstart events to the custom video button
$( ".play-button-wrapper" ).bind("click touchstart", function() {

//Find the active carousel slide and target the Iframe within it
$("#video-carousel").find('.active iframe').each(function(){

//Find the integer from the div ID and split - Use objectID[1] to output the integer
var objectID = $(this).attr('id').split('-');


//If the active slide's video is Playing
if (videoArray[ objectID[1] ].getPlayerState() == 1) {
videoArray[ objectID[1] ].pauseVideo(); //Pause video on click

//If the active slide's video is Paused
} else if (videoArray[ objectID[1] ].getPlayerState() == 2) {
videoArray[ objectID[1] ].playVideo(); //Play video on click

//If the video is doing anything else
} else {
videoArray[ objectID[1] ].playVideo(); //Play video on click
}

});
});
