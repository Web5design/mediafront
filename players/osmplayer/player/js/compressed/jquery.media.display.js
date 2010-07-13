/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com 
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{volume:80,autostart:false,streamer:"",embedWidth:450,embedHeight:337,wmode:"transparent",forceOverflow:false});jQuery.fn.mediadisplay=function(b){if(this.length===0){return null;}return new (function(d,c){c=jQuery.media.utils.getSettings(c);this.display=d;var e=this;this.volume=0;this.player=null;this.preview="";this.reflowInterval=null;this.updateInterval=null;this.progressInterval=null;this.playQueue=[];this.playerReady=false;this.loaded=false;this.mediaFile=null;this.width=0;this.height=0;if(c.forceOverflow){this.display.parents().css("overflow","visible");}this.setSize=function(g,f){this.width=g?g:this.width;this.height=f?f:this.height;this.display.css({height:this.height+"px",width:this.width+"px"});if(this.playerReady&&this.width&&this.height){this.player.player.width=this.width;this.player.player.height=this.height;this.player.setSize(g,this.height);}};this.reset=function(){this.loaded=false;clearInterval(this.progressInterval);clearInterval(this.updateInterval);clearTimeout(this.reflowInterval);this.playQueue.length=0;this.playQueue=[];this.playerReady=false;this.mediaFile=null;};this.resetContent=function(){this.display.empty();this.display.append(this.template);};this.addToQueue=function(f){if(f){if(f[0]){f=this.getPlayableMedia(f);}this.playQueue.push(f);}};this.getPlayableMedia=function(j){var h=null;var f=j.length;while(f--){var g=new jQuery.media.file(j[f],c);if(!h||(g.weight<h.weight)){h=g;}}return h;};this.loadFiles=function(f){if(f){this.playQueue.length=0;this.playQueue=[];this.addToQueue(f.intro);this.addToQueue(f.commercial);this.addToQueue(f.prereel);this.addToQueue(f.media);this.addToQueue(f.postreel);}return(this.playQueue.length>0);};this.playNext=function(){if(this.playQueue.length>0){this.loadMedia(this.playQueue.shift());}};this.loadMedia=function(f){if(f){f=new jQuery.media.file(f,c);this.stopMedia();if(!this.mediaFile||(this.mediaFile.player!=f.player)){this.player=null;this.playerReady=false;if(f.player){this.player=this.display["media"+f.player](c,function(g){e.onMediaUpdate(g);});}if(this.player){this.player.createMedia(f,this.preview);this.startReflow();}}else{if(this.player){this.player.loadMedia(f);}}this.mediaFile=f;this.onMediaUpdate({type:"initialize"});}};this.onMediaUpdate=function(g){switch(g.type){case"playerready":this.playerReady=true;clearTimeout(this.reflowInterval);this.player.setVolume(0);this.startProgress();break;case"buffering":this.startProgress();break;case"stopped":clearInterval(this.progressInterval);clearInterval(this.updateInterval);break;case"paused":clearInterval(this.updateInterval);break;case"playing":this.startUpdate();break;case"progress":var f=this.getPercentLoaded();jQuery.extend(g,{percentLoaded:f});if(f>=1){clearInterval(this.progressInterval);}break;case"update":case"meta":jQuery.extend(g,{currentTime:this.player.getCurrentTime(),totalTime:this.getDuration(),volume:this.player.getVolume(),quality:this.getQuality()});break;case"complete":this.playNext();break;}if(g.type=="playing"&&!this.loaded){this.loaded=true;this.player.setVolume((c.volume/100));if(!c.autostart){this.player.pauseMedia();c.autostart=true;}else{this.display.trigger("mediaupdate",g);}}else{this.display.trigger("mediaupdate",g);}};this.reflowPlayer=function(){var f={marginLeft:parseInt(this.display.css("marginLeft"),10),height:this.display.css("height")};var g=(f.marginLeft>=0);this.display.css({marginLeft:(g?(f.marginLeft+1):0),height:(g?f.height:0)});setTimeout(function(){e.display.css(f);},1);};this.startReflow=function(){clearTimeout(this.reflowInterval);this.reflowInterval=setTimeout(function(){e.reflowPlayer();},2000);};this.startProgress=function(){if(this.playerReady){clearInterval(this.progressInterval);this.progressInterval=setInterval(function(){e.onMediaUpdate({type:"progress"});},500);}};this.startUpdate=function(){if(this.playerReady){clearInterval(this.updateInterval);this.updateInterval=setInterval(function(){if(e.playerReady){e.onMediaUpdate({type:"update"});}},1000);}};this.stopMedia=function(){this.loaded=false;clearInterval(this.progressInterval);clearInterval(this.updateInterval);clearTimeout(this.reflowInterval);if(this.playerReady){this.player.stopMedia();}};this.mute=function(f){if(f){this.volume=this.player.getVolume();this.player.setVolume(0);}else{this.player.setVolume(this.volume);}};this.getPercentLoaded=function(){var g=this.player.getBytesLoaded();var f=this.mediaFile.bytesTotal?this.mediaFile.bytesTotal:this.player.getBytesTotal();return f?(g/f):0;};this.showControls=function(f){if(this.playerReady){this.player.showControls(f);}};this.hasControls=function(){if(this.player){return this.player.hasControls();}return false;};this.getDuration=function(){if(!this.mediaFile.duration){this.mediaFile.duration=this.player.getDuration();}return this.mediaFile.duration;};this.getQuality=function(){if(!this.mediaFile.quality){this.mediaFile.quality=this.player.getQuality();}return this.mediaFile.quality;};this.setSize(this.display.width(),this.display.height());})(this,b);};})(jQuery);