var elem = document.querySelector('.carousel');
var flkty = new Flickity( elem, {
  // options
	imagesLoaded: true,
	cellAlign: 'center',
	contain: true
});

var imgs = document.querySelectorAll(".card__image img");
var docStyle = document.documentElement.style;
var transformProp = typeof docStyle.transform == 'string' ? 'transform' : 'WebkitTransform';
var info = document.querySelector(".info");

flkty.on( 'scroll', function () {
	flkty.slides.forEach( function (slide, i) {
		var img = imgs[i];
		var x = ( slide.target + flkty.x ) * -1/3;
		
		img.style[transformProp] = 'translateX(' + x + 'px) scale(1.3)';
	} );
} );




var modalEle = document.querySelector(".modal");
var modalImage = document.querySelector(".modalImage");
var captionText = document.getElementById("caption");
Array.from(document.querySelectorAll(".card__image .ImgThumbnail")).forEach(item => {
   item.addEventListener("click", event => {
      modalEle.style.display = "block";
      modalImage.src = event.target.src;
      captionText.innerHTML = event.target.alt;
   });
});
document.querySelector(".close").addEventListener("click", () => {
   modalEle.style.display = "none";
});