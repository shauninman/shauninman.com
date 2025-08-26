var player;
function insertYouTubePlayer()
{
	player = new YT.Player('player-container',
	{
		videoId	: 'xSJPkrmfKrM',
		width	: '320',
		height	: '240',
		playerVars:
		{
			'modestbranding': 1,
			'theme'			: 'dark',
			'color'			: 'red',
			'autohide' 		: 1,
			'controls'		: hasFlash?1:0,
			'autoplay' 		: 1,
			'enablejsapi' 	: 1,
			'showinfo'		: 0,
			'showsearch'	: 0,
			'rel'			: 0
		},
		events: 
		{
			'onStateChange'	: onYouTubePlayerStateChange
		}
	});
	
	$('#trailer').show();
};

function pauseYouTubePlayer()
{
	if (player) player.pauseVideo();
};

function onYouTubePlayerStateChange(event)
{
	switch(event.data)
	{
		case YT.PlayerState.PLAYING: // playing
			$('#curtain').fadeIn();
		break;
		
		case YT.PlayerState.ENDED: // end
		case YT.PlayerState.PAUSED: // pause
			$('#curtain').fadeOut();
		break;
	};
};

function insertSoundTestPlayer()
{
	swfobject.embedSWF('images/flashnsf.swf', 'nsf-player', '140', '32', '10.0.0', 'expressInstall.swf', 
	{
		file:'images/lastrocket.nsf',
		showBorders:0,
		textAfterButtons:1,
		showTitle:0,
		showTrack:0,
		showCopyright:0,
		buttonSize:32,
		buttonPadding:0,
		buttonSpacing:4,
		loop:1
	},
	{
		menu: 'false',
		scale: 'noScale',
		allowFullscreen: 'false',
		allowScriptAccess: 'always',
		bgcolor: '#fff',
		align: 'tl',
		salign: 'tl'
	},
	{
		id: 'flashnsf'
	});
	
	$('#nsf-player-container').mousedown(function(e)
	{
		var offset = $(this).offset();
		var x = e.pageX - offset.left;
		
		var btn = '';
		if (x > 0)
		{
			if (x < 36) {			btn = 'prev-down'; track--; }
			else if (x < 36 * 2)	btn = 'play-down';
			else if (x < 36 * 3)	btn = 'pause-down';
			else if (x < 36 * 4) {	btn = 'next-down'; track++; }
		};
		if (track < 0) track = 0;
		if (track >= tracks) track = tracks-1;
		$('#nsf-player-btns').attr('class', btn);
		$('#track').attr('class', 'track-'+track);
	});
	
	$(document).mouseup(function(e)
	{
		$('#nsf-player-btns').attr('class', '');
	});
};

function armWallpapers()
{
	$('#tab-iphone').click(function()
	{
		$('#wallpapers').addClass('iphone').removeClass('ipad');
		return false;
	});

	$('#tab-ipad').click(function()
	{
		$('#wallpapers').removeClass('iphone').addClass('ipad');
		return false;
	});

	if (navigator.userAgent)
	{
		if (m = navigator.userAgent.match(/(ipad)/i))
		{
			$('#wallpapers').removeClass('iphone').addClass('ipad');
		}
	};
};

function armTrailer()
{
	$('#play-trailer').click(function()
	{
		insertYouTubePlayer();
		return false;
	});
	
	$('#curtain').click(function()
	{
		pauseYouTubePlayer();
	});
};

var hasFlash = false;
swfobject.registerObject('nsf-player', '10.0.0', 'expressInstall.swf', function(e)
{
	hasFlash = e.success;
	$('html').attr('class', e.success?'has-flash':'no-flash');
});

var track = 0;
var tracks = 12;
$(function()
{
	switch($('body').attr('id'))
	{
		case 'page-home':
			armTrailer();
			armWallpapers();
		break;
		case 'page-soundtrack':
			if (hasFlash) insertSoundTestPlayer();
		break;
	}
});
