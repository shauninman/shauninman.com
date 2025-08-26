$(function()
{
	// force MobileSafari to preload the 4k device images
	(new Image()).src = 'images/device-iphone.png';
	(new Image()).src = 'images/device-ipod.png';
	(new Image()).src = 'images/device-ipad.png';
	(new Image()).src = 'images/device-macbook.png';
	
	// select the current device
	if (navigator.userAgent)
	{
		if (m = navigator.userAgent.match(/(iphone|ipod|ipad)/i))
		{
			$('#preview')[0].className = m[1].toLowerCase();
		}
		else
		{
			$('#preview')[0].className = 'macbook';
		};
	};
	
	// change device preview onclick
	$('#devices span').click(function()
	{
		$('#preview')[0].className = this.id;
	});
	
	$('a[href=#app-store-mac]').click(function()
	{
		return false;
	});
	
	// parallax stars
	$(window).scroll(function()
	{
		var y = $($.browser.webkit?'body':'html').scrollTop();
		$('#space-front').css({'background-position': 	'50% -' + Math.floor(y/2) + 'px'});
		$('#space-mid').css({'background-position':		'50% -' + Math.floor(y/5) + 'px'});
		$('#space-back').css({'background-position':	'50% -' + Math.floor(y/10) + 'px'});
	});
});

// bob the water planet (not Bob the Water Planet)
function bob() { $('#icon').animate({'top':'+=6px'}, 1000).animate({'top':'-=6px'}, 1000, bob); }; bob();
