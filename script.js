$(function()
{
    var playerData = $("#player-data"), bgImage = $('#bg-image'), bgImageUrl, songName = $('#song-name'), artistName = $('#artist-name'), songImage = $('#img-card'), sArea = $('#s-area'), seekBar = $('#seek-bar'), playerTime = $('#player-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"),  i = playPauseButton.find('i'), tProgress = $('#current-time'), sTime = $('#song-length'), seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false, songs = ['Stay a Little Longer','Lost Without You','Something In Common','Hear Me','Fire Within Me','Women Like Me','Ecstasy'], artistNames = ['Anushqa Shahaney','Anushqa Shahaney','Anushqa Shahaney','Anushqa Shahaney','Anushqa Shahaney','Anushqa Shahaney','Anushqa Shahaney'], songArtworks = ['1','2','3','4','5','6','7'], songUrl = ['./songs/01-StayALittleLonger.mp3','./songs/02-LostWithoutYou.mp3','./songs/03-SomethingInCommon.mp3','./songs/04-HearMe.mp3','./songs/05-FireWithinMe.mp3','./songs/06-WomanLikeMe.mp3','./songs/07-Ecstasy.mp3'], playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;

    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused)
            {
                playerData.addClass('active');
                songImage.addClass('active');
                checkBuffering();
                i.attr('class','fas fa-pause');
                audio.play();
            }
            else
            {
                playerData.removeClass('active');
                songImage.removeClass('active');
                clearInterval(buffInterval);
                songImage.removeClass('buffering');
                i.attr('class','fas fa-play');
                audio.pause();
            }
        },300);
    }

    	
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            playerTime.addClass('active');
        }

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            sTime.text('00:00');
        else
		    sTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            playerTime.removeClass('active');
        else
            playerTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','fa fa-play');
			seekBar.width(0);
            tProgress.text('00:00');
            songImage.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
            {    
                songImage.addClass('buffering');
            }
            else
            {
                songImage.removeClass('buffering');
            }
            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < songArtworks.length) )
        {
            if( flag == 0 )
                i.attr('class','fa fa-play');
            else
            {
                songImage.removeClass('buffering');
                i.attr('class','fa fa-pause');
            }

            seekBar.width(0);
            playerTime.removeClass('active');
            tProgress.text('00:00');
            sTime.text('00:00');

            currSong = songs[currIndex];
            currArtistName = artistNames[currIndex];
            currArtwork = songArtworks[currIndex];
            audio.src = songUrl[currIndex];
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerData.addClass('active');
                songImage.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            songName.text(currSong);
            artistName.text(currArtistName);
            songImage.find('img.active').removeClass('active');
            $('#'+currArtwork).addClass('active');
            
            bgImageUrl = $('#'+currArtwork).attr('src');

            bgImage.css({'background-image':'url('+bgImageUrl+')'});
        }
        else
        {
            if( flag == 0 || flag == 1 )
            {   
                --currIndex;
            }
            else
            {
                ++currIndex;
            }
        }
    }

    function startPlayer()
	{	
        audio = new Audio();

		selectTrack(0);
		
		audio.loop = false;
		
		playPauseButton.on('click',playPause);
		
		sArea.mousemove(function(event){ showHover(event); });
		
        sArea.mouseout(hideHover);
        
        sArea.on('click',playFromClickedPos);
		
        $(audio).on('timeupdate',updateCurrTime);

        playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        playNextTrackButton.on('click',function(){ selectTrack(1);});
	}
    
	startPlayer();
});
