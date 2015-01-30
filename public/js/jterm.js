/*******************************************************************************
 *
 * Term GUI
 *
 ******************************************************************************/

var conf_term_x=0;
var conf_term_y=0;
var conf_kbd_offset=0;
var termImgPath='/';
var termDiv='termDiv';
var termBgColor='#181818';
var termFrameColor='#555555';
var termPageColor='#222222';
var conf_repeat_delay1=320;
var conf_repeat_delay2=170;

var termKbdDiv='termKbdDiv';
var termKbdBgColor='#222222';
var keycapspath='/';

var termSubDivs=false;
var termLayers=false;
var termDocNS4=null;
var termStringStart='';
var termStringEnd='';

var termKbdDocNS4=null;
var termKbdOn=false;
var keycapsShift=false;
var keycapsCpslk=false;
var keycapsShiftRef=new Array();
var keycapsCpslkRef=new Array();

var termSpecials=new Array();
termSpecials[0]='&nbsp;';
termSpecials[1]='$';
termSpecials[2]='&nbsp;';
termSpecials[3]='?';
termSpecials[4]='#';
termSpecials[32]='&nbsp;';
termSpecials[34]='&quot;';
termSpecials[38]='&amp;';
termSpecials[60]='&lt;';
termSpecials[62]='&gt;';
termSpecials[127]='&loz;';

var termStyles=new Array(1,2,4,8);
var termStyleOpen=new Array();
var termStyleClose=new Array();
termStyleOpen[1]='<SPAN CLASS="termReverse">';
termStyleClose[1]='<\/SPAN>';
termStyleOpen[2]='<U>';
termStyleClose[2]='<\/U>';
termStyleOpen[4]='<I>';
termStyleClose[4]='<\/I>';
termStyleOpen[8]='<STRIKE>';
termStyleClose[8]='<\/STRIKE>';


// buttons UI

var termImgNames=new Array('left_lo', 'left_hi', 'right_lo', 'right_hi', 'delete_lo', 'delete_hi', 'esc_lo', 'esc_hi', 'kbd_show_lo', 'kbd_show_hi', 'kbd_hide_lo', 'kbd_hide_hi');
var termImages=new Array();

function termImgPreload(path,imgnames) {
	for (var i=0; i<imgnames.length; i++) {
		var n=imgnames[i];
		termImages[n]=new Image();
		termImages[n].src=path+n+'.gif'
	}
}

if (document.images) termImgPreload(termImgPath,termImgNames);

function termSetImg(n,v) {
	if (document.images) {
		var img=(termLayers)? termDocNS4.images['term_'+n] : document.images['term_'+n];
		var stat=(v)? '_hi' : '_lo';
		img.src=termImages[n+stat].src
	}
}

// UI keyboard
// key maps (200=left shift, 202=right shift, 204=CpsLock)

var termKeyMap= [
	[96,49,50,51,52,53,54,55,56,57,48,45,61,8],
	[27,113,119,101,114,116,121,117,105,111,112,91,93,13],
	[204,97,115,100,102,103,104,106,107,108,59,39,35],
	[200,92,122,120,99,118,98,110,109,44,46,47,30,202],
	[32,28,31,29]
];
var termKeyMapShift=[
	[126,33,34,35,36,37,94,38,42,40,41,95,43,8],
	[27,81,87,69,82,84,89,85,73,79,80,123,125,13],
	[204,65,83,68,70,71,72,74,75,76,58,34,64],
	[200,124,90,88,67,86,66,78,77,60,62,63,30,202],
	[32,28,31,29]
];
var termKeyMapCpslk=[
	[96,49,50,51,52,53,54,55,56,57,48,45,61,8],
	[27,81,87,69,82,84,89,85,73,79,80,91,93,13],
	[204,65,83,68,70,71,72,74,75,76,59,39,35],
	[200,92,90,88,67,86,66,78,77,44,46,47,30,202],
	[32,28,31,29]
];
var termKeyWdth=[
	[35,35,35,35,35,35,35,35,35,35,35,35,35,69],
	[55,35,35,35,35,35,35,35,35,35,35,35,35,0],
	[65,35,35,35,35,35,35,35,35,35,35,35,35],
	[49,35,35,35,35,35,35,35,35,35,35,35,35,54],
	[252,35,35,35]
];

var keycapsImgNames=new Array(200,201,202,203,204,205);

function termKeyCaps(k) {
	if ((k<28) && (k>=32) && (repeatTimer)) clearTimeout(repeatTimer);
	if (k==204) {
		keycapsCpslk=(!keycapsCpslk);
		var cnr=(keycapsCpslk)? 205:204;
		termKbdSetImg(204,cnr)
	}
	else if ((k==200) || (k==202)) {
		keycapsShift=(!keycapsShift);
		var m=(keycapsShift)? 1:0;
		termKbdSetImg(200,200+m);
		termKbdSetImg(202,202+m)
	}
	else {
		var ch=0;
		if (keycapsShift) {
			ch=keycapsShiftRef[k]
			keycapsShift=false;
			termKbdSetImg(200,200);
			termKbdSetImg(202,202)
		}
		else if (keycapsCpslk) ch=keycapsCpslkRef[k]
		else ch=k;
		keyHandler({which:ch,jsuix_remapped:true})
	}
}

function termKbdSetImg(n,v) {
	if (document.images) {
		var img=(termLayers)? termKbdDocNS4.images['key'+n] : document.images['key'+n];
		img.src=termImages[v].src
	}
}


function termSetKbdButton(v) {
	if (document.images) {
		var img=(termLayers)? termDocNS4.images.term_kbd_show : document.images.term_kbd_show;
		var n=(termKbdOn)? 'kbd_hide' : 'kbd_show';
		var stat=(v)? '_hi' : '_lo';
		img.src=termImages[n+stat].src
	}
}

function termKbdShow() {
	if (termKbdOn) {
		setDivVisibility(termKbdDiv,0);
		termKbdOn=false;
		termSetKbdButton(0)
	}
	else {
		termImgPreload(keycapspath,keycapsImgNames);
		keycapsShift=false;
		keycapsCpslk=false;
		var s='<TABLE BORDER="0" CELLSPACING="0" CELLPADDING="0">\n';
		s+='<TR><TD WIDTH="7" BGCOLOR="'+termPageColor+'"><IMG SRC="'+keycapspath+'spacer.gif" WIDTH="7" HEIGHT="2"><\/TD>\n';
		s+='<TD BGCOLOR="'+termPageColor+'">'+termMakeKbd()+'</TD>\n';
		s+'<TD WIDTH="7" BGCOLOR="'+termPageColor+'"><IMG SRC="'+keycapspath+'spacer.gif" WIDTH="7" HEIGHT="2"><\/TD><\TR>\n';
		s+='<TR><TD HEIGHT="10" COLSPAN="3" BGCOLOR="'+termPageColor+'"><IMG SRC="'+keycapspath+'spacer.gif" WIDTH="2" HEIGHT="10"><\/TD><\/TR>\n';
		s+='<\/TABLE>';
		writeElement(termKbdDiv,s);
		setDivXY(termKbdDiv,conf_term_x,conf_term_y+conf_kbd_offset+conf_rows*conf_rowheigt);
		if (termLayers) termKbdDocNS4=document.layers[termKbdDiv].document;
		termKbdOn=true;
		setDivVisibility(termKbdDiv,1);
		termSetKbdButton(0)
	}
}

function termMakeKbd() {
	var s='<TABLE BORDER="0" CELLSPACING="0" CELLPADDING="0">\n';
	for (var i=0; i<termKeyMap.length; i++) {
		s+='<TR><TD NOWRAP HEIGHT="39" VALIGN="top" NOWRAP BGCOLOR="'+termKbdBgColor+'">';
		for (var k=0; k<termKeyMap[i].length; k++) {
			var kc=termKeyMap[i][k];
			keycapsShiftRef[kc]=termKeyMapShift[i][k];
			keycapsCpslkRef[kc]=termKeyMapCpslk[i][k];
			if (kc==13) {
				s+='<A HREF="javas'+'cript:termKeyCaps(13)" onfocus="if(this.blur)this.blur()"><IMG SRC="'+keycapspath+'13_1.gif" HSPACE="0" VSPACE="0" ALIGN="top" BORDER="0" WIDTH="47" HEIGHT="39"><\/A>';
				continue
			};
			if (kc==32) s+='<IMG SRC="'+keycapspath+'spacer.gif" WIDTH="139" HEIGHT="35" HSPACE="1" VSPACE="1" ALIGN="top">'
			else if (kc==28) {
				s+='<IMG SRC="'+keycapspath+'spacer.gif" WIDTH="23" HEIGHT="35" HSPACE="1" VSPACE="1" ALIGN="top">';
				s+='<A HREF="javasc'+'ript:cursorKbdLeft()" onfocus="if(this.blur)this.blur()" onmousedown="repeatSet(\'left\',1)" onmouseup="repeatClear()"><IMG SRC="'+keycapspath+kc+'.gif" NAME="key'+kc+'" HSPACE="1" VSPACE="1" ALIGN="top" BORDER="0" WIDTH="'+termKeyWdth[i][k]+'" HEIGHT="35"><\/A>';
				continue
			}
			else if (kc==29) {
				s+='<A HREF="javasc'+'ript:cursorKbdRight()" onfocus="if(this.blur)this.blur()" onmousedown="repeatSet(\'right\',1)" onmouseup="repeatClear()"><IMG SRC="'+keycapspath+kc+'.gif" NAME="key'+kc+'" HSPACE="1" VSPACE="1" ALIGN="top" BORDER="0" WIDTH="'+termKeyWdth[i][k]+'" HEIGHT="35"><\/A>';
				continue
			}
			else if (kc==8) {
				s+='<A HREF="javasc'+'ript:termKbdBackspace()" onfocus="if(this.blur)this.blur()" onmousedown="repeatSet(\'backspace\',1)" onmouseup="repeatClear()"><IMG SRC="'+keycapspath+kc+'.gif" NAME="key'+kc+'" HSPACE="1" VSPACE="1" ALIGN="top" BORDER="0" WIDTH="'+termKeyWdth[i][k]+'" HEIGHT="35"><\/A>';
				continue
			}
			s+='<A HREF="javas'+'cript:termKeyCaps('+kc+')" onfocus="if(this.blur)this.blur()"><IMG SRC="'+keycapspath+kc+'.gif" NAME="key'+kc+'" HSPACE="1" VSPACE="1" ALIGN="top" BORDER="0" WIDTH="'+termKeyWdth[i][k]+'" HEIGHT="35"><\/A>';
			if (kc==35) s+='<A HREF="javas'+'cript:termKeyCaps(13)" onfocus="if(this.blur)this.blur()"><IMG SRC="'+keycapspath+'13_2.gif" HSPACE="0" VSPACE="0" ALIGN="top" BORDER="0" WIDTH="37" HEIGHT="36"><\/A>';
		};
		s+='<\/TD><\/TR>\n';
	};
	s+='<\/TABLE>';
	return s
}


// term UI

function termHide() {
	if (repeatTimer) clearTimeout(repeatTimer);
	if (termKbdOn) termKbdShow();
	setDivVisibility(termDiv,0)
}

function makeTerm() {
	window.status='Building terminal ...';
	termLayers=(document.layers)? true:false;
	termSubDivs=(navigator.userAgent.indexOf('Gecko')<0);
	var s='';
	s+='<TABLE BORDER="0" CELLSPACING="0" CELLPADDING="1">\n';
	s+='<TR><TD BGCOLOR="'+termFrameColor+'" COLSPAN="2"><TABLE BORDER="0" CELLSPACING="0" CELLPADDING="2"><TR><TD  BGCOLOR="'+termBgColor+'"><TABLE BORDER="0" CELLSPACING="0" CELLPADDING="0">\n';
	var rstr='';
	for (var c=0; c<conf_cols; c++) rstr+='&nbsp;';
	for (var r=0; r<conf_rows; r++) {
		var id=((termLayers) || (termSubDivs))? '' : ' ID="term_'+r+'"';
		s+='<TR><TD NOWRAP HEIGHT="'+conf_rowheigt+'"'+id+' CLASS="term">'+rstr+'<\/TD><\/TR>\n';
	};
	s+='<\/TABLE><\/TD><\/TR>\n';
	s+='<\/TABLE><\/TD><\/TR>\n';

	// Hide the Keyboard option for now
	// s+='<TD VALIGN="middle" BGCOLOR="'+termPageColor+'"><TABLE BORDER="0" CELLSPACING="0" CELLPADDING="1"><TR>\n';
	// s+='<TD><A HREF="javasc'+'ript:termKbdShow()" onmouseover="termSetKbdButton(1); window.status=\'show/hide full graphic keyboard\'; return true" onmouseout="termSetKbdButton(0); window.status=\'\'; return true" onfocus="if(this.blur)this.blur()"><IMG SRC="'+termImgPath+'kbd_show_lo.gif" NAME="term_kbd_show" WIDTH="78" HEIGHT="19" BORDER="0" HSPACE="5" ALT="show/hide keyboard"><\/A><\/TD><\/TR><\/TABLE><\/TD>\n';
	// s+='<TR>\n<TD ALIGN="right"><TABLE BORDER="0" CELLSPACING="0" CELLPADDING="1"><TR>\n';
	// s+='<TD><A HREF="javasc'+'ript:cursorKbdLeft()" onmouseover="termSetImg(\'left\',1); window.status=\'left\'; return true" onmouseout="termSetImg(\'left\',0); window.status=\'\'; return true" onfocus="if(this.blur)this.blur()" TITLE="cursor left" onmousedown="repeatSet(\'left\',1)" onmouseup="repeatClear()"><IMG SRC="'+termImgPath+'left_lo.gif" NAME="term_left" WIDTH="23" HEIGHT="23" ALT="cursor left" BORDER="0"><\/A><\/TD>\n';
	// s+='<TD><A HREF="javasc'+'ript:cursorKbdRight()" onmouseover="termSetImg(\'right\',1); window.status=\'right\'; return true" onmouseout="termSetImg(\'right\',0); window.status=\'\'; return true" onfocus="if(this.blur)this.blur()" TITLE="cursor right" onmousedown="repeatSet(\'right\',1)" onmouseup="repeatClear()"><IMG SRC="'+termImgPath+'right_lo.gif" NAME="term_right" WIDTH="23" HEIGHT="23" ALT="cursor right" BORDER="0"><\/A><\/TD>\n';
	// s+='<TD><A HREF="javasc'+'ript:termKbdBackspace()" onmouseover="termSetImg(\'delete\',1); window.status=\'backspace\'; return true" onmouseout="termSetImg(\'delete\',0); window.status=\'\'; return true" onfocus="if(this.blur)this.blur()" TITLE="backspace" onmousedown="repeatSet(\'backspace\',1)" onmouseup="repeatClear()"><IMG SRC="'+termImgPath+'delete_lo.gif" NAME="term_delete" WIDTH="23" HEIGHT="23" ALT="backspace" BORDER="0"><\/A><\/TD>\n';
	// s+='<TD><A HREF="javasc'+'ript:termKbdEsc()" onmouseover="termSetImg(\'esc\',1); window.status=\'esc\'; return true" onmouseout="termSetImg(\'esc\',0); window.status=\'\'; return true" onfocus="if(this.blur)this.blur()" TITLE="esc"><IMG SRC="'+termImgPath+'esc_lo.gif" NAME="term_esc" WIDTH="23" HEIGHT="23" ALT="esc" BORDER="0"><\/A><\/TD>\n';
	// s+='<\/TR><\/TABLE><\/TD><\/TR>\n';

	s+='<\/TABLE>\n';
	if (termLayers) {
		for (var r=0; r<conf_rows; r++) {
			s+='<LAYER NAME="term_'+r+'" TOP="'+(3+r*conf_rowheigt)+'" LEFT="3" CLASS="term"><\/LAYER>\n'
		};
		termDocNS4=document.layers[termDiv].document;
		termStringStart='<TABLE BORDER="0" CELLSPACING="0" CELLPADDING="0"><TR><TD NOWRAP HEIGHT="'+conf_rowheigt+'" CLASS="term">';
		termStringEnd='<\/TD><\/TR><\/TABLE>';
	}
	else if (termSubDivs) {
		for (var r=0; r<conf_rows; r++) {
			s+='<DIV ID="term_'+r+'" STYLE="position:absolute; top:'+(3+r*conf_rowheigt)+'px; left: 3px;" CLASS="term"><\/DIV>\n'
		};
		termStringStart='<TABLE BORDER="0" CELLSPACING="0" CELLPADDING="0"><TR><TD NOWRAP HEIGHT="'+conf_rowheigt+'" CLASS="term">';
		termStringEnd='<\/TD><\/TR><\/TABLE>';
	};
	writeElement(termDiv,s);
	setDivXY(termDiv,conf_term_x,conf_term_y);
	setDivVisibility(termDiv,1);
	window.status=''
}

function termDisplay(r) {
	var s=termStringStart;
	var curStyle=0;
	for (var i=0; i<conf_cols; i++) {
		var c=term[r][i];
		var cs=termStyle[r][i];
		if (cs!=curStyle) {
			if (curStyle) {
				for (var k=termStyles.length-1; k>=0; k--) {
					var st=termStyles[k];
					if (curStyle&st) s+=termStyleClose[st];
				}
			};
			curStyle=cs;
			for (var k=0; k<termStyles.length; k++) {
				var st=termStyles[k];
				if (curStyle&st) s+=termStyleOpen[st];
			}
		};
		s+= (termSpecials[c])? termSpecials[c] : String.fromCharCode(c);
	};
	if (curStyle>0) {
		for (var k=termStyles.length-1; k>=0; k--) {
			var st=termStyles[k];
			if (curStyle&st) s+=termStyleClose[st];
		}
	};
	s+=termStringEnd;
	writeElement('term_'+r,s,termDocNS4)
}

function termGuiReady() {
	ready=true;
	if (termGuiElementReady(termDiv, self.document)) {
		for (var r=0; r<conf_rows; r++) {
			if (termGuiElementReady('term_'+r,termDocNS4)==false) {
				ready=false;
				break
			}
		}
	}
	else ready=false;
	return ready
}


function cursorKbdLeft() {
	keyHandler({which:28})
}

function cursorKbdRight() {
	keyHandler({which:29})
}

function termKbdBackspace() {
	keyHandler({which:8})
}

function termKbdEsc() {
	keyHandler({which:27})
}

function termKbdClear() {
	if ((!cnslLock) && (!cnslRawMode)) cnslReset();
}

// UI-button repeat

function repeatSet(cmd,on) {
	if (repeatTimer) clearTimeout(repeatTimer);
	repeatTimer=setTimeout('repeatDo("'+cmd+'")',conf_repeat_delay1);
}

function repeatClear() {
	if (repeatTimer) clearTimeout(repeatTimer);
}

function repeatDo(cmd) {
	if (repeatTimer) clearTimeout(repeatTimer);
	if (cmd=='left') cursorKbdLeft()
	else if (cmd=='right') cursorKbdRight()
	else if (cmd=='backspace') termKbdBackspace();
	repeatTimer=setTimeout('repeatDo("'+cmd+'")',conf_repeat_delay2);
}


// basic dynamics

function writeElement(e,t,d) {
	if (document.layers) {
		var doc=(d)? d : self.document;
		doc.layers[e].document.open();
		doc.layers[e].document.write(t);
		doc.layers[e].document.close()
	}
	else if (document.getElementById) {
		var obj=document.getElementById(e);
		obj.innerHTML=t
	}
	else if (document.all) {
		document.all[e].innerHTML=t
	}
}

function setDivXY(d,x,y) {
	if (document.layers) {
		document.layers[d].moveTo(x,y)
	}
	else if (document.getElementById) {
		var obj=document.getElementById(d);
		obj.style.left=x+'px';
		obj.style.top=y+'px'
	}
	else if (document.all) {
		document.all[d].style.left=x+'px';
		document.all[d].style.top=y+'px'
	}
}

function setDivVisibility(d,v) {
	if (document.layers) {
		document.layers[d].visibility= (v)? 'show':'hide';
	}
	else if (document.getElementById) {
		var obj=document.getElementById(d);
		obj.style.visibility= (v)? 'visible':'hidden';
	}
	else if (document.all) {
		document.all[d].style.visibility= (v)? 'visible':'hidden';
	}
}

function termGuiElementReady(e,d) {
	if (document.layers) {
		var doc=(d)? d : self.document;
		return ((doc) && (doc.layers[e]))? true:false
	}
	else if (document.getElementById) {
		return (document.getElementById(e))? true:false
	}
	else if (document.all) {
		return (document.all[e])? true:false
	}
	else return false
}
//eof

/*******************************************************************************
 *
 * Basic Term OS / Kernel
 *
 ******************************************************************************/

var conf_cols=80;
var conf_rows=24;
var conf_rowheigt=15;
var conf_blink_delay=500;
var conf_defaultmail='webmaster'+'@'+'masswerk.at';
var conf_defaulturl='http://www.masswerk.at';
var os_version='JS/UIX 0.49';
var os_greeting=' '+os_version+' - The JavaScript virtual OS and terminal application for the web.';
var cnslMaxLines=conf_rows;
var t_r,t_c;
var term=new Array();
var termStyle=new Array();
var blinkBuffer=0;
var blinkTimer;
var repeatTimer;
var cnslBlinkmode=true;
var cnslBlockmode=true;
var cnslSmartmode=true;
var cnslLock=true;
var cnslInsert=false;
var cnslCharMode=false;
var cnslRawMode=false;
var cnslSB=null;
var manPages=new Array();
var usrPATH=new Array();
var usrALIAS=new Array();
var usrVAR=new Array();
var usrHIST=new Array();
var usrHistPtr=0;
var usrGroups=new Array();
var krnlPIDs=new Array();
var krnlCurPcs=null;
var krnlTtyBuffer='';
var krnlTtyChar=0;
var vfsRoot=null;
var krnlGuiCounter=0;
var krnlInodes=0;
var krnlDevNull=0;
var krnlUIDcnt=100;
var krnlUIDs=new Array();
var krnlGIDs=new Array();
var conf_rootpassskey='775FC451C0A70B9F';
var os_mdate=new Date(2003,10,05,12,0,0);

var jsuix_hasExceptions = false;

// constructor mods (ie4 fix)

var IE4_keyref;
var IE4_keycoderef;

function IE4_makeKeyref() {
	IE4_keyref= new Array();
	IE4_keycoderef= new Array();
	var hex= new Array('A','B','C','D','E','F');
	for (var i=0; i<=15; i++) {
		var high=(i<10)? i:hex[i-10];
		for (var k=0; k<=15; k++) {
			var low=(k<10)? k:hex[k-10];
			var cc=i*16+k;
			if (cc>=32) {
				var cs=unescape("%"+high+low);
				IE4_keyref[cc]=cs;
				IE4_keycoderef[cs]=cc;
			}
		}
	}
}

function _ie4_strfrchr(cc) {
	return (cc!=null)? IE4_keyref[cc] : '';
}

function _ie4_strchcdat(n) {
	cs=this.charAt(n);
	return (IE4_keycoderef[cs])? IE4_keycoderef[cs] : 0;
}

if (!String.fromCharCode) {
	IE4_makeKeyref();
	String.fromCharCode=_ie4_strfrchr;
};
if (!String.prototype.charCodeAt) {
	if (!IE4_keycoderef) IE4_makeKeyref();
	String.prototype.charCodeAt=_ie4_strchcdat;
}

// constructors

function ManPage(n,content) {
	this.name=n;
	this.content=content;
	manPages[n]=this
}

function KrnlProcess(args) {
	this.pid=krnlPIDs.length;
	this.id='';
	this.stdin=null;
	this.stdout=null;
	this.stderr=null;
	this.er=null;
	this.cwd=null;
	this.args=args;
	this.status='';
	this.child=null;
	krnlPIDs[krnlPIDs.length]=this;
}

function VfsFile(k, lines) {
	this.mdate=new Date();
	this.kind=k;
	this.lines=(lines)? lines:[];
	this.inode=krnlInodes++;
	this.owner=0;
	this.group=0;
	this.mode=0;
	this.icnt=0
}

function _vffTouch() {
	this.mdate=new Date();
}

VfsFile.prototype.touch=_vffTouch;

function VfsFileHandle(fh) {
	var f=null;
	if ((fh) && (typeof fh == 'object')) f=fh;
	this.file=f;
	this.lp=0;
	this.cp=0;
}

function _vfhReadLine() {
	if ((this.lp<this.file.lines.length) && (this.cp>=this.file.lines[this.lp].length) && (this.file.lines[this.lp]!='')) {
		this.cp=0;
		this.lp++
	};
	if (this.lp<this.file.lines.length) {
		var l=this.file.lines[this.lp].length;
		if (this.cp>0) {
			var p=this.cp;
			this.cp=0;
			return [l-p,this.file.lines[this.lp++].substring(p)]
		}
		else {
			return [l,this.file.lines[this.lp++]]
		}
	}
	else {
		return [-1,'']
	}
}

function _vfhClose() {
	if ((this.file.kind=='d') || (this.file.kind=='l')) return;
	if ((this.file.lines.length>0) && (this.file.lines[this.file.lines.length-1]=='')) {
		this.file.lines.length--
	};
	this.rewind()
}

function _vfhPutLine(t) {
	if (this.file.inode==krnlDevNull) return;
	var cl=Math.max(this.file.lines.length-1,0);
	if (this.file.lines[cl]) {
		this.file.lines[cl]+=t
	}
	else {
		this.file.lines[cl]=t;
	};
	this.file.lines[++cl]='';
	this.lp=cl;
	this.cp=0;
	this.file.touch()
}

function _vfhPutNewLine(t) {
	if (this.file.inode==krnlDevNull) return;
	this.lp=this.file.lines.length;
	this.file.lines[this.lp]=t;
	this.cp=this.file.lines[this.lp].length;
	this.file.touch()
}

function _vfhPutChunk(ch) {
	if (this.file.inode==krnlDevNull) return;
	var cl=Math.max(this.file.lines.length-1,0);
	if (this.file.lines[cl]) {
		this.file.lines[cl]+=t
	}
	else {
		this.file.lines[cl]=t;
	};
	this.lp=cl;
	this.cp=this.file.lines[cl].length;
	this.file.touch()
}

function _vfhGetChar() {
	if ((this.lp<this.file.lines.length) && (this.cp>=this.file.lines[this.lp].length) ) {
		cp=0;
		lp++
	};
	if (this.lp<this.file.lines.length) {
		return this.file.lines[this.lp].charAt(this.cp++)
	}
	else {
		return ''
	}
}

function _vfhUngetChar() {
	if (this.lp>=this.file.lines.length) {
		this.lp=this.file.lines.length-1;
		this.cp=Math.max(0,this.file.lines[this.lp].length-1)
	}
	else if (this.cp>0) {
		this.cp--
	}
	else {
		if (this.lp>0) {
			this.lp--;
			this.cp=Math.max(0,this.file.lines[this.lp].length-1)
		}
		else {
			this.cp=0;
			this.lp=0
		}
	}
}

function _vfhRewind() {
	this.cp=0;
	this.lp=0;
}

VfsFileHandle.prototype.readLine=_vfhReadLine;
VfsFileHandle.prototype.close=_vfhClose;
VfsFileHandle.prototype.putLine=_vfhPutLine;
VfsFileHandle.prototype.putNewLine=_vfhPutNewLine;
VfsFileHandle.prototype.putChunk=_vfhPutChunk;
VfsFileHandle.prototype.getChar=_vfhGetChar;
VfsFileHandle.prototype.ungetChar=_vfhUngetChar;
VfsFileHandle.prototype.rewind=_vfhRewind;


// os boot

function krnlInit() {
	// wait for gui
	if (termGuiReady()) {
		krnlGuiCounter=0;
		cnslMaxLines=conf_rows;
		cnslInsert=false;
		cnslCharMode=false;
		t_r=0;
		t_c=0;
		cnslClear();
		cnslBlinkmode=true;
		cnslBlockmode=true;
		krnlPIDs=[];
		krnlCurPcs=new KrnlProcess(['init']);
		krnlCurPcs.id='init';
		krnlUIDs[0]='root';
		krnlGIDs[0]='system';
		krnlGIDs[1]='wheel';
		krnlGIDs[2]='users';
		var r_col=45;
		cnslType(os_version,2);
		cnslType('  starting up [init] ...'); newLine(); newLine();
		cnslType('  terminal (dhtml-gui) ready.'); newLine();
		cnslType('  bringing up the file-system ... ');
		vfsInit(); t_c=r_col; cnslType('ok'); newLine();
		cnslType('  re-entering file-system as root.'); newLine();
		cnslType('  building tree ... ');
		vfsTreeSetup(); t_c=r_col; cnslType('ok'); newLine();
		cnslType('  trying for RC-file ... '); t_c=r_col-3;
		if (self.jsuixRC) {
			cnslType('found'); newLine();
			if ((self.jsuixRX) && (self.jsuixRX())) {
				cnslType('  rc-profile looks good.'); newLine();
			}
			else {
				cnslType('# rc-profile seems to have syntactical problems,'); newLine();
				cnslType('# system may hang, trying further ...'); newLine()
			};
			cnslType('  initializing rc-profile ... ');
			jsuixRC(); t_c=r_col; cnslType('ok'); newLine();
		}
		else {
			cnslType('not found'); newLine();
		};
		cnslType('  re-entering tree for command-system ... ');
		commandInit(); t_c=r_col; cnslType('ok'); newLine();
		cnslType('  setting up system variables ... ');
		sysvarsInit(); t_c=r_col; cnslType('ok'); newLine();
		cnslType('  system up and stable.'); newLine();
		cnslType('  starting login-demon.');
		krnlLogin()
	}
	else {
		krnlGuiCounter++;
		if (krnlGuiCounter>18000) {
			if (confirm(os_version+':\nYour browser hasn\'t responded for more than 2 minutes.\nRetry?')) krnlGuiCounter=0
			else return;
		};
		window.setTimeout('krnlInit()',200)
	}
}

function krnlLogin(reenter) {
	usrUID=usrGID=0;
	if (reenter) {
		cnslClear();
		cnslType(os_version,2);
		newLine();newLine();
		cnslType('re-login to system or type "exit" for shut down.'); newLine();
		newLine();newLine();
		cnslType('    __________ '); newLine();
		cnslType('   / ____/ __ \\ '); newLine();
		cnslType('  / /   / / / / '); newLine();
		cnslType(' / /___/ /_/ / '); newLine();
		cnslType(' \\____/_____/ '); newLine();

	};
	krnlCurPcs=new KrnlProcess(['login']);
	krnlCurPcs.id='logind';
	cnslBlinkmode=true;
	krnlLoginDmn();
}

function krnlLoginDmn(user) {
	var dialogrow=17;
	var errmsg=' invalid user-name  ';
	if (krnlCurPcs.user) {
		if (krnlTtyChar>32) {
			krnlCurPcs.passwd+=String.fromCharCode(krnlTtyChar);
			krnlTtyChar=0;
			return
		}
		else if (krnlTtyChar==13) {
			cursorOff();
			if (krnlCrypt(krnlCurPcs.passwd)==conf_rootpassskey) {
				newLine();
				cnslType(' welcome '+user);
				krnlAddUser(krnlCurPcs.user);
				delete(krnlCurPcs.user);
				delete(krnlCurPcs.passwd);
				cnslRawMode=false;
				delete(krnlCurPcs.bin);
				delete(krnlCurPcs.retry);
				cnslCharMode=false;
				krnlCurPcs.id='ttyd'
				krnlCurPcs.args=['TTY'];
				krnlTTY(krnlCurPcs);
				return
			}
			else {
				term[dialogrow]=cnslGetRowArrray(conf_cols,0);
				cursorSet(dialogrow+1,0);
				cnslType(' access denied.');
				delete(krnlCurPcs.user);
				delete(krnlCurPcs.passwd);
				krnlTtyChar=0;
				cnslCharMode=false;
				krnlCurPcs.retry--
			}
		}
		else return

	}
	else if (user!=null) {
		cursorOff();
		for (var ofs=user.indexOf(' '); ofs>=0; ofs=user.indexOf(' ')) user=user.substring(0,ofs)+user.substring(ofs+1);
		var nameok=(user!='');
		for (var i=0; i<user.length; i++) {
			if (!krnlWordChar(user.charAt(i))) {
				nameok=false;
				break
			}
		};
		if (user=='exit') {
			termClose();
			return;
		};
		if (user=='root') {
			cnslCharMode=true;
			cursorSet(dialogrow+1,0);
			term[dialogrow+1]=cnslGetRowArrray(conf_cols,0);
			cnslType(' password: ');
			krnlCurPcs.user='root';
			krnlCurPcs.passwd='';
			cursorOn();
			cnslLock=false;
			return
		};
		if ((user.toLowerCase()=='root') || (user.toLowerCase()=='exit')) nameok=false;
		if (nameok) {
			if (user.length>8) user=user.substring(0,8);
			newLine();
			cnslType(' entering system with id '+user);
			if (usrVAR.USER!=user) {
				usrHIST.length=0;
				usrHistPtr=0
			};
			krnlAddUser(user);
			usrVAR.HOME='/home/'+user
			usrVAR.USER=user;
			cnslRawMode=false;
			delete(krnlCurPcs.bin);
			delete(krnlCurPcs.retry);
			krnlCurPcs.id='ttyd'
			krnlCurPcs.args=['TTY'];
			krnlTTY(krnlCurPcs);
			return
		}
		else {
			term[dialogrow]=cnslGetRowArrray(conf_cols,0);
			cursorSet(dialogrow+1,0);
			cnslType(errmsg);
			krnlCurPcs.retry--
		}
	}
	else {
		cursorSet(dialogrow-2,0);
		cnslType('  JS/UIX:Log-on - type user-name (e.g. "guest") and hit <return>.');
		krnlCurPcs.bin='krnlLoginDmn';
		krnlCurPcs.retry=3;
		cnslCharMode=false;
		cnslRawMode=true;
		enableKeyboard()
	};
	cursorSet(dialogrow,0);
	cnslType(' login:');
	cnslChar(2);
	if (krnlCurPcs.retry<=0) cnslType('guest');
	cursorOn();
	cnslLock=false
}

function krnlAddUser(user) {
	var lsh='/bin/sh';
	usrVAR.UID=0; usrVAR.GID=0;
	var etc=vfsGetFile('/etc');
	if ((typeof etc=='object') && (etc.kind!='d')) {
		vfsUnlink('/etc');
		etc=0
	};
	if (etc<=0) etc=vfsCreate('/etc','d',01777);
	usrVAR.GID=1;
	var hdr=vfsGetFile('/home');
	if ((typeof hdr=='object') && (hdr.kind!='d')) {
		vfsUnlink('/home');
		hdr=0
	};
	if (hdr<=0) hdr=vfsCreate('/home','d',0777);
	var hdir='/home/'+user;
	var passwd=vfsGetFile('/etc/passwd');
	if (passwd<=0) {
		passwd=vfsCreate('/etc/passwd','f',0644);
		passwd.lines[0]='root:*:0:1:root:/root:'+lsh
	};
	var group=vfsGetFile('/etc/group');
	if (group<=0) {
		group=vfsCreate('/etc/group','f',0644);
		group.lines[0]='system:0:root';
		group.lines[1]='users:2:';
		group.lines[2]='wheel:1:root'
	};
	if (user=='root') {
		usrVAR.UID='0';
		usrVAR.GID='1';
		usrGroups[0]=1;
		usrGroups[1]=1;
		usrGroups[2]=1;
		usrVAR.USER=user;
		hdir=usrVAR.HOME='/root';
		var uhd=vfsGetFile(hdir);
		if ((typeof uhd=='object') && (uhd.kind!='d')) {
			vfsUnlink(hdir);
			uhd=0
		};
		if (uhd<=0) uhd=vfsCreate(hdir,'d',0700);
		var hstf=vfsGetFile(hdir+'/.history');
		if (hstf<=0) hstf=vfsCreate(hdir+'/.history','f',0600);
		usrHIST=hstf.lines;
		usrHistPtr=hstf.lines.length;
		return
	};
	var exists=false;
	for (var i=1; i<passwd.lines.length; i++) {
		if (passwd.lines[i].indexOf(user+':')==0) {
			exists=true;
			var up=passwd.lines[i].split(':');
			usrVAR.UID=up[2];
			break
		}
	};
	if (!exists) {
		krnlUIDcnt++;
		passwd.lines[passwd.lines.length]=user+':*:'+krnlUIDcnt+':2:'+user+':'+hdir+':'+lsh;
		passwd.touch()
	};
	usrGroups.length=0;
	var groups=new Array('wheel','users');
	var groupids=new Array(1,2);
	for (var i=0; i<groups.length; i++) {
		var gn=groups[i];
		exists=false;
		var gl=-1;
		for (var k=0; k<group.lines.length; k++) {
			if (group.lines[k].indexOf(gn+':')==0) {
				exists=true;
				gl=k;
				break;
			}
		};
		if (exists) {
			var ll=group.lines[gl].substring(gn.length+3);
			var gs=ll.split(',');
			var uexists=false;
			for (var j=0; j<gs.length; j++) {
				if (gs[j]==user) uexists=true;
			};
			if (!uexists) {
				if (ll) {
					gs[gs.length]=user;
					group.lines[gl]=gn+':'+groupids[i]+':'+gs.join();
				}
				else {
					group.lines[gl]=gn+':'+groupids[i]+':'+user
				};
				group.touch()
			}
		}
		else {
			group.lines[group.lines.length]=gn+':'+groupids[i]+':'+user;
			group.touch()
		}
	};
	usrVAR.HOME=hdir;
	var uhd=vfsGetFile(hdir);
	if ((typeof uhd=='object') && (uhd.kind!='d')) {
		vfsUnlink(hdir);
		uhd=0
	};
	if (uhd<=0) uhd=vfsCreate(hdir,'d',0750);
	uhd.owner=krnlUIDcnt;
	usrVAR.UID=''+krnlUIDcnt;
	krnlUIDs[krnlUIDcnt]=user;
	usrVAR.GID='2';
	usrGroups[1]=1;
	usrGroups[2]=1;
	var hstf=vfsGetFile(hdir+'/.history');
	if (hstf<=0) hstf=vfsCreate(hdir+'/.history','f',0600);
	usrHIST=hstf.lines;
	usrHistPtr=hstf.lines.length;
}


// crypt

var crptSalt= '0e7aff21';
var crptHexCode = new Array('0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F');
var crptKeyquence= new Array();

for (var i = 0; i<crptSalt.length; i+=2) {
	crptKeyquence[crptKeyquence.length]=parseInt(crptSalt.substring(i, i+2),16);
}

function krnlCrypt(x) {
	var enc='';
	var k=0;
	var last=0;
	for (var i=0; i<x.length; i++) {
		var s= (x.charCodeAt(i)+crptKeyquence[k++]+last) % 256;
		last=s;
		var h= Math.floor(s/16);
		var l= s-(h*16);
		enc+= crptHexCode[h]+crptHexCode[l];
		if (k==crptKeyquence.length) k=0;
	};
	return enc
}

// console

function cnslClearFrameBuffer() {
	for (var r=0; r<conf_rows; r++) {
		term[r]=cnslGetRowArrray(conf_cols,0);
		termStyle[r]=cnslGetRowArrray(conf_cols,0)
	}
}

function cnslGetRowArrray(l,v) {
	var a=new Array();
	for (var i=0; i<l; i++) a[i]=v;
	return a
}

function cnslType(text,style) {
	for (var i=0; i<text.length; i++) {
		var ch=text.charCodeAt(i);
		if ((ch<32) || (ch>255)) ch=94;
		term[t_r][t_c]=ch;
		termStyle[t_r][t_c]=(style)? style:0;
		var last_r=t_r;
		cnslIncCol();
		if (t_r!=last_r) termDisplay(last_r);
	};
	termDisplay(t_r)
}

function cnslWrite(text) {
	// term type with style markup (%+<style> | %-<style> | %n); <style> ::= p|r|u|i|s
	var chunks=text.split('%');
	var esc=(text.charAt(0)!='%');
	var style=0;
	for (var i=0; i<chunks.length; i++) {
		if (esc) {
			if (chunks[i].length>0) cnslType(chunks[i],style)
			else if (i>0) cnslType('%', style);
			esc=false
		}
		else {
			var func=chunks[i].charAt(0);
			if ((chunks[i].length==0) && (i>0)) {
				cnslType("%",style);
				esc=true
			}
			else if (func=='n') {
				newLine();
				if (chunks[i].length>1) cnslType(chunks[i].substring(1),style);
			}
			else if (func=='+') {
				var opt=chunks[i].charAt(1);
				opt=opt.toLowerCase();
				if (opt=='p') style=0
				else if (opt=='r') style|=1
				else if (opt=='u') style|=2
				else if (opt=='i') style|=4
				else if (opt=='s') style|=8;
				if (chunks[i].length>2) cnslType(chunks[i].substring(2),style);
			}
			else if (func=='-') {
				var opt=chunks[i].charAt(1);
				opt=opt.toLowerCase();
				if (opt=='p') style|=0
				else if (opt=='r') style&=~1
				else if (opt=='u') style&=~2
				else if (opt=='i') style&=~4
				else if (opt=='s') style&=~8;
				if (chunks[i].length>2) cnslType(chunks[i].substring(2),style);
			}
			else if ((chunks[i].length>1) && (chunks[i].charAt(0)=='C') && (chunks[i].charAt(1)=='S')) {
				cnslClear();
				if (chunks[i].length>3) cnslType(chunks[i].substring(3),style);
			}
			else {
				if (chunks[i].length>0) cnslType(chunks[i],style);
			}
		}
	}
}

// smart console suite for minimal scrolling

function cnslSmartWrite(text) {
	// term type with minimal scrolling (via krnlFOut only)
	var chunks=text.split('%');
	var esc=(text.charAt(0)!='%');
	var style=0;
	for (var i=0; i<chunks.length; i++) {
		if (esc) {
			if (chunks[i].length>0) cnslSmartType(chunks[i],style)
			else if (i>0) cnslSmartType('%', style);
			esc=false
		}
		else {
			var func=chunks[i].charAt(0);
			if ((chunks[i].length==0) && (i>0)) {
				cnslSmartType("%",style);
				esc=true
			}
			else if (func=='n') {
				cnslSBNewLine();
				if (chunks[i].length>1) cnslSmartType(chunks[i].substring(1),style);
			}
			else if (func=='+') {
				var opt=chunks[i].charAt(1);
				opt=opt.toLowerCase();
				if (opt=='p') style=0
				else if (opt=='r') style|=1
				else if (opt=='u') style|=2
				else if (opt=='i') style|=4
				else if (opt=='s') style|=8;
				if (chunks[i].length>2) cnslSmartType(chunks[i].substring(2),style);
			}
			else if (func=='-') {
				var opt=chunks[i].charAt(1);
				opt=opt.toLowerCase();
				if (opt=='p') style|=0
				else if (opt=='r') style&=~1
				else if (opt=='u') style&=~2
				else if (opt=='i') style&=~4
				else if (opt=='s') style&=~8;
				if (chunks[i].length>2) cnslSmartType(chunks[i].substring(2),style);
			}
			else if ((chunks[i].length>1) && (chunks[i].charAt(0)=='C') && (chunks[i].charAt(1)=='S')) {
				cnslClear();
				cnslSBInit();
				if (chunks[i].length>3) cnslSmartType(chunks[i].substring(3),style);
			}
			else {
				if (chunks[i].length>0) cnslSmartType(chunks[i],style);
			}
		}
	}
}

function cnslSmartType(text,style) {
	// type to scroll buffer cnslSB (via krnlFOut only)
	for (var i=0; i<text.length; i++) {
		var ch=text.charCodeAt(i);
		if ((ch<32) || (ch>255)) ch=94;
		cnslSB.lines[cnslSB.r][cnslSB.c]=ch;
		cnslSB.styles[cnslSB.r][cnslSB.c]=(style)? style:0;
		cnslSB.c++;
		if (cnslSB.c>=conf_cols) cnslSBNewLine();
	}
}

function cnslSBNewLine() {
	cnslSB.r++;
	cnslSB.c=0;
	cnslSB.lines[cnslSB.r]=cnslGetRowArrray(conf_cols,0);
	cnslSB.styles[cnslSB.r]=cnslGetRowArrray(conf_cols,0)
}

function cnslSBInit() {
	cnslSB=new Object();
	cnslSB.lines=new Array();
	cnslSB.styles=new Array();
	cnslSB.r=0;
	cnslSB.c=t_c;
	cnslSB.lines[0]=cnslGetRowArrray(conf_cols,0);
	cnslSB.styles[0]=cnslGetRowArrray(conf_cols,0);
	for (var i=0; i<t_c; i++) {
		cnslSB.lines[0][i]=term[t_r][i];
		cnslSB.styles[0][i]=termStyle[t_r][i];
	}
}

function cnslSBOut() {
	var buflen=cnslSB.lines.length;
	if (t_r+buflen<cnslMaxLines) {
		for (var i=0; i<buflen; i++) {
			var r=t_r+i;
			term[r]=cnslSB.lines[i];
			termStyle[r]=cnslSB.styles[i];
			termDisplay(r)
		};
		t_r+=cnslSB.r;
		t_c=cnslSB.c
	}
	else if (buflen>=cnslMaxLines) {
		var ofs=buflen-cnslMaxLines;
		for (var i=0; i<cnslMaxLines; i++) {
			var r=ofs+i;
			term[i]=cnslSB.lines[r];
			termStyle[i]=cnslSB.styles[r];
			termDisplay(i)
		};
		t_r=cnslMaxLines-1;
		t_c=cnslSB.c
	}
	else {
		var dr=cnslMaxLines-buflen;
		var ofs=t_r-dr;
		for (var i=0; i<dr; i++) {
			var r=ofs+i;
			for (var c=0; c<conf_cols; c++) {
				term[i][c]=term[r][c];
				termStyle[i][c]=termStyle[r][c];
			};
			termDisplay(i)
		};
		for (var i=0; i<buflen; i++) {
			var r=dr+i;
			term[r]=cnslSB.lines[i];
			termStyle[r]=cnslSB.styles[i];
			termDisplay(r)
		};
		t_r=cnslMaxLines-1;
		t_c=cnslSB.c
	};
	cnslSB=null
}

// text related

function txtStripStyles(text) {
	// strip markup from text
	var chunks=text.split('%');
	var esc=(text.charAt(0)!='%');
	var rs='';
	for (var i=0; i<chunks.length; i++) {
		if (esc) {
			if (chunks[i].length>0) rs+=chunks[i];
			else if (i>0) rs+='%';
			esc=false
		}
		else {
			var func=chunks[i].charAt(0);
			if ((chunks[i].length==0) && (i>0)) {
				rs+='%';
				esc=true
			}
			else if (func=='n') {
				rs+='\n';
				if (chunks[i].length>1) rs+=chunks[i].substring(1);
			}
			else if ((func=='+') || (func=='-')) {
				if (chunks[i].length>2) rs+=chunks[i].substring(2);
			}
			else {
				if (chunks[i].length>0) rs+=chunks[i];
			}
		}
	};
	return rs
}

function txtNormalize(n,m) {
	var s=''+n;
	while (s.length<m) s='0'+s;
	return s
}

function txtFillLeft(t,n) {
	if (typeof t != 'string') t=''+t;
	while (t.length<n) t=' '+t;
	return t
}

function txtCenter(t,l) {
	var s='';
	for (var i=t.length; i<l; i+=2) s+=' ';
	return s+t
}

function txtStringReplace(s1,s2,t) {
	var l1=s1.length;
	var l2=s2.length;
	var ofs=t.indexOf(s1);
	while (ofs>=0) {
		t=t.substring(0,ofs)+s2+t.substring(ofs+l1);
		ofs=t.indexOf(s1,ofs+l2)
	};
	return t
}

// basic console output

function cnslTypeAt(r,c,text,style) {
	var tr1=t_r;
	var tc1=t_c;
	cursorSet(r,c);
	for (var i=0; i<text.length; i++) {
		var ch=text.charCodeAt(i);
		if ((ch<32) || (ch>255)) ch=94;
		term[t_r][t_c]=ch;
		termStyle[t_r][t_c]=(style)? style:0;
		var last_r=t_r;
		cnslIncCol();
		if (t_r!=last_r) termDisplay(last_r);
	};
	termDisplay(t_r);
	t_r=tr1;
	t_c=tc1
}

function cnslChar(ch, style) {
	term[t_r][t_c]=ch;
	termStyle[t_r][t_c]=(style)? style:0;
	termDisplay(t_r);
	cnslIncCol()
}

function cnslSet(ch,r,c,style) {
	term[r][c]=ch;
	termStyle[t_r][t_c]=(style)? style:0;
	termDisplay(r);
}

function cnslIncCol() {
	t_c++;
	if (t_c>=conf_cols) {
		t_c=0;
		cnslIncRow();
	}
}

function cnslIncRow() {
	t_r++;
	if (t_r>=cnslMaxLines) {
		// scroll
		cnslScrollLines(0,cnslMaxLines);
		t_r=cnslMaxLines-1
	}
}

function cnslScrollLines(start, end) {
	window.status='Scrolling lines ...';
	start++;
	for (var ri=start; ri<end; ri++) {
		var rt=ri-1;
		term[rt]=term[ri];
		termStyle[rt]=termStyle[ri]
	};
	// clear last line
	var rt=end-1;
	term[rt]=cnslGetRowArrray(conf_cols,0);
	termStyle[rt]=cnslGetRowArrray(conf_cols,0);
	termDisplay(rt);
	for (var r=end-1; r>=start; r--) termDisplay(r-1);
	window.status='';
}

function newLine() {
	t_c=0;
	cnslIncRow();
}

function cnslClear() {
	window.status='Clearing display ...';
	cnslMaxLines=conf_rows;
	cnslInsert=false;
	for (var ri=0; ri<cnslMaxLines; ri++) {
		term[ri]=cnslGetRowArrray(conf_cols,0);
		termStyle[ri]=cnslGetRowArrray(conf_cols,0);
		termDisplay(ri)
	};
	t_r=0;
	t_c=0;
	window.status=''
}

function cursorSet(r,c) {
	t_r=r%conf_rows;
	t_c=c%conf_cols;
}

function cursorOn() {
	if (blinkTimer) clearTimeout(blinkTimer);
	blinkBuffer=termStyle[t_r][t_c];
	cursorBlink()
}

function cursorOff() {
	if (blinkTimer) clearTimeout(blinkTimer);
	termStyle[t_r][t_c]=blinkBuffer;
	termDisplay(t_r)
}

function cursorBlink() {
	if (blinkTimer) clearTimeout(blinkTimer);
	if (cnslBlockmode) {
		termStyle[t_r][t_c]=(termStyle[t_r][t_c]&1)? termStyle[t_r][t_c]&254:termStyle[t_r][t_c]|1;
	}
	else {
		termStyle[t_r][t_c]=(termStyle[t_r][t_c]&2)? termStyle[t_r][t_c]&253:termStyle[t_r][t_c]|2;
	};
	termDisplay(t_r);
	if (cnslBlinkmode) blinkTimer=setTimeout('cursorBlink()', conf_blink_delay)
}

function cursorLeft() {
	cursorOff();
	var r=t_r;
	var c=t_c;
	if (c>0) c--
	else if (r>0) {
		c=conf_cols-1;
		r--
	};
	if (term[r][c]>=32) {
		t_r=r;
		t_c=c
	}
	else {
		if (repeatTimer) clearTimeout(repeatTimer);
	}
	cnslInsert=true;
	cursorOn()
}

function cursorRight() {
	cursorOff();
	var r=t_r;
	var c=t_c;
	if (c<conf_cols-1) c++
	else if (r<cnslMaxLines-1) {
		c=0;
		r++
	};
	if (term[r][c]<32) {
		cnslInsert=false;
		if (repeatTimer) clearTimeout(repeatTimer);
	};
	if (term[t_r][t_c]>=32) {
		t_r=r;
		t_c=c
	};
	cursorOn()
}

function cnslBackspace() {
	cursorOff();
	var r=t_r;
	var c=t_c;
	if (c>0) c--
	else if (r>0) {
		c=conf_cols-1;
		r--
	};
	if (term[r][c]>=32) {
		cnslScrollLeft(r, c);
		t_r=r;
		t_c=c
	};
	cursorOn()
}

function cnslScrollLeft(r,c) {
	var rows=new Array();
	rows[0]=r;
	while (term[r][c]>=32) {
		var ri=r;
		var ci=c+1;
		if (ci==conf_cols) {
			ci=0;
			if (ri<cnslMaxLines-1) {
				ri++;
				rows[rows.length]=ri
			}
		};
		term[r][c]=term[ri][ci];
		termStyle[r][c]=termStyle[ri][ci];
		c++;
		if (c==conf_cols) {
			c=0;
			if (r<cnslMaxLines-1) {
				r++
			}
		}
	};
	if (term[r][c]!=0) term[r][c]=0;
	for (var i=0; i<rows.length; i++) termDisplay(rows[i]);
}

function cnslScrollRight(r,c) {
	var rows=new Array();
	rows[0]=r;
	var end=cnslGetLineEnd(r,c);
	var ri=end[0];
	var ci=end[1];
	if ((ci==conf_cols-1) && (ri==cnslMaxLines-1)) {
		cnslScrollLines(0,cnslMaxLines);
		t_r--;
		rows[0]--;
		ri--
	};
	while (term[ri][ci]>=32) {
		var rt=ri;
		var ct=ci+1;
		if (ct==conf_cols) {
			ct=0;
			rt++
		};
		term[rt][ct]=term[ri][ci];
		termStyle[rt][ct]=termStyle[ri][ci];
		if ((ri==r) && (ci==c)) break;
		ci--;
		if (ci<0) {
			ci=conf_cols-1;
			ri--;
			rows[rows.length]=ri
		}
	};
	for (var i=0; i<rows.length; i++) termDisplay(rows[i]);
}

function cnslReset() {
	if (cnslLock) return;
	if (repeatTimer) clearTimeout(repeatTimer);
	cursorOff();
	cnslLock=true;
	cnslClear();
	cnslPrompt();
	cursorOn()
}

function cnslPrompt() {
	cnslLock=true;
	var prompt='';
	if (usrVAR.PS) {
		var pv=shellSubstitute(usrVAR.PS);
		prompt=pv.join(' ');
	};
	if (!prompt) prompt=(usrVAR.USER)? '['+usrVAR.USER+']':'[]';
	cnslType(prompt);
	if (usrVAR.UID=='0') cnslChar(4)
	else cnslChar(1);
	cnslChar(2);
	cnslLock=false
}


function cnslGetLineEnd(r,c) {
	if (term[r][c]<32) {
		c--;
		if (c<0) {
			if (r>0) {
				r--;
				c=conf_cols-1
			}
			else {
				c=0
			}
		}
	};
	while (term[r][c]>=32) {
		var ri=r;
		var ci=c+1;
		if (ci==conf_cols) {
			ci=0;
			if (ri<cnslMaxLines-1) ri++;
		};
		if (term[ri][ci]<32) break;
		c++;
		if (c==conf_cols) {
			c=0;
			if (r<cnslMaxLines-1) {
				r++
			}
		}
	};
	return [r,c];
}

function cnslGetLine() {
	var end=cnslGetLineEnd(t_r,t_c);
	var r=end[0];
	var c=end[1];
	var input=new Array();
	while (term[r][c]>=32) {
		input[input.length]=String.fromCharCode(term[r][c]);
		if (c>0) c--
		else if (r>0) {
			c=conf_cols-1;
			r--
		}
		else break;
	};
	input.reverse();
	return input.join('')
}

function cnslClearLine() {
	var end=cnslGetLineEnd(t_r,t_c);
	var r=end[0];
	var c=end[1];
	var line='';
	while (term[r][c]>=32) {
		term[r][c]=0;
		if (c>0) {
			c--
		}
		else if (r>0) {
			termDisplay(r);
			c=conf_cols-1;
			r--
		}
		else break;
	};
	if (r!=end[0]) termDisplay(r);
	c++;
	cursorSet(r,c)
}

// vfs file system

function vfsGetPath(path,cwd) {
	while ((cwd) && (cwd.charAt(cwd.length-1)=='/')) cwd=cwd.substring(0,cwd.length-1);
	if (path) {
		if (path.charAt(0)!='/') path=cwd+'/'+path;
	}
	else path=cwd;
	var pa=path.split('/');
	var cwa=new Array();
	for (var i=0; i<pa.length; i++) {
		var f=pa[i];
		if (f=='') continue;
		if (f=='..') {
			if (cwa.length>0) cwa.length--;
		}
		else if (f=='~') { cwa.length=0; cwa[0]=usrVAR.HOME.substring(1) }
		else if (f!='.') cwa[cwa.length]=f;
	};
	return fp='/'+cwa.join('/')
}

function vfsGetDir(absPath) {
	var pa=absPath.split('/');
	var d=new Array();
	d[0]=vfsRoot;
	di=0;
	for (var i=1; i<pa.length; i++) {
		cd=d[di];
		var pd=pa[i];
		if ((!cd) || (cd.kind!='d')) {
			return 0;
		}
		else if (!vfsPermission(cd,1)) return -1
		else if ((pd=='.')  || (pd=='')) continue
		else if (pd=='..') {
			if (di>0) {
				di--;
				d.length--
			}
		}
		else if ((cd.lines[pd]) && (cd.lines[pd].kind=='d')) {
			di++;
			d[di]=cd.lines[pd]
		}
		else {
			return 0
		}
	};
	return d[di]
}

function vfsGetFile(absPath) {
	while (absPath.charAt(absPath.length-1)=='/') absPath=absPath.substring(0,absPath.length-1);
	var pa=absPath.split('/');
	var f=vfsRoot;
	for (var i=0; i<pa.length; i++) {
		if (pa[i]=='') continue
		else if (f.lines[pa[i]]) {
			if (vfsPermission(f,1)) f=f.lines[pa[i]]
			else return -1;
		}
		else return 0
	};
	return f
}

function vfsGetParent(absPath) {
	while (absPath.charAt(absPath.length-1)=='/') absPath=absPath.substring(0,absPath.length-1);
	if (absPath=='') return null;
	var pn=vfsDirname(absPath);
	return vfsGetDir(pn)
}

function vfsBasename(path) {
	if (path=='') return '';
	var fos=path.lastIndexOf('/');
	return (fos==path.length-1)? '': (fos>=0)? path.substring(fos+1): path;
}

function vfsDirname(path) {
	if (path=='') return '';
	var fos=path.lastIndexOf('/');
	return (fos==0)? '/' : (fos>0)? path.substring(0,fos): '';
}

function vfsOpen(absPath,m) {
	var f=vfsGetFile(absPath);
	if (f<=0) return f;
	if ((m) && (!vfsPermission(f,m))) return -2
	else if (f) return f
	else return 0;
}

function vfsFileCopy(sf,tf,append) {
	if (!append) tf.lines=[];
	for (var i=0; i<sf.lines.length; i++) tf.lines[tf.lines.length]=sf.lines[i];
}

function vfsCreate(absPath,kind,fmode,cdate) {
	var fn=vfsBasename(absPath);
	var pn=vfsDirname(absPath);
	if ((fn=='') || (fn=='.') || (fn=='..') || (fn=='~')) return 0;
	if ((fn) && (pn)) {
		var pd=vfsGetDir(pn);
		if (pd<=0) return pd
		else if (pd) {
			if ((pd.mode) && (!vfsPermission(pd,2))) return -1;
			//if (pd.lines[fn]) return -3;
			var f=(kind=='d')? new VfsFile('d',{}) :  new VfsFile(kind,[]);
			f.icnt=(kind=='d')? 2:1;
			if (cdate) f.mdate=cdate;
			if (fmode) f.mode=fmode;
			if (usrVAR.UID!=null) f.owner=usrVAR.UID;
			if (usrVAR.GID!=null) f.group=usrVAR.GID;
			pd.lines[fn]=f;
			pd.mdate=f.mdate;
			return f
		}
	};
	return 0
}

function vfsForceFile(absPath,kind,flines,fmode,cdate) {
	var f=vfsCreate(absPath,kind,fmode,cdate);
	if (typeof f=='object') f.lines=flines;
	return f
}

function vfsUnlink(absPath) {
	var fn=vfsBasename(absPath);
	var pn=vfsDirname(absPath);
	if ((fn=='') || (fn=='.') || (fn=='~') || (fn=='..')) return 0;
	if ((fn) && (pn)) {
		var pd=vfsGetDir(pn);
		if (pd<=0) return pd
		else if (pd) {
			if ((pd.mode) && (!vfsPermission(pd,2))) return -1;
			if (pd.lines[fn]) {
				if ((pd.mode&01000) && ((pd.owner!=usrVAR.UID) && (pd.lines[fn].owner!=usrVAR.UID))) return -1;
				delete(pd.lines[fn])
				pd.touch();
				return 1
			}
		}
	};
	return 0
}

function vfsMove(fn1,fn2) {
	var f1=vfsOpen(fn1,4);
	if (typeof f1=='object') {
		var d=vfsGetParent(fn2);
		if (typeof d=='object') {
			if ((vfsPermission(d,2)) && (vfsUnlink(fn1)>0)) {
				d.lines[vfsBasename(fn2)]=f1;
				d.touch();
				return 1
			}
			else return -1
		}
		else return d
	}
	else return f1
}

function vfsGetSize(f) {
	var n=0;
	if ((f) && (f.kind=='d')) {
		for (var i in f.lines) n++;
	}
	else if (f) {
		for (var i=0; i<f.lines.length; i++) n+=f.lines[i].length;
	};
	return n
}

function vfsGetMdate(f) {
	var fd=f.mdate;
	return (fd)? fd.getFullYear()+'/'+txtNormalize(fd.getMonth()+1,2)+'/'+txtNormalize(fd.getDate(),2)+' '+txtNormalize(fd.getHours(),2)+':'+txtNormalize(fd.getMinutes(),2)+':'+txtNormalize(fd.getSeconds(),2) : '???';
}

function vfsDirList(d) {
	var list=new Array();
	if ((d) && (d.lines)) {
		list[0]='.';
		list[1]='..';
		for (var i in d.lines) list[list.length]=i;
	};
	list.sort();
	return list
}

function vfsPermission(f,mode) {
	if (f) {
		if (usrVAR.UID==0) return ((mode) && (mode&1) && (f.kind!='d'))? f.mode&0100:1;
		var m=0;
		if (usrVAR.UID==f.owner) m= (f.mode>>6)&7
		else if (usrGroups[f.group]) m= (f.mode>>3)&7
		else m= f.mode&7;
		return m&mode
	}
	else return 0
}

function vfsCheckInPath(fn,fobj) {
	if ((typeof fobj=='object') && (fobj.kind=='d')) {
		while (fn) {
			while (fn.charAt(fn.length-1)=='/') fn=fn.substring(0,fn.length-1);
			var fp=vfsGetFile(fn);
			if ((fp.inode==fobj.inode) && (fobj.inode!=vfsRoot.inode)) return true;
			fn=vfsDirname(fn)
		}
	};
	return false
}

function vfsInit() {
	krnlInodes=100;
	vfsRoot=new VfsFile('d',{});
	vfsRoot.mdate=os_mdate;
	vfsRoot.mode=01777;
	vfsRoot.owner=0;
	vfsRoot.group=0;
	vfsRoot.icnt=2
}

function vfsTreeSetup() {
	var sysDirs=new Array('/sbin', '/dev');
	var wheelDirs=new Array('/bin', '/home', '/usr', '/var', '/usr/bin');
	usrVAR.UID=0;
	usrVAR.GID=0;
	for (var i=0; i<sysDirs.length; i++) {
		var d=vfsCreate(sysDirs[i],'d',0775,os_mdate);
	};
	vfsCreate('/etc','d',01777,os_mdate);
	vfsCreate('/tmp','d',01777,os_mdate);
	vfsCreate('/root','d',0700,os_mdate);
	var f;
	f=vfsCreate('/dev/null','b',0666,os_mdate);
	f=vfsCreate('/dev/js','b',0755,os_mdate);
	f.lines=['JavaScript native code'];
	f=vfsCreate('/dev/console','b',0644,os_mdate);
	f.lines=['1'];
	usrVAR.GID=1;
	for (var i=0; i<wheelDirs.length; i++) {
		var d=vfsCreate(wheelDirs[i],'d',0777,os_mdate);
	}
}

// krnl prcs

function krnlGetEnv(args,fhin,fhout) {
	var env=new KrnlProcess([args]);
	var fi=null;
	var fo=null;
	if ((fhin) && (typeof fhin == 'object')) fi=fhin;
	if ((fhout) && (typeof fhout == 'object')) fo=fhout;
	if (fi) env.stdin=new VfsFileHandle(fi);
	if (fo) env.stdin=new VfsFileHandle(fo);
	return env
}

function krnlFork(env) {
	var child=new KrnlProcess([]);
	child.id=env.id;
	child.stdin=env.stdin;
	child.stdout=env.stdout;
	child.stderr=env.stderr;
	child.cwd=env.cwd;
	env.child=child;
	return child
}

function krnlWordChar(ch) {
	return (((ch>='a') && (ch<='z')) || ((ch>='A') && (ch<='Z')) || ((ch>='0') && (ch<='9')) || (ch=='_'));
}

function krnlGetOpt(s) {
	var opts=new Object();
	opts.length=0;
	if ((s) && (s.charAt(0)=='-')) {
		for (var i=1; i<s.length; i++) {
			opts[s.charAt(i)]=1;
			opts.length++
		}
	};
	return opts
}

function krnlGetOpts(args,ofs) {
	var opts=new Object();
	var pos=1;
	opts.length=0;
	if (ofs==null) ofs=1;
	while ((args.length>ofs) && (args[ofs]!=null)) {
		var s=args[ofs];
		if ((s) && (s.charAt(0)=='-')) {
			opts.length++;
			ofs++;
			for (var i=1; i<s.length; i++) opts[s.charAt(i)]=pos++;
		}
		else break
	};
	return opts
}


function krnlTestOpts(opt,optstr) {
	var legalopts={length:1};
	if (opt.length==0) return 0;
	for (var i=0; i<optstr.length; i++) legalopts[optstr.charAt(i)]=1;
	for (var oi in opt) {
		if (!legalopts[oi]) return -1;
	};
	return 1
}

function krnlCsl2stdin() {
	var iln=krnlTtyBuffer;
	krnlTtyBuffer='';
	return [0,iln]
}

function krnlTTY(env,bincmd) {
	cnslCharMode=false;
	if ((env) && (env.args[0]=='TTY')) {
		// init && start login shell
		this.env=null;
		this.cmdbin='';
		cnslLock=true;
		cnslRawMode=false;
		var shenv;
		var pfg= vfsGetFile('/etc/profile');
		shenv=krnlGetEnv(['shell'],pfg,null);
		shenv.cwd=usrVAR.HOME;
		shenv.loginShell=true;
		cnslClear();
		shellExec(shenv,'shellExec');
	}
	else if (env) {
		this.env=env;
		this.bincmd=bincmd;
		if (env.wantChar) cnslCharMode=true
		else if (env.wantMore) {
			cnslChar(3);
			cnslChar(2);
			cursorOn()
		}
		else {
			cnslPrompt();
			cursorOn()
		};
		cnslLock=false
	}
	else if (this.env) {
		cnslLock=true;
		krnlCurPcs=this.env;
		this.env=null;
		self[this.bincmd](krnlCurPcs)
	}
	else {
		krnlPIDs.length=1;
		krnlLogin(1)
	}
}

function krnlKill(pid) {
	var child=krnlPIDs[pid].child;
	if (child!=null) {
		if (child.pid==pid) {
			//alert('PID recursion: '+pid+' ('+krnlPIDs[pid].args[0]+')');
		}
		else  {
			krnlKill(child.pid);
			krnlPIDs[pid].child=null
		}
	};
	krnlPIDs[pid]=null;
	krnlPIDs.length--
}

function krnlFOut(fh,t,style) {
	if (typeof t != 'object') {
		if (typeof t!='string') t=''+t;
		t=t.split('\n')
	};
	if (fh==null) {
		if (cnslSmartmode) {
			cnslSBInit();
			if (style) {
				for (var i=0; i<t.length; i++) { cnslSmartWrite(t[i]); cnslSBNewLine() }
			}
			else {
				for (var i=0; i<t.length; i++) { cnslSmartType(t[i]); cnslSBNewLine() }
			};
			cnslSBOut()
		}
		else if (style) {
			for (var i=0; i<t.length; i++) { cnslWrite(t[i]); newLine() }
		}
		else {
			for (var i=0; i<t.length; i++) { cnslType(t[i]); newLine() }
		}
	}
	else {
		for (var i=0; i<t.length; i++) fh.putLine(t[i]);
	}
}


// keyboard

var domKeyRef = {
	DOM_VK_LEFT: 28,
	DOM_VK_RIGHT: 29,
	DOM_VK_UP: 30,
	DOM_VK_DOWN: 31,
	DOM_VK_BACK_SPACE: 8,
	DOM_VK_RETURN: 13,
	DOM_VK_ENTER: 13,
	DOM_VK_ESCAPE: 27,
	DOM_VK_DELETE: 8
};

function enableKeyboard() {
	if (document.addEventListener) document.addEventListener("keypress", keyHandler, true)
	else {
		if ((self.Event) && (self.Event.KEYPRESS)) document.captureEvents(Event.KEYPRESS);
		document.onkeypress = keyHandler
	};
	window.document.onkeydown=keyIEFix
}

var isSafari = (navigator.userAgent.indexOf('Safari') >= 0);
var isOpera = (window.opera && navigator.userAgent.indexOf('Opera')>=0)? true:false;
var isChrome = (navigator.userAgent.indexOf('Chrome/')>=0 && navigator.userAgent.indexOf('WebKit')>=0)? true:false;

function keyIEFix() {
	if (window.event) {
		var ch=window.event.keyCode;
		var e=window.event;
		if (e.DOM_VK_UP) {
			for (var i in domKeyRef) {
				if ((e[i]) && (ch == e[i])) {
					keyHandler({which:domKeyRef[i],jsuix_remapped:true});
					if (e.preventDefault) e.preventDefault();
					if (e.stopPropagation) e.stopPropagation();
					e.cancleBubble=true;
					return false;
				}
			}
			e.cancleBubble=false;
			return true;
		}
		else {
			// no DOM support
			if (ch==8 && !isOpera) keyHandler({which:8,jsuix_remapped:true})
			else if (ch==37) keyHandler({which:28,jsuix_remapped:true})
			else if (ch==39) keyHandler({which:29,jsuix_remapped:true})
			else if (ch==38) keyHandler({which:30,jsuix_remapped:true})
			else if (ch==40) keyHandler({which:31,jsuix_remapped:true})
			else if (ch==27) keyHandler({which:27,jsuix_remapped:true})
			else if ((ch>=57373) && (ch<=57376)) {
				if (ch==57373) keyHandler({which:30,jsuix_remapped:true})
				else if (ch==57374) keyHandler({which:31,jsuix_remapped:true})
				else if (ch==57375) keyHandler({which:28,jsuix_remapped:true})
				else if (ch==57376) keyHandler({which:29,jsuix_remapped:true});
			}
			else {
				e.cancleBubble=false;
				return true;
			}
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancleBubble=true;
			return false;
		}
	}
}

function keyHandler(e) {
	if (cnslLock) return true;
	if (e && e.metaKey) return true;
	if ((window.event) && (window.event.preventDefault)) window.event.preventDefault()
	else if ((e) && (e.preventDefault)) e.preventDefault();
	if ((window.event) && (window.event.stopPropagation)) window.event.stopPropagation()
	else if ((e) && (e.stopPropagation)) e.stopPropagation();
	var ch;
	var ctrlShift=false;
	var remapped=false;
	if (e) {
		ch=e.which;
		ctrlShift=(((e.ctrlKey) && (e.shiftKey)) || (e.modifiers==6));
		if (e.jsuix_remapped) remapped=true;
	}
	else if (window.event) {
		ch=window.event.keyCode;
		ctrlShift=((window.event.ctrlKey) && (window.event.shiftKey));
	}
	else {
		return true
	};
	if ((ch=='') && (remapped==false)) {
		// map specials
		if (e==null) e=window.event;
		if ((e.charCode==0) && (e.keyCode)) {
			if (e.DOM_VK_UP) {
				for (var i in domKeyRef) {
					if ((e[i]) && (e.keyCode == e[i])) {
						ch=domKeyRef[i];
						break
					}
				}
			}
			else {
				// Mozilla alike but no DOM support
				if (e.keyCode==37) ch=28
				else if (e.keyCode==39) ch=29
				else if (e.keyCode==38) ch=30
				else if (e.keyCode==40) ch=31
				else if (e.keyCode==27) ch=27;
			}
		}
	}
	else if (ctrlShift) {
		// remap ctrlshift
		if (ch==52) ch=28
		else if (ch==54) ch=29
		else if (ch==56) ch=30
		else if (ch==50) ch=31
		else if (ch==48) ch=8;
	};
	// key actions
	if (cnslCharMode) {
		cnslInsert=false;
		krnlTtyChar=ch;
		krnlTtyBuffer='';
		if (cnslRawMode) self[krnlCurPcs.bin]()
		else krnlTTY();
		if (ch<=32) {
			if (window.event) window.event.cancleBubble=true;
			return false
		}
		else return true
	}
	else if (ch==28) {
		// left
		cursorLeft();
		if (window.event) window.event.cancleBubble=true;
		return false
	}
	else if (ch==29) {
		// right
		cursorRight();
		if (window.event) window.event.cancleBubble=true;
		return false
	}
	else if (ch==27) {
		// esc/delete
		if (window.event) window.event.cancleBubble=true;
		return false
	}
	else if (ch==8) {
		// backspace
		cnslBackspace();
		if (window.event) window.event.cancleBubble=true;
		return false
	}
	else if (ch==30) {
		// up
		if (!cnslRawMode) {
			cursorOff();
			if (usrHistPtr==usrHIST.length) this.lastLine=cnslGetLine();
			cnslClearLine();
			if ((usrHIST.length) && (usrHistPtr>=0)) {
				if (usrHistPtr>0) usrHistPtr--;
				cnslType(usrHIST[usrHistPtr]);
			}
			else if (this.lastLine) cnslType(this.lastLine);
			cursorOn()
		};
		if (window.event) window.event.cancleBubble=true;
		return false
	}
	else if (ch==31) {
		// down
		if (!cnslRawMode) {
			cursorOff();
			if (usrHistPtr==usrHIST.length) this.lastLine=cnslGetLine();
			cnslClearLine();
			if ((usrHIST.length) && (usrHistPtr<=usrHIST.length)) {
				if (usrHistPtr<usrHIST.length) usrHistPtr++;
				if (usrHistPtr<usrHIST.length-1) cnslType(usrHIST[usrHistPtr])
				else if (this.lastLine) cnslType(this.lastLine);
			}
			else if (this.lastLine) cnslType(this.lastLine);
			cursorOn()
		};
		if (window.event) window.event.cancleBubble=true
		return false
	}
	else if ((ch>=32) && (ch<256)) {
		if (blinkTimer) clearTimeout(blinkTimer);
		if (cnslInsert) {
			cursorOff();
			cnslScrollRight(t_r,t_c)
		};
		cnslChar(ch);
		cursorOn();
		if (ch==32) {
			if (window.event) window.event.cancleBubble=true;
			return false
		}
		else if ((window.opera) && (window.event)) window.event.cancleBubble=true
		else return true
	}
	else if (ch==13) {
		cursorOff();
		if (repeatTimer) clearTimeout(repeatTimer);
		cnslInsert=false;
		this.lastLine='';
		if (cnslRawMode) {
			cnslLock=true;
			self[krnlCurPcs.bin](cnslGetLine());
			return
		};
		krnlTtyBuffer=cnslGetLine();
		krnlTtyChar=0;
		if (krnlTtyBuffer) {
			usrHIST[usrHIST.length]=krnlTtyBuffer
			usrHistPtr=usrHIST.length;
		};
		newLine();
		krnlTTY();
		if (window.event) window.event.cancleBubble=true
		return false
	};
	return true
}

function termClose() {
	cnslLock=true;
	if (blinkTimer) clearTimeout(blinkTimer);
	termHide();

	document.getElementById("termDiv").className = "";
	document.querySelector(".sidebar").style.width = "16rem";
	document.getElementById("termDiv").style.display = "none";
	$('.sidebar-logo').fadeIn();
}

function termOpen() {
	makeTerm();
	krnlInit();

	document.getElementById("termDiv").className = "termOpen";
	document.getElementById("termDiv").style.display = "block";
}
//eof

/*******************************************************************************
 *
 * Command Shell
 *
 ******************************************************************************/

var shellCookie='#!/bin/sh';

function shellExec(env) {
	krnlCurPcs=env;
	env.id='sh';
	if (env.child) {
		if ((env.child.bin) && (self[env.child.bin])) {
			krnlCurPcs=env.child;
			self[env.child.bin](env.child);
			if (env.child.status=='') {
				shellFhReset(env);
				shellWait(true,env)
			}
			else {
				shellWait(false,env);
				return
			};
			krnlCurPcs=env
		}
		else {
			// forced kill
			env.status=(env.loginShell)? '': 'wait';
			env.child.status='';
			shellFhReset(env);
			shellWait(true,env)
		}
	};
	var thread=true;
	var curLine=(env.curLine)? env.curLine:'';
	env.curLine='';
	if (!env.PLH) env.PLH=null;
	if (!env.PRH) env.PRH=null;
	while ((thread) || (curLine!='')) {
		shellFhPermute(env);
		// get line
		if ((env.wantMore) || (curLine=='')) {
			var linedescriptor;
			if (env.stdin) {
				linedescriptor=env.stdin.readLine()
			}
			else {
				linedescriptor=krnlCsl2stdin();
				thread=false;
			};
			var l=linedescriptor[0];
			if (l==-1) { shellWait(false,env,(!env.loginShell)); return}; //eof
			if (env.wantMore) {
				curLine+=linedescriptor[1];
				env.wantMore=false
			}
			else curLine=linedescriptor[1];
			if (env.stdin) {
				while (curLine.charAt(curLine.length-1)=='\\') {
					curLine=curLine.substring(0,curLine.length-1);
					var nl=env.stdin.readLine();
					if (nl[0]>0) curLine+=nl[1];
				}
			}
			else {
				if (curLine.charAt(curLine.length-1)=='\\') {
					env.curLine=curLine.substring(0,curLine.length-1);
					env.wantMore=true;
					shellWait(false,env,false); return;
				}
			}
		};
		var args=shellParseLine(curLine,1);
		var ctrlchar=args[args.length-2];
		curLine=args[args.length-1];
		args.length-=2;
		// backticks eval
		if (env.preargs) {
			var pal=env.preargs.length;
			for (var i=0; i<args.length; i++) env.preargs[pal+i]=args[i];
			args=env.preargs;
			env.preargs=null
		};
		if (ctrlchar=='`') {
			var cmdstr=shellSubstitute(args[args.length-1]);
			var subfh=new VfsFileHandle(new VfsFile('p',[cmdstr.join('')]));
			args.length--;
			env.preargs=args;
			env.args=['sh'];
			var pipe=new VfsFileHandle(new VfsFile('p',[]));
			env.curLine=curLine;
			shellFhSet(env,pipe);
			env.stdin=subfh;
			shellFork(env,'shellExec',['sh']);
			if (env.child.status=='') {
				var ret=env.stdout.file.lines.join(' ');
				shellFhReset(env);
				curLine=ret+env.curLine;
				shellWait(true,env);
				continue
			}
			else {
				env.curLine=curLine;
				shellWait(false,env)
				return;
			}
		};
		// clean up args
		while ((args.length>0) && (args[0].length==0)) {
			for (var i=0; i<args.length-2; i++) args[i]=args[i+1];
			args.length--
		};
		if (args.length==0) {
			if ((curLine) || (thread)) continue
			else {shellWait(thread,env); return};
		};
		// substitute aliases
		var aref=new Array();
		while (usrALIAS[args[0]]) {
			if (aref[args[0]]) {
				krnlFOut(env.stderr,'error: circular aliases.');
				shellWait(thread,env); return
			};
			aref[args[0]]=1;
			var a2= shellParseLine(usrALIAS[args[0]],1);
			var cc2=a2[a2.length-2];
			var cl2=a2[a2.length-1];
			if ((cc2) && (cl2)) {
				curLine=cl2+ctrlchar+curLine;
				ctrlchar=cc2
			};
			var l2=a2.length-3;
			if (l2>0) {
				for (var i=args.length-1; i>0; i--) args[i+l2]=args[i];
			};
			for (var i=0; i<=l2; i++) args[i]=a2[i];
			while ((args.length>0) && (args[0].length==0)) {
				for (var i=0; i<args.length-2; i++) args[i]=args[i+1];
				args.length--
			};
			if (args.length==0) {
				if ((curLine) || (thread)) continue
				else {shellWait(thread,env); return};
			}
		};
		// exec
		var pipe=((ctrlchar=='|') || (ctrlchar=='>'))? new VfsFileHandle(new VfsFile('p',[])) : null;
		var cmd=args[0];
		if (cmd.charAt(0)=='#') {
			if (thread) continue
			else {shellWait(thread,env); return};
		}
		else if (cmd=='exit') {
			if ((usrHIST) && (usrHIST.length)) usrHIST.length--; // pop this command
			shellWait(thread,env,true);
			return
		}
		else if ((cmd=='>') || (cmd=='>>')){
			// write redirected stdout
			shellWriteOut(env,args[1],env.PLH,(cmd=='>>'));
			env.PLH=null;
			if (curLine) continue
		}
		else if (cmd.charAt(cmd.length-1)=='/') {
			krnlFOut(env.stderr,'"'+cmd+'" is not a command.');
		}
		else if (shellCMD[cmd]) {
			// shell cmd
			shellFhSet(env,pipe);
			shellCMD[cmd](env,args);
			shellFhReset(env);
			if (curLine) continue
		}
		else {
			var cmdfound=false;
			var cmdpath=(cmd.indexOf('/')>=0)? [env.cwd]:usrVAR.PATH.split(' ');
			for (var pi=0; pi<cmdpath.length; pi++) {
				var cmdf=vfsOpen(vfsGetPath(cmd, cmdpath[pi]),1);
				if ((typeof cmdf=='object') && (cmdf.lines[0]) && ((cmdf.kind=='b') || (cmdf.kind=='f')) && (cmdf.lines[0].indexOf('#!/dev/js/')==0)) {
					// binary cmd
					cmdbin=cmdf.lines[0].substring(10);
					if (self[cmdbin]) {
						cmdfound=true;
						env.curLine=curLine;
						shellFhSet(env,pipe);
						shellFork(env,cmdbin,args);
						if (env.child.status=='') {
							shellFhReset(env);
							shellWait(true,env);
							break
						}
						else {
							env.curLine=curLine;
							shellWait(false,env)
							return;
						}
					}
					else {
						krnlFOut(env.stderr,'error: can\'t execute binary!');
						if (curLine) continue
					}
				}
				else if ((typeof cmdf=='object') && (cmdf.kind=='f')) {
					//if ((cmdf.lines[0]) && (cmdf.lines[0].indexOf(shellCookie)==0)) {
						// exec script
						cmdfound=true;
						env.curLine=curLine;
						shellFhSet(env,pipe);
						env.stdin=new VfsFileHandle(cmdf);
						shellFork(env,'shellExec',args,1);
						if (env.child.status=='') {
							shellFhReset(env);
							shellWait(true,env);
							break
						}
						else {
							env.curLine=curLine;
							shellWait(false,env)
							return;
						}
					//}
				}
			};
			if (!cmdfound) {
				krnlFOut(env.stderr,'command not found: "'+cmd+'"');
			}
		};
		env.curLine=curLine
	};
	shellWait(thread,env);
}

function shellFork(env,cmdbin,args) {
	var child=krnlFork(env);
	krnlCurPcs=child;
	if (cmdbin == 'shellExec') {
		child.loginShell=false;
		var a=0;
		if (args.length>1) {
			if ((args[0]=='sh') && (child.stdin==null)) {
				var srcf=vfsOpen(vfsGetPath(args[1], env.cwd),4);
				if ((typeof srcf=='object') && (srcf.kind=='f')) {
					child.stdin=new VfsFileHandle(srcf);
					a=1
				}
				else if (srcf<0) {
					krnlFOut(env.stderr,vfsGetPath(args[1], env.cwd)+': permission denied.');
					var cl=new Array();
					for (var i=1; i<args.length; i++) cl[cl.length]=args[i];
					child.stdin=new VfsFileHandle(new VfsFile('p',[cl.join(' ')]))
				}
				else {
					var cl=new Array();
					for (var i=1; i<args.length; i++) cl[cl.length]=args[i];
					child.stdin=new VfsFileHandle(new VfsFile('p',[cl.join(' ')]))
				}
			}
		};
		for (var i=0; i<args.length-a; i++) child.args[i]=args[i+a];
	}
	else {
		for (var i=0; i<args.length; i++) child.args[i]=args[i];
	}
	child.id=args[0];
	self[cmdbin](child);
	if (child.status=='') krnlCurPcs=env;
}

function shellWait(thread,env, forceExit) {
	if (env.child) {
		if (env.child.status=='') {
			krnlCurPcs=env;
			krnlKill(env.child.pid);
			env.child=null;
			env.status='';
			env.wantChar=false;
			env.wantMore=false
		}
		else {
			env.status='wait';
			env.wantChar=env.child.wantChar;
			env.wantMore=env.child.wantMore
		}
	};
	if (forceExit) {
		env.status='';
		env.bin='';
		if (env.loginShell) krnlTTY();
	}
	else if ((thread==false) || (env.status)) {
		if (env.loginShell) {
			env.stdin=null;
			krnlTTY(env,'shellExec')
		}
		else {
			env.status='wait';
			env.bin='shellExec'
		}
	}
}

function shellFhSet(env,pipe) {
	env.backin=env.stdin;
	env.backout=env.stdout;
	if (env.PLH) {
		env.stdin=env.PLH;
		env.PLH=null
	};
	if (pipe) {
		env.stdout=env.PRH=pipe
	}
}

function shellFhPermute(env) {
	if (env.PRH) {
		env.PLH=env.PRH;
		env.PLH.close();
		env.PRH=null
	}
	else {
		env.PLH=env.PRH=null
	}
}

function shellFhReset(env) {
	if ((env.stdin!=env.backin) || (env.stdout!=env.backout)) {
		env.stdin=env.backin;
		env.stdout=env.backout;
		env.backin=env.backout=null
	}
}

function shellParseLine(s,ctrl) {
	var args=new Array();
	var n=0;
	var op='';
	var quote='';
	var esc=false;
	var rest='';
	var ctrlchar='';
	for (var i=0; i<s.length; i++) {
		var ch=s.charAt(i);
		if (ch=='\\') {
			if (quote) {
				op+=ch;
				esc=!esc;
				continue
			};
			if (esc) esc=false
			else {
				esc=true;
				continue
			}
		};
		if (esc) {
			if ((quote) && (ch==quote)) op=op.substring(0,op.length-1);
			op+=ch;
			esc=false
		}
		else if (ch=='`') {
			if (quote=='') {
				if (op) {
					var subargs=shellSubstitute(op);
					for (var si=0;si<subargs.length; si++) args[n++]=subargs[si];
					op='';
				};
				quote=ch
			}
			else if (quote=='`') {
				args[n++]=op;
				ctrlchar='`';
				rest=s.substring(i+1);
				break
			}
			else {
				op+=ch
			}
		}
		else if ((ch=='"') || (ch=='\'')) {
			if ((quote) && (ch!=quote)) {
				op+=ch
			}
			else if ((ch==quote) && (ch=='\'')) {
				args[n++]=op;
				op='';
				quote=''
			}
			else {
				if (op) {
					var subargs=shellSubstitute(op);
					for (var si=0;si<subargs.length; si++) args[n++]=subargs[si];
					op='';
				};
				quote=(ch==quote)? '':ch;
			}
		}
		else if (ch==' ') {
			if (quote) {
				op+=ch
			}
			else if (op!='') {
				var subargs=shellSubstitute(op);
				for (var si=0;si<subargs.length; si++) args[n++]=subargs[si];
				op='';
			}
		}
		else if ((ctrl) && (!quote) && ((ch==';') || (ch=='|') || (ch=='>'))) {
			rest=s.substring(i+1);
			ctrlchar=ch;
			if (ch=='>') {
				var prefix='\\>';
				var count=0;
				while ((rest) && (rest.charAt(0)=='>')) {
					prefix+='\\>';
					count++;
					rest=rest.substring(1)
				};
				rest=prefix+'  '+rest;
				if (count>1) ctrlchr=';';
			};
			break
		}
		else if ((ch=='#') && (!quote)) break
		else op+=ch;
	};
	if (op!='') {
		if (quote=='\'') args[n]=op;
		else if (quote=='`') {
			args[n]=op;
			ctrlchar='`'
		}
		else {
			var subargs=shellSubstitute(op);
			for (var si=0;si<subargs.length; si++) args[n++]=subargs[si];
		}
	};
	if (ctrl) {
		args[n++]=ctrlchar;
		args[n++]=rest
	};
	return args
}

function shellSubstitute(arg) {
	var ofs=arg.indexOf('$');
	var chunks=new Array();
	var toeval=new Array();
	if (ofs>=0) {
		var parsed='';
		while (true) {
			var post='';
			var esc=false;
			if (ofs>0) {
				var pre=arg.substring(0,ofs);
				for (var ci=pre.length-1; ci>=0; ci--) {
					if (pre.charAt(ci)=='\\') esc=!esc
					else break;
				};
				if (esc) pre=pre.substring(0,pre.length-1);
				chunks[chunks.length]=pre;
				toeval[toeval.length]=false
			};
			if (esc) {
				v=arg.substring(ofs);
				var ofs2=v.indexOf('$',1);
				if (ofs2>0) {
					post=v.substring(ofs2);
					v=v.substring(0,ofs2)
				};
				chunks[chunks.length]=v;
				toeval[toeval.length]=false;
			}
			else {
				ofs++;
				if (arg.length==ofs) break;
				v=arg.substring(ofs);
				if (v.charAt(0)=='{') {
					var ofs2=v.indexOf('}');
					if ((ofs2>0) && (v.length>ofs2+1)) post=v.substring(ofs2+1);
					v=v.substring(1,ofs2);
				}
				else {
					var v1='';
					for (var i=0; i<v.length; i++) {
						var ch=v.charAt(i);
						if (krnlWordChar(ch)) v1+=ch
						else {
							post=v.substring(i);
							break
						}
					};
					v=v1
				};
				chunks[chunks.length]=v;
				toeval[toeval.length]=true
			};
			if (post) {
				arg=post;
				ofs=arg.indexOf('$');
				if (ofs<0) {
					chunks[chunks.length]=post;
					toeval[toeval.length]=false;
					break
				}
			}
			else break
		};
		for (var i=0; i<chunks.length; i++) {
			if (toeval[i]) {
				var v=chunks[i];
				if (v=='PID') parsed+=krnlCurPcs.pid
				else if ((v>='0') && (v<='9')) {
					v=parseInt(v);
					if (krnlCurPcs.args[v]) parsed+=krnlCurPcs.args[v];
				}
				else if (v.indexOf('ENV_')==0) {
					v=v.substring(4);
					if (krnlCurPcs[v]) parsed+=(typeof krnlCurPcs[v]=='object')? krnlCurPcs[v].length: krnlCurPcs[venv];
				}
				else if (usrVAR[v]!=null) parsed+=usrVAR[v];
			}
			else parsed+=chunks[i];
		};
		if (parsed) return [parsed]
		else return [''];
	}
	else {
		return [arg]
	}
}

function shellTestName(s) {
	isName=false;
	if (s!='') {
		var ch=s.charAt(0);
		if (((ch>='a') && (ch<='z')) || ((ch>='A') && (ch<='Z'))) {
			isName=true;
			for (var i=0; i<s.length;i++) {
				ch=s.charAt(i);
				if (krnlWordChar(ch)==false) {
					isName=false;
					break
				}
			}
		}
	};
	return isName
}

// redirect to file

function shellWriteOut(env,fn,pipe,append) {
	var pipefile= (pipe)? pipe.file : new VfsFile('p',[]);
	var path=vfsGetPath(fn,env.cwd);
	var f1=vfsOpen(path,2);
	if (f1) {
		if (f1.inode==krnlDevNull) return;
		if (f1<0) {
			krnlFOut(env.stderr,'redirect - permission denied: '+path);
		}
		else if (f1.kind=='d') {
			krnlFOut(env.stderr,'redirect - can\'t write, file is directory: '+path);
		}
		else {
			vfsFileCopy(pipefile,f1,append)
		}
	}
	else {
		var f=vfsCreate(path,'f',0640);
		if (f==0) {
			krnlFOut(env.stderr,'redirect - illegal file path: '+path);
		}
		else if (f<0) {
			krnlFOut(env.stderr,'redirect - permission denied: '+path);
		}
		else {
			vfsFileCopy(pipefile,f)
		}
	}
}

// shell commands

function shellCmdSet(env,args) {
	if (args.length==1) {
		var buf=new Array();
		for (var n in usrVAR) buf[buf.length]=n+'  '+usrVAR[n];
		krnlFOut(env.stdout, buf)
		return
	};
	var keys=new Array();
	var val='';
	var verbous=true;
	var assign=false;
	var a=1;
	var opt=krnlGetOpt(args[1])
	if (opt.length) {
		a++;
		if (opt.s) verbous=false;
	};
	for (var i=a; i<args.length; i++) {
		if (args[i]=='=') {
			assign=true;
			if (keys.length==0) {
				if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' [<varname> [<varname] [= <value> [<value>]]]\n - no varnames');
				return
			}
		}
		else if (assign) {
			val+= (val!='')? ' '+args[i] : args[i];
		}
		else keys[keys.length]=args[i];
	};
	for (var k=0; k<keys.length; k++) {
		var ks=keys[k];
		if (shellTestName(ks)==false) {
			if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' [<varname> [<varname] [= <value> [<value>]]]\n - name must be of [A-Za-z][A-Za-z0-9_]*');
		}
		else if ((ks=='PID') || (ks=='VERSION') || (ks=='USER') || (ks=='UID') || (ks=='GID')) {
			if (verbous) krnlFOut(env.stderr,'error: "'+ks+'" is a reserved name!');
		}
		else {
			usrVAR[ks]=val;
			if (verbous) krnlFOut(env.stderr,'var "'+ks+'" set to "'+val+'".')
		}
	}
}

function shellCmdUnset(env,args) {
	var verbous=true;
	var a=1;
	if (args.length>1) {
		var opt=krnlGetOpt(args[1])
		if (opt.length) {
			a++;
			if (opt.s) verbous=false;
		}
	};
	if (args.length<a+1) {
		if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' <varname> - no varname');
		return
	};
	var k=args[a];
	if (shellTestName(k)==false) {
		if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' <varname> - name must be in [A-Za-z0-9_]');
		return
	};
	if ((k=='PID') || (k=='PATH') || (k=='USER') || (k=='HOME') || (k=='VERSION') || (k=='HOST') || (k=='UID') || (k=='GID')) {
		if (verbous) krnlFOut(env.stderr,'error: "'+k+'" is a reserved name!');
		return
	}
	else {
		delete(usrVAR[k]);
		if (verbous) krnlFOut(env.stderr,'unset var "'+k+'".');
	}
}

function shellCmdAlias(env,args) {
	if (args.length==1) {
		var buf=new Array();
		for (var n in usrALIAS) buf[buf.length]=n+'  '+usrALIAS[n];
		krnlFOut(env.stdout, buf)
		return
	};
	var verbous=true;
	var a=1;
	var opt=krnlGetOpt(args[1])
	if (opt.length) {
		a++;
		if (opt.s) verbous=false;
	};
	if (args.length<a+2) {
		if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' <name> <value>');
		return
	};
	var k=args[a];
	if (shellTestName(k)==false) {
		if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' <name> <value> - name must be in [A-Za-z0-9_] - (use quotes?)');
		return
	};
	var va=new Array();
	for (var i=a+1; i<args.length; i++) va[va.length]=args[i];
	var v=va.join(' ');
	usrALIAS[k]=v;
	if (verbous) krnlFOut(env.stderr,'alias "'+k+'" set to "'+v+'".');
}

function shellCmdUnalias(env,args) {
	var verbous=true;
	var a=1;
	if (args.length>1) {
		var opt=krnlGetOpt(args[1])
		if (opt.length) {
			a++;
			if (opt.s) verbous=false;
		}
	};
	if (args.length<a+1) {
		if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' <name> - (use quotes?)');
		return
	};
	var k=args[a];
	if (shellTestName(k)==false) {
		if (verbous) krnlFOut(env.stderr,'usage: '+args[0]+' <name> - name must be in [A-Za-z0-9_]');
		return
	};
	delete(usrALIAS[k]);
	if (verbous) krnlFOut(env.stderr,'deleted alias "'+k+'".')
}

function shellCmdCd(env,args) {
	var p=(args[1])? vfsGetPath(args[1],env.cwd): usrVAR.HOME;
	var d=vfsGetDir(p);
	if (d<0) {
		krnlFOut(env.stderr,p+': permission denied.')
	}
	else if (d==0) {
		krnlFOut(env.stderr,p+': no such directory.')
	}
	else if (!vfsPermission(d,1)) {
		krnlFOut(env.stderr,p+': permission denied.')
	}
	else {
		env.cwd=p
	}
}

function shellCmdPwd(env) {
	krnlFOut(env.stdout,env.cwd);
}


// PATH entries for shell commands

var shellCMD=new Object();
shellCMD['set']=shellCmdSet;
shellCMD['unset']=shellCmdUnset;
shellCMD['alias']=shellCmdAlias;
shellCMD['unalias']=shellCmdUnalias;
shellCMD['cd']=shellCmdCd;
shellCMD['pwd']=shellCmdPwd;

/// eof

/*******************************************************************************
 *
 * Commands
 *
 ******************************************************************************/


var usrFDump='';
var usrExWin=null;

function commandHelp(env) {
	env.stdin=new VfsFileHandle(new VfsFile('p',[
	'%+r System Help %-r',
	'JS/UIX is a virtual OS in UN*X-style for JavaScript and web-browsers.',
	'',
	'%+uFor help on specific topics type any of these commands:%-u',
	' ',
	'info                        site information - about %+imass:werk%-i',
	'features                    OS features / system info - about %+i'+os_version+'%-i',
	'man <command>               to display a manual entry for <command>',
	//'-------------------------------------------------------------------------------',
	'',
	'%+uCurrently implemented UN*X-commands (see "man" for implemented options)%-u',
	'',
	' alias      set an alias',
	' apropos    display a short description of a command',
	' cal        display a monthly calendar (non-standard opt. "-w" for weeks-count)',
	' cat        concatenate files',
	' chmod      change file permissions',
	' cd         change current working directory',
	' cp         copy files or directories',
	' date       display date and time (non-standard opt. "-u" for UTC)',
	' echo       write arguments back',
	' halt       halt system, shut down',
	' ls         list directory',
	' logname    display login name',
	' mkdir      make a directory',
	' man        display manual page',
	' more       pager',
	' mv         move/rename files or directories',
	' pager      synonym for more',
	' pg         synonym for more',
	' pr         print (to a browser window)',
	' ps         display list of active processes',
	' pwd        print working directory',
	' reboot     reboot system',
	' rm         remove file(s)',
	' rmdir      remove a directory',
	' set        set a variable',
	' sh         start a new sub-shell',
	' stty       set terminal attributes',
	' su         switch user',
	' touch      set the timestamp of file or create empty file',
	' uname      display system name',
	' unalias    discard an alias',
	' unset      discard a variable',
	' vi         visual editor (simple vi)',
	' view       vi in view mode',
	' wc         word count',
	' which      evaluate command path for command to be executed',
	'',
	'%+uCurrently implemented non-standard commands%-u',
	'',
	' browse     open a new browser window with specified url (or site-homepage)',
	' clear      clear and reset the display',
	' features   display features of the virtual OS and the terminal',
	' fexport    export/backup of home-directory for intersession operability.',
	' fimport    re-import of backuped home-data for intersession operability.',
	' hallo      display a short system-identification',
	' hello      display a short system-identification',
	' help       display this help table',
	' info       display site-information',
	' invaders   the "space invaders" arcade game for JS/UIX',
	' js         javascr'+'ipt debugging',
	' mail       open a mail-client with specified address (default webmaster)',
	' news       displays latest news on system changes',
	' reset      reboot system',
	' splitmode  (on/off) - switch window splitting on|off',
	' time       display system time ("-l" for local, "-u" for UTC)',
	' type       echo with specified type-style (see man page)',
	' web        synonym for "browse"',
	' write      write args with formating (marked up type-styles)',
	'-------------------------------------------------------------------------------',
	'P.S.: Some data for testing can be found in "/var".'
	]));
	env.stdin.close();
	env.args=['more'];
	commandMore(env)
}

function commandNews(env) {
	cnslClear();
	env.args=['news','/etc/news'];
	commandMore(env)
}

function commandClear(env) {
	cnslClear();
}

function commandReset(env) {
	if (env.status=='') {
		cnslType('sure to reboot system [y/n]? ');
		cursorOn();
		env.bin='commandReset';
		env.status='wait';
		env.wantChar=true;
		return
	}
	else if (krnlTtyChar==121) {
		cnslType('y'); newLine(); cnslType('halting system for reboot ...');
		setTimeout('termClose();termOpen()',100)
	}
	else {
		cnslType('n');
		newLine();
	};
	env.status='';
	env.wantChar=false;
	krnlTtyChar=0
}

function commandHalt(env) {
	if (env.status=='') {
		cnslType('sure to halt system [y/n]? ');
		cursorOn();
		env.bin='commandHalt';
		env.status='wait';
		env.wantChar=true;
		return
	}
	else if (krnlTtyChar==121) {
		cnslType('y'); newLine(); cnslType('halting system ...');
		setTimeout('termClose()',100)
	}
	else {
		cnslType('n');
		newLine();
	};
	env.status='';
	env.wantChar=false;
	krnlTtyChar=0
}

function commandHello(env) {
	var now=new Date();
	var t=(self.location.hostname)? ' @ '+self.location.hostname : ' @ localhost';
	t+= ' at '+now.getHours()+':'+txtNormalize(now.getMinutes(),2)+':'+txtNormalize(now.getSeconds(),2) +' local time';
	var s=' '+os_version+t+'\n';
	s+=' by mass:werk - media environments <http://www.masswerk.at>\n';
	s+=' Type "help" for available commands.';
	krnlFOut(env.stdout, s);
}

function commandParse(env) {
	var args=env.args;
	var s='parsed args:';
	if (args.length>1) {
		for (var i=1; i<args.length; i++) s+=' "'+args[i]+'"';
	}
	else {
		s+='none.'
	};
	krnlFOut(env.stdout,s)
}

function commandEcho(env) {
	var args=env.args;
	var s='';
	for (var i=1; i<args.length; i++) {
		s+=args[i];
		if (i+1!=args.length) s+=' ';
	};
	krnlFOut(env.stdout,s);
}

function commandType(env) {
	var args=env.args;
	var s='';
	var style=-1;
	var a=1;
	var opt=krnlGetOpts(args,1);
	if (krnlTestOpts(opt,'npruis')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	if (opt.length) {
		style=0;
		if (opt.n) {
			if (args.length>2) {
				var sn=parseInt(args[2]);
				if (isNaN(sn)==false) {
					style=sn&15;
					a++
				}
			}
		}
		else {
			if (opt.p) style|=0;
			if (opt.r) style|=1;
			if (opt.u) style|=2;
			if (opt.i) style|=4;
			if (opt.s) style|=8;
		}
	};
	a+=opt.length;
	if (style>=0) {
		for (var i=a; i<args.length; i++) {
			s+=args[i];
			if (i+1!=args.length) s+=' ';
		};
		cnslType(s,style);
		newLine()
	}
	else {
		commandEcho(env)
	}
}

function commandWrite(env) {
	var args=env.args;
	var s='';
	for (var i=1; i<args.length; i++) {
		s+=args[i];
		if (i+1!=args.length) s+=' ';
	};
	krnlFOut(env.stdout,s,1);
}

function commandTime(env) {
	var args=env.args;
	var utc=0;
	var opt=krnlGetOpts(args,1);
	if (krnlTestOpts(opt,'ul')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	if (opt.u) utc=1;
	else if (opt.l) utc=0;
	var now=new Date();
	if (utc) {
		var s=now.getUTCHours()+':'+txtNormalize(now.getUTCMinutes(),2)+':'+txtNormalize(now.getUTCSeconds(),2);
		krnlFOut(env.stdout,s+' UTC')
	}
	else {
		var s=now.getHours()+':'+txtNormalize(now.getMinutes(),2)+':'+txtNormalize(now.getSeconds(),2);
		krnlFOut(env.stdout,s)
	}
}

function commandDate(env) {
	var args=env.args;
	var m=new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
	var d=new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
	var now=new Date();
	var utc=false;
	var a=1;
	var opt=krnlGetOpts(args,1);
	if (krnlTestOpts(opt,'ul')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	a+=opt.length;
	if (opt.u) {
		now=new Date(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		);
		utc=true;
	};
	var s='';
	if ((args.length>a) && (args[a].charAt(0)=='+')) {
		// unix style formats
		var ta=args[a].split('%');
		for (var i=1; i<ta.length;i++) {
			var f=(ta[i].length>0)? ta[i].charAt(0):'';
			if (f=='a') s+=d[now.getDay()]
			else if (f=='D') s+=txtNormalize(now.getMonth()+1,2)+'/'+txtNormalize(now.getDate(),2)+'/'+txtNormalize(now.getFullYear()%100,2)
			else if (f=='T') s+=txtNormalize(now.getHours(),2)+':'+txtNormalize(now.getMinutes(),2)+':'+txtNormalize(now.getSeconds(),2)
			else if (f=='H') s+=txtNormalize(now.getHours(),2)
			else if (f=='M') s+=txtNormalize(now.getMinutes(),2)
			else if (f=='S') s+=txtNormalize(now.getSeconds(),2)
			else if (f=='d') s+=now.getDate()
			else if (f=='h') s+=m[now.getMonth()]
			else if (f=='m') s+=txtNormalize(now.getMonth()+1,2)
			else if (f=='w') s+=now.getDay()
			else if (f=='y') s+=mormalize(now.getFullYear()%100,2)
			else if (f=='t') s+=' '
			else if (f=='r') {
				var h=now.getHours();
				var z;
				if (h>12) {
					h-=12; z=' PM'
				}
				else z=' AM';
				s+=h+':'+txtNormalize(now.getMinutes(),2)+':'+txtNormalize(now.getSeconds(),2)+z;
			}
			else if (f=='j') {
				var y=now.getFullYear();
				var m=now.getMonth();
				var isLeap=(((y%4==0) && (y%100>0)) || (y%400==0))? true: false;
				var mLength=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
				var ds=0;
				for (var k=0; k<m; k++) ds+=((k==1) && (isLeap))? mLength[k]+1: mLength[k];
				ds+=now.getDate();
				s+=txtNormalize(ds,3)
			}
			else if (f=='n') s+='%n';
		}
	}
	else {
		var s=d[now.getDay()]+', '+now.getDate()+' '+m[now.getMonth()]+' '+now.getFullYear();
		s+=' '+now.getHours()+':'+txtNormalize(now.getMinutes(),2)+':'+txtNormalize(now.getSeconds(),2);
		if (utc) s+=' UTC';
	};
	krnlFOut(env.stdout,s)
}

function commandCal(env) {
	var args=env.args;
	var mLength=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var mLabel=new Array('January','February','March','April','May','June','July','August','September','October','November','December');
	var now=new Date();
	var weeks=false;
	var m,y;
	var a=1;
	var opt=krnlGetOpts(args,1);
	if (krnlTestOpts(opt,'w')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	if (opt.w) weeks=true;
	a+=opt.length;
	if (args.length==a) {
		m=now.getMonth();
		y=now.getFullYear()
	}
	else if (args.length<a+3) {
		m=parseInt(args[a],10);
		a++;
		if ((isNaN(m)) || (m<1) || (m>12)) {
			krnlFOut(env.stderr,'usage: '+args[0]+' [-w] [<month_nr>] [<year>] - month_nr must be in 1..12');
			return
		};
		m--;
		if (args.length==a+1) {
			y=parseInt(args[a],10);
			if ((isNaN(y)) || (y<1900) || (y>9999)) {
				krnlFOut(env.stderr,'usage: '+args[0]+' [-w] [<month_nr>] [<year>] - year must be in 1900..9999');
				return
			}
		}
		else {
			y=now.getFullYear()
		}
	}
	else {
		krnlFOut(env.stderr,'usage: '+args[0]+' [-w] [<month_nr>] [<year>] - to many arguments');
		return
	};
	var isLeap=(((y%4==0) && (y%100>0)) || (y%400==0))? true: false;
	var wcnt=0;
	var wos=0;
	var d=new Date(y,m,1,0,0,0);
	var buf=txtCenter(mLabel[m]+' '+y,20)+'\n S  M Tu  W Th  F  S';
	if (weeks) {
		buf+='  week';
		var df=new Date(y,0,1,0,0,0);
		var yds=df.getDay();
		for (var mi=0; mi<m; mi++) yds+= ((mi==1) && (isLeap))? mLength[mi]+1 : mLength[mi];
		wos=yds%7;
		wcnt=Math.floor(yds/7)+1;
	};
	buf+='\n';
	var os=d.getDay();
	var l=mLength[m];
	if ((m==1) && (isLeap)) l++;
	for (var i=0; i<os; i++) buf+='   ';
	for (var i=1; i<=l; i++) {
		var s= (i<10)? ' ': '';
		s+=i;
		if ((i+os)%7==0) {
			buf+=s;
			if (weeks) {
				var ws=(wcnt<10)? ' '+wcnt:wcnt;
				buf+='   '+ws;
				wcnt++
			};
			buf+='\n';
		}
		else buf+=s+' ';
		if ((weeks) && (i==l) && ((i+os)%7>0)) {
			var ii=i+os;
			var ss='';
			while (ii%7>0) {
				ss+='   ';
				ii++
			};
			var ws=(wcnt<10)? ' '+wcnt:wcnt;
			buf+='  '+ss+ws;
		}
	};
	krnlFOut(env.stdout, buf+'\n');
}

function commandMail(env) {
	var args=env.args;
	var to=conf_defaultmail;
	if (args.length==2) to=args[1]
	else if (args.length>2) {
		krnlFOut(env.stderr,'usage: '+args[0]+' [<user@host>] - to many arguments');
		return
	};
	var os1=to.indexOf('@');
	var os2=to.indexOf('.',Math.max(0,os1));
	if ((os1<1) || (os2<0)) {
		krnlFOut(env.stderr,'usage: '+args[0]+' [<user@host>] - illegal address');
		return
	};
	krnlFOut(env.stdout,'opening mail-client for "'+to+'".');
	self.location.href='mailto:'+to
}

function commandBrowse(env) {
	var args=env.args;
	var url=conf_defaulturl;
	var a=1;
	var n=true; // open in new window!
	if (args[1]=='-n') {
		a++;
		n=true
	};
	if (args.length==a+1) {
		url=args[a];
		if (url.charAt(0)=='-') {
			krnlFOut(env.stderr,'usage: '+args[0]+' [-n] [<url>] - illegal option');
			return
		}
	}
	else if (args.length>a) {
		krnlFOut(env.stderr,'usage: '+args[0]+' [-n] [<url>] - to many arguments');
		return
	};
	if ((url.indexOf('http://')!=0) && (url.indexOf('https://')!=0) && (url.indexOf('ftp://')!=0) && (url.indexOf('ftps://')!=0) && (url.indexOf('file:')!=0) && (url.indexOf('mailto:')!=0)) url='http://'+url;
	if (n) {
		krnlFOut(env.stdout,'opening url "'+url+'" in new browser window.');
		var w=window.open(url);
		if (window.focus) w.focus();
	}
	else {
		if (confirm('Sure to open the URL "'+url+'" in the same window?')) {
			krnlFOut(env.stdout,'opening url "'+url+'".');
			self.location.href=url
		}
		else {
			krnlFOut(env.stdout,'cancled by user. use -n to open an address in a new window.')
		}
	}
}

function commandSplitScreen(env) {
	var args=env.args;
	var split=false;
	if (args.length==2) {
		if (args[1]=='on') {
			split=true;
		}
		else if (args[1]!='off') {
			krnlFOut(env.stderr,'usage: '+args[0]+' on|off  - illegal argument');
			return
		}
	}
	else {
		krnlFOut(env.stderr,'usage: '+args[0]+' on|off');
		return
	};
	cnslClear();
	if (split) {
		cnslType('split mode on',1); newLine();
		cnslTypeAt(conf_rows-2,0,'--------------------------------------------------------------------------------');
		cnslTypeAt(conf_rows-1,0,'JS/UIX by mass:werk. type "splitmode off" or "clear" to return to normal mode.');
		cnslMaxLines=conf_rows-2
	}
	else  {
		krnlFOut(env.stdout,'split mode off',1)
	}
}

function commandInfo(env) {
	cnslClear();
	krnlFOut(env.stdout,[
		'%+r Site Information %-r',
		'              JS/UIX by mass:werk - http://www.masswerk.at%n'
		],1);
}

function commandFeatures(env) {
	env.stdin=new VfsFileHandle(new VfsFile('p',[
		'%+r System Features %-r',
		os_greeting,
		' by mass:werk - media environments; (c) N.Landsteiner <http://www.masswerk.at>',
		' ',
		' JS/UIX is a virtual terminal and UN*X-like operating system for web browsers.',
		' It is written completely in JavaScript using DHTML for the display.',
		' The current version is v0.46 (Feb. 2007).',
		' ',
		' ',
		'%+uFeatures%-u:',
		' ',
		'     * virtual machine and operating system with:',
		'     * keyboard input supporting US-ASCII charset',
		'     * multi-line input and output, line-editing, insert mode',
		'     * input modes (getChar, cooked, raw mode)',
		'     * scrolling & cursor movements',
		'     * overlapping type styles (plain, %+rreverse%-r, %+uunderline%-u, %+iitalics%-i, %+sstrike%-s)',
		'     * window splitting (e.g. reserved status line)',
		'     * shell (sh alike) with',
		'       - command parsing and interpretation',
		'         supports quoting with backslash, single- and double-quotes, backticks',
		'       - variables and aliases with interpolation',
		'       - positional parameters',
		'       - command path (configurable commands)',
		'       - simple shell-scripts (e.g. initialization via /etc/profile)',
		'       - command history (cursor up/down)',
		'       - output redirection (>, >>), pipes (|)',
		'     * virtual file-system with permissions, users & groups',
		'     * filehandles, STDIN/STDOUT/STDERR streaming',
		'     * environment- and process-management with fork, subshells, pipes',
		'     * cooperative multitasking',
		'     * man-system',
		'     * vi - visual editor',
		'     * export/backup and import of home-directory for intersession oparibility.',
		'     * web and mail launch (external)',
		'     * compatibility for all major browsers',
		'       (e.g. Netscape 4+, MS IE 4+, DOM-aware browsers as Mozilla.)',
		' ',
		'%+uTo Do%-u:',
		' ',
		'     * shell globbing ',
		'     * some more commands (e.g. grep, egrep ...)',
		'     * some shell features (e.g. input redirection)',
		'     * complex shell scripts (control structures and clauses)',
		'     * flock / semaphores',
		'     * %+icould be:%-i interface for remote tasks via CGI',
		' ',
		'%+uWhat For?%-u',
		' ',
		' First of all, because it\'s possible.',
		' Second this could well be the basis for some fail-safe remote-job-systems',
		'needing a local environment for command parsing, interpretation and/or exe-',
		'cution. Think of \'rlogin\' to a remote host (via a CGI-process) for an example.',
		' ',
		'LEGAL',
		'This system and its applications are built entirely from scratch and subject to',
		'an all black-box-type re-engeering. I state not to have known any line of code',
		'of any UN*X-type system (e.g. AT&T/SCO-UNIX, AIX, HPUIX, SunOS, BSD, Darwin,',
		'Irix, Linux, Minix, GNU, etc) or any of its applications. This implementation:',
		'All rights reserved, (c) 2003, N. Landsteiner, mass:werk - media environments.',
		' '
	]));
	env.stdin.close();
	env.args=['more'];
	commandMore(env)
}

function commandApropos(env) {
	var args=env.args;
	if (args.length==1) {
		krnlFOut(env.stderr,'usage: '+args[0]+' <command> - no argument')
		return
	};
	var cmd=args[1];
	if ((manPages[cmd]) && (manPages[cmd].content) && (manPages[cmd].content.apropos)) {
		krnlFOut(env.stdout,manPages[cmd].content.apropos)
	}
	else {
		krnlFOut(env.stderr,'no entry found for "'+cmd+'".')
	}
}

function commandMan(env) {
	var args=env.args;
	if (args.length==1) {
		krnlFOut(env.stderr,'usage: '+args[0]+' <command> - no argument')
		return
	};
	var cmd=args[1];
	var opt=krnlGetOpts(args,1);
	if (krnlTestOpts(opt,'p')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	if (opt.p) {
		krnlFOut(env.stderr,'opening new window with full list ...');
		manPrintAll()
	}
	else if (manPages[cmd]) {
		var fh=(env.stdin)? env.stdin : new VfsFileHandle(new VfsFile('p',[]));
		//if (env.stdout) fh=env.stdout;
		//else {
		//	fh=new VfsFileHandle(new VfsFile('p',[]));
		//	env.pager=true
		//};
		var mc=manPages[cmd].content;
		krnlFOut(fh,'%+uSynopsis%-u:',1);
		if (mc.synopsis) krnlFOut(fh,mc.synopsis+'\n',1);
		//krnlFOut(fh,'%+uDescription%-u:',1);
		if (mc.description) {
			krnlFOut(fh,mc.description,1);
		};
		if (mc.link) {
			krnlFOut(fh,'=> '+mc.link,1);
			env.stdin=fh;
			env.args=['man',mc.link];
			commandMan(env);
			return
		};
		if (mc.arguments) {
			krnlFOut(fh,'\n%+uArguments%-u:',1);
			var ofs=0;
			for (var i=0; i<mc.arguments.length; i+=2) ofs=Math.max(ofs,mc.arguments[i].length);
			for (var i=0; i<mc.arguments.length; i+=2) {
				var arg=mc.arguments[i];
				var s='    '+arg+'  ';
				for (var k=arg.length; k<ofs; k++) s+=' ';
				var lines=mc.arguments[i+1].split('\n');
				for (var n=0; n<lines.length; n++) {
					if (n>0) {
						for (var m=0; m<ofs+6; m++) s+=' ';
					};
					s+=lines[n];
					if (n<lines.length-1) s+='\n';
				};
				krnlFOut(fh,s,1)
			}
		};
		if (mc.options) {
			krnlFOut(fh,'\n%+uOptions%-u:',1);
			var ofs=0;
			for (var i=0; i<mc.options.length; i+=2) ofs=Math.max(ofs,mc.options[i].length);
			for (var i=0; i<mc.options.length; i+=2) {
				var opt=mc.options[i];
				var s='    '+opt+'  ';
				for (var k=opt.length; k<ofs; k++) s+=' ';
				var lines=mc.options[i+1].split('\n');
				for (var n=0; n<lines.length; n++) {
					if (n>0) {
						for (var m=0; m<ofs+6; m++) s+=' ';
					};
					s+=lines[n];
					if (n<lines.length-1) s+='\n';
				};
				krnlFOut(fh,s,1)
			}
		};
		//if (env.pager) {
			//env.stdout=null;
			fh.close();
			env.stdin=fh;
			env.args=['more'];
			commandMore(env)
		//}
	}
	else if (usrALIAS[cmd]) {
		var s=usrALIAS[cmd];
		var cs='';
		for (var i=0; i<s.length; i++) {
			var ch=s.charAt(i);
			if (krnlWordChar(ch)) cs+=ch
			else break
		}
		krnlFOut(env.stderr,'"'+cmd+'" is an alias to "'+usrALIAS[cmd]+'".\n=> see "man '+cs+'" for more.',1)
	}
	else {
		krnlFOut(env.stderr,'no manual entry found for "'+cmd+'".')
	}
}

function manPrintAll() {
	var cmds=new Array();
	var cmdcols=0;
	for (var n in manPages) {
		cmds[cmds.length]=n;
		cmdcols=Math.max(cmdcols,n.length)
	};
	cmds.sort();
	cmdcols+=2;
	var s='Man Pages for '+os_version+'\n\n\n';
	s+='Contents:\n\n';
	for (var cnr=0; cnr<cmds.length; cnr++) {
		var cmd=cmds[cnr];
		if (cmd=='shell') continue;
		var mc=manPages[cmd].content;
		s+='  '+cmd;
		if (mc.apropos) {
			for (var i=cmd.length; i<=cmdcols; i++) s+=' ';
			s+=mc.apropos
		};
		s+='\n'
	};
	s+='\n'
	for (var cnr=0; cnr<cmds.length; cnr++) {
		var cmd=cmds[cnr];
		var mc=manPages[cmd].content;
		s+='\n\n'+cmd+'\n\n';
		s+='* Synopsis:\n';
		if (mc.synopsis) s+=txtStripStyles(mc.synopsis);
		s+='\n\n';
		//s+='* Description:\n';
		if (mc.description) {
			s+=txtStripStyles(mc.description)+'\n';
		};
		if (mc.link) {
			s+='\n=> see "'+mc.link+'".\n';
			continue
		};
		if (mc.arguments) {
			s+='\n* Arguments:\n';
			var ofs=0;
			for (var i=0; i<mc.arguments.length; i+=2) ofs=Math.max(ofs,mc.arguments[i].length);
			for (var i=0; i<mc.arguments.length; i+=2) {
				var arg=mc.arguments[i];
				var sl='    '+arg+'  ';
				for (var k=arg.length; k<ofs; k++) sl+=' ';
				var lines=mc.arguments[i+1].split('\n');
				for (var n=0; n<lines.length; n++) {
					if (n>0) {
						for (var m=0; m<ofs+6; m++) sl+=' ';
					};
					sl+=txtStripStyles(lines[n])+'\n'
				};
				s+=sl
			}
		};
		if (mc.options) {
			s+='\n* Options:\n';
			var ofs=0;
			for (var i=0; i<mc.options.length; i+=2) ofs=Math.max(ofs,mc.options[i].length);
			for (var i=0; i<mc.options.length; i+=2) {
				var opt=mc.options[i];
				var sl='    '+opt+'  ';
				for (var k=opt.length; k<ofs; k++) sl+=' ';
				var lines=mc.options[i+1].split('\n');
				for (var n=0; n<lines.length; n++) {
					if (n>0) {
						for (var m=0; m<ofs+6; m++) sl+=' ';
					};
					sl+=txtStripStyles(lines[n])+'\n'
				};
				s+=sl
			}
		}
	};
	s+='\n\n(c) mass:werk 2003; <http://www.masswerk.at>';
	var w=window.open();
	w.document.write('<xmp>');
	w.document.write(s);
	w.document.write('<\/xmp>');
	w.document.close();
	if (window.focus) w.focus();
}

function commandLs(env) {
	var dir=new Array();
	var a=1;
	var opt=krnlGetOpts(env.args,1);
	if (opt.length>0) a+=opt.length;
	if (krnlTestOpts(opt,'aCFilL')<0) {
		krnlFOut(env.stderr,'illegal option - use "./<filename>" for files of "-*".');
		return
	};
	var dname=(env.args[a])? vfsGetPath(env.args[a],env.cwd) : env.cwd;
	var dfile=vfsOpen(dname,4);
	if (dfile==0) {
		krnlFOut(env.stderr,dname+': no such file or directory.');
		return
	}
	else if (dfile<0) {
		krnlFOut(env.stderr,dname+': permission denied.');
		return
	}
	else if (dfile.kind!='d') {
		dfile=vfsGetParent(dname);
		dir=[vfsBasename(dname)];
		opt.a=1
	}
	else {
		dir=vfsDirList(dfile)
	};
	var l=0;
	var so='';
	for (var i=0; i<dir.length; i++) {
		var n=dir[i];
		if ((n.charAt(0)=='.') && (opt.a==null)) continue;
		var ff;
		if (n=='.') ff=dfile
		else if (n=='..') {
			ff=vfsGetParent(dname)
			if (ff<=0) continue
		}
		else ff=dfile.lines[n];
		if (opt.l) {
			if (ff.kind=='d') so+='d'
			else if (ff.kind=='l') so+='l'
			else so+='-';
			if (ff.mode) {
				var m=ff.mode;
				var ma=new Array();
				for (var mi=0; mi<4; mi++) {
					ma[mi]=m&7;
					m>>=3
				};
				for (var mi=2; mi>=0; mi--) {
					so+= (ma[mi]&4)? 'r':'-';
					so+= (ma[mi]&2)? 'w':'-';
					if (mi==0) {
						if (ma[3]&1) {
							so+= (ma[mi]&1)? 't':'T';
						}
						else {
							so+= (ma[mi]&1)? 'x':'-';
						}
					}
					else so+= (ma[mi]&1)? 'x':'-';
				}
			}
			else so+='---------';
			so+='  ';
			so+=(ff.icnt)? ff.icnt:'?';
			var fo=(ff.owner!=null)? krnlUIDs[ff.owner] : 'unknown';
			var fg=(ff.group!=null)? krnlGIDs[ff.group] : 'unknown';
			while (fo.length<8) fo+=' ';
			while (fg.length<8) fg+=' ';
			so+='  '+fo+'  '+fg+'  ';
			if (ff.kind=='d') so+='--------  '
			else if (ff.kind=='b') so+='bin/n.a.  '
			else so+=txtFillLeft(vfsGetSize(ff),8)+'  ';
			so+= vfsGetMdate(ff) +'  '+n;
			if (i<dir.length-1) so+='\n';
		}
		else {
			if (opt.F) {
				if (ff.kind=='d') n+='/'
				else if ((ff.kind=='b') || (ff.mode&0111)) n+='*'
				else if (ff.kind=='l') n+='@';
			};
			if (opt.i) n+='    '+ ff.inode;
			if ((opt.L) || (((env.stdout) || (opt.i)) && (!opt.C))) {
				so+=n;
				if (i<dir.length-1) so+='\n';
				continue
			};
			var s='';
			if (l>0) {
				s=' ';
				for (var k=(l+2)%12; k<12; k++) s+=' ';
			};
			l+=n.length+s.length;
			if (l>=conf_cols) {
				so+='\n';
				l=n.length;
				s=''
			};
			so+=s+n
		}
	};
	krnlFOut(env.stdout,so)
}

function commandTouch(env) {
	var files=new Array();
	if (env.stdin) {
		for (var i=0; i<env.stdin.lines.length; i++) files[files.length]=vfsGetPath(env.stdin.lines[i],env.cwd);
	};
	for (var i=1; i<env.args.length; i++) files[files.length]=vfsGetPath(env.args[i],env.cwd);
	for (var n=0; n<files.length; n++) {
		var fn=files[n];
		if (fn=='') continue;
		var f=vfsOpen(fn,2);
		if (f<0) krnlFOut(env.stderr,fn+': permission denied.')
		else if (f==0) {
			f=vfsCreate(fn,'f',0660);
			if (f<0) krnlFOut(env.stderr,fn+': permission denied.')
			else if (f==0) krnlFOut(env.stderr,fn+': no such directory '+vfsDirname(fn));
		}
		else f.touch()
	}
}

function commandPs(env) {
	var buf=new Array();
	buf[buf.length]=' PID   COMMAND';
	buf[buf.length]='---------------';
	for (var i=0; i<krnlPIDs.length; i++) {
		if (krnlPIDs[i]) {
			s=' '+i;
			if (i<10) s+=' ';
			if (i<100) s+=' ';
			if (i<1000) s+=' ';
			s+='  '+krnlPIDs[i].id;
			buf[buf.length]=s
		}
	};
	krnlFOut(env.stdout, buf);
}

function commandWc(env) {
	var l=0;
	var w=0;
	var c=0;
	var fh=null;
	var a=1;
	var opt=krnlGetOpts(env.args,1);
	if (krnlTestOpts(opt,'clw')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	if (opt.length>0) a+=opt.length
	else {
		opt.l=1;
		opt.c=1;
		opt.w=1
	};
	if (env.stdin) fh=env.stdin
	else if (env.args[a]) {
		var fn=vfsGetPath(env.args[a],env.cwd);
		var f=vfsOpen(fn,4);
		if (f<0) {
			krnlFOut(env.stderr,fn+': permission denied.');
			return
		}
		if (f==0) {
			krnlFOut(env.stderr,env.args[a]+': file not found.');
			return
		}
		else if (f) fh=new VfsFileHandle(f);
	};
	if (fh!=null) {
		var ldscrp=fh.readLine();
		while (ldscrp[0]>=0) {
			if (opt.l) l++;
			if (opt.c) c+=ldscrp[1].length+1;
			if (opt.w) {
				var word=false;
				var ln=ldscrp[1];
				for (var i=0; i<ln.length; i++) {
					if (ln.charCodeAt(i)>32) {
						if (!word) {
							word=true;
							w++
						}
					}
					else if (word) {
						word=false
					}
				}
			};
			ldscrp=fh.readLine();
		}
	};
	var s='';
	if ((opt.l) && (opt.c) && (opt.w)) {
		s=txtFillLeft(l,8)+' '+txtFillLeft(w,7)+' '+txtFillLeft(c,7)
	}
	else {
		if (opt.l) {
			if (s) s+=' ';
			s+=l
		};
		if (opt.w) {
			if (s) s+=' ';
			s+=w
		};
		if (opt.c) {
			if (s) s+=' ';
			s+=c
		}
	};
	//if (env.stdin) s+='  Total'
	if (env.args[a]) s+='  '+env.args[a];
	krnlFOut(env.stdout,s)
}

function commandCat(env) {
	var fh=null;
	var a=1;
	var buf=new Array();
	if (env.stdin) {
		fh=env.stdin
	}
	else if (env.args[1]) {
		var f=vfsOpen(vfsGetPath(env.args[1],env.cwd),4);
		if (f<0) {
			krnlFOut(env.stderr,vfsGetPath(env.args[1],env.cwd)+': permission denied.');
			return
		}
		else if (typeof f=='object') fh=new VfsFileHandle(f);
		a++
	};
	while (fh) {
		var ldscrp=fh.readLine();
		while (ldscrp[0]>=0) {
			buf[buf.length]=ldscrp[1];
			ldscrp=fh.readLine();
		};
		fh=null;
		if (env.args[a]) {
			var f=vfsOpen(vfsGetPath(env.args[a],env.cwd),4);
			if (f<0) {
				krnlFOut(env.stderr,vfsGetPath(env.args[a],env.cwd)+': permission denied.');
				return
			}
			else if (typeof f=='object') fh=new VfsFileHandle(f);
			a++
		}
	};
	krnlFOut(env.stdout,buf)
}

function commandPr(env) {
	var fh=null;
	var a=1;
	var lines=new Array();
	if (env.stdin) {
		fh=env.stdin
	}
	else if (env.args[1]) {
		var f=vfsOpen(vfsGetPath(env.args[1],env.cwd),4);
		if (f<0) {
			krnlFOut(env.stderr,vfsGetPath(env.args[1],env.cwd)+': permission denied.');
			return
		}
		else if (typeof f=='object') fh=new VfsFileHandle(f);
		a++
	};
	while (fh) {
		var ldscrp=fh.readLine();
		while (ldscrp[0]>=0) {
			lines[lines.length]=ldscrp[1];
			ldscrp=fh.readLine();
		};
		fh=null;
		if (env.args[a]) {
			var f=vfsOpen(vfsGetPath(env.args[a],env.cwd),4);
			if (f<0) {
				krnlFOut(env.stderr,vfsGetPath(env.args[a],env.cwd)+': permission denied.');
				return
			}
			else if (typeof f=='object') fh=new VfsFileHandle(f);
			a++
		}
	};
	var w=window.open();
	w.document.open();
	w.document.write('<xmp>');
	for (var i=0; i<lines.length; i++) w.document.write(txtStripStyles(lines[i])+'\n');
	w.document.write('<\/xmp>');
	w.document.close();
}

function commandMore(env) {
	if (env.status=='') {
		var fh=null;
		var a=1;
		env.more=new Array();
		if (env.stdin) {
			fh=env.stdin
		}
		else if (env.args[1]) {
			var f=vfsOpen(vfsGetPath(env.args[1],env.cwd),4);
			if (f<0) {
				krnlFOut(env.stderr,vfsGetPath(env.args[1],env.cwd)+': permission denied.');
				return
			}
			else if (typeof f=='object') fh=new VfsFileHandle(f);
			a++
		};
		while (fh) {
			var ldscrp=fh.readLine();
			while (ldscrp[0]>=0) {
				env.more[env.more.length]=ldscrp[1];
				ldscrp=fh.readLine();
			};
			fh=null;
			if (env.args[a]) {
				var f=vfsOpen(vfsGetPath(env.args[a],env.cwd),4);
				if (f<0) {
					krnlFOut(env.stderr,vfsGetPath(env.args[a],env.cwd)+': permission denied.');
					return
				}
				else if (typeof f=='object') fh=new VfsFileHandle(f);
				a++
			}
		};
		env.line=0;
		krnlTtyChar=32
	};
	if (env.stdout) {
		for (var i=0; i<env.more.length; i++) krnlFOut(env.stdout,txtStripStyles(env.more[i]));
	}
	else if (env.line<env.more.length) {
		if (krnlTtyChar==32) {
			var l1=env.line;
			if ((env.line) || (env.more.length-(env.line+t_r)>=cnslMaxLines-2)) cnslClear();
			var a=env.line;
			var b=Math.min(a+cnslMaxLines-1,env.more.length);
			//for (env.line=a; env.line<b; env.line++) krnlFOut(null,env.more[env.line],1);
			var buf=new Array();
			for (env.line=a; env.line<b; env.line++) buf[buf.length]=env.more[env.line];
			krnlFOut(null,buf,1);
			if (env.line<env.more.length) cnslWrite('%+r -- MORE -- %-r (Type: space to continue, \'q\' to quit)',1);
		};
		if ((env.line<env.more.length) && (krnlTtyChar!=113)) {
			env.bin='commandMore';
			env.status='wait';
			env.wantChar=true;
			return
		}
		else if (krnlTtyChar==113) {
			t_c=0;
			term[t_r]=cnslGetRowArrray(conf_cols,0);
			termStyle[t_r]=cnslGetRowArrray(conf_cols,0);
			termDisplay(t_r)
		};
	};
	env.status='';
	env.wantChar=false;
	krnlTtyChar=0
}

function commandCd(env,evaluate) {
	// secundary cd for current subprocess only
	var cwd1=env.cwd;
	shellCmdCd(env,env.args);
	if (evaluate) {
		return vfsGetPath(env.args[1],env.pwd)
	}
	else return null;
}

function commandStty(env) {
	if (env.args.length>1) {
		var opt=env.args[1];
		if (opt.length) {
			var onoff=true;
			if (opt.charAt(0)=='-') {
				onoff=false;
				opt=opt.substring(1);
			};
			if (opt=='blink') cnslBlinkmode=onoff
			else if (opt=='block') cnslBlockmode=onoff
			else if (opt=='smart') cnslSmartmode=onoff
			else if (opt=='rows') {
				if (onoff) {
					var rl=parseInt(env.args[2]);
					if ((isNaN(rl)==false) && (rl<=conf_rows)) {
						cnslClear();
						cnslMaxLines=rl
					}
				}
				else {
					cnslMaxLines=conf_rows;
					cnslClear()
				}
			}
			else if ((opt=='sane') && (onoff)) {
				cnslMaxLines=conf_rows;
				cnslBlinkmode=true;
				cnslBlockmode=true;
				cnslSmartmode=true;
				cnslClear()
			}
			else if (((opt=='a') || (opt=='g')) && (!onoff)) {
				var oa=new Array();
				var buf=new Array();
				oa['blink']=(cnslBlinkmode)? 1:0;
				oa['block']=(cnslBlockmode)? 1:0;
				oa['smart']=(cnslSmartmode)? 1:0;
				oa['rows']=cnslMaxLines;
				var keys=new Array();
				for (var k in oa) keys[keys.length]=k;
				keys.sort();
				if (opt=='a') {
					for (var i=0; i<keys.length; i++) buf[buf.length]=keys[i]+' '+oa[keys[i]];
				}
				else {
					var l=0;
					for (var i=0; i<keys.length; i++) {
						if (keys[i].length>l) l=keys[i].length;
					};
					l+=2;
					for (var i=0; i<keys.length; i++) {
						var s=keys[i];
						for (var b=keys[i].length; b<l; b++) s+=' ';
						buf[buf.length]=s+oa[keys[i]];
					}
				};
				krnlFOut(term.stdout, buf)
			}
			else {
				krnlFOut(env.stderr,'illegal option.')
			}
		}
	}
}


function commandLogname(env) {
	krnlFOut(env.stdout,usrVAR.USER)
}

function commandUname(env) {
	krnlFOut(env.stdout,os_version)
}

function commandWhich(env) {
	var cmd=env.args[1];
	var which='';
	if (cmd) {
		var cmdpath=(cmd.indexOf('/')>=0)? [env.cwd]:usrVAR.PATH.split(' ');
		for (var pi=0; pi<cmdpath.length; pi++) {
			var path=vfsGetPath(cmd, cmdpath[pi]);
			var cmdf=vfsOpen(path,1);
			if ((typeof cmdf=='object') && (cmdf.lines[0]) && ((cmdf.kind=='b') || (cmdf.kind=='f'))) {
				which=path;
				break
			}
		}
	};
	krnlFOut(env.stdout,which)
}

function commandMkdir(env) {
	var dirs=new Array();
	if (env.stdin) {
		ldscrp=env.stdin.readLine();
		while (ldscrp[0]>=0) {
			dirs[dirs.length]=vfsGetPath(ldscrp[1],env.cwd);
			ldscrp=env.stdin.readLine();
		}
	};
	for (var a=1; a<env.args.length; a++) {
		dirs[dirs.length]=vfsGetPath(env.args[a],env.cwd);
	};
	for (var i=0; i<dirs.length; i++) {
		if (dirs[i]!='') {
			var d=vfsCreate(dirs[i],'d',0750);
			if (d==-3) {
				krnlFOut(env.stderr,dirs[i]+': file already exists.')
			}
			else if (d<0) {
				krnlFOut(env.stderr,dirs[i]+': permission denied.')
			}
		}
	}
}

function commandRmdir(env) {
	var dirs=new Array();
	var opt=krnlGetOpts(env.args,1);
	if (krnlTestOpts(opt,'i')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	var verbous=(opt.i)? false:true;
	if (env.stdin) {
		ldscrp=env.stdin.readLine();
		while (ldscrp[0]>=0) {
			dirs[dirs.length]=vfsGetPath(ldscrp[1],env.cwd);
			ldscrp=env.stdin.readLine();
		}
	};
	for (var a=1+opt.length; a<env.args.length; a++) {
		dirs[dirs.length]=vfsGetPath(env.args[a],env.cwd);
	};
	for (var i=0; i<dirs.length; i++) {
		if (dirs[i]!='') {
			var dn=dirs[i];
			var d=vfsOpen(dn);
			if (d<0) {
				if (verbous) krnlFOut(env.stderr,dn+': path permission denied.');
				continue
			}
			else if (d==0) {
				if (verbous) krnlFOut(env.stderr,dn+': directory not found.');
				continue
			}
			else if (d.kind!='d') {
				if (verbous) krnlFOut(env.stderr,dn+': is not a directory.');
				continue
			}
			else if (vfsGetSize(d)) {
				if (verbous) krnlFOut(env.stderr,dn+': directory not empty.');
				continue
			};
			if (vfsCheckInPath(env.cwd,d)) {
				if (verbous) krnlFOut(env.stderr,dn+'can\'t delete directory in current path.');
				continue
			};
			var st=vfsUnlink(dn);
			if (!st) {
				if (verbous) krnlFOut(env.stderr,dn+': permission denied.');
				continue
			}
		}
	}
}

function commandChmod(env) {
	var args=env.args;
	var a=1;
	var rec=false;
	var files=new Array();
	if ((args[1]) && (args[1].charAt(0)=='-')) {
		if (args[1]=='-R') {
			rec=true;
			a++
		}
		else {
			krnlFOut(env.stderr,'usage: '+args[0]+' [-R] <mode> <filelist> -- illegal option.');
			return
		}
	};
	if (args.length<a+2) {
		krnlFOut(env.stderr,'usage: '+args[0]+' [-R] <mode> <filelist>');
		return
	};
	var mstr=args[a];
	for (var i=a+1; i<args.length; i++) {
		var fn=vfsGetPath(args[i],env.cwd);
		var f=vfsGetFile(fn);
		if (f<0) {
			krnlFOut(env.stderr,fn+': no search permission.');
			continue
		}
		else if (f==0) {
			krnlFOut(env.stderr,fn+': file not found.');
			continue
		}
		else if (f.owner!=usrVAR.UID) {
			krnlFOut(env.stderr,fn+': not owner.');
			continue
		}
		else files[files.length]=f;
		if ((f.kind=='d') && (rec)) commandChmodLoop(files, fn);
	}
	var ok=false;
	if (mstr) {
		var m=parseInt(mstr,8);
		if (isNaN(m)==false) {
			for (var i=0; i<files.length; i++) files[i].mode=m;
			ok=true
		}
		else if ((mstr.indexOf('+')>0) || (mstr.indexOf('-')>0)) {
			var who=new Array();
			var add=false;
			var ormask=0;
			var andmask=07777;
			var sm=0;
			var whomask={u:0100,g:010,o:1};
			var modemask={r:4,w:2,x:1,s:0};
			for (var k=0; k<mstr.length; k++) {
				var ch=mstr.charAt(k);
				if ((sm<2) && ((ch=='u') || (ch=='g') || (ch=='o') || (ch=='a'))) {
					sm=1;
					who[who.length]=ch
				}
				else if ((sm==1) && ((ch=='+') || (ch=='-'))) {
					sm=2;
					add=(ch=='+');
				}
				else if ((sm==2) && ((ch=='r') || (ch=='w') || (ch=='x') || (ch=='s'))) {
					for (var w=0; w<who.length; w++) {
						for (var wm in whomask) {
							if ((who[w]=='a') || (who[w]==wm)) {
								var mm=((ch=='s') && ((who[w]=='o') || (who[w]=='a')))? 01000:modemask[ch]*whomask[wm];
								if (add) ormask|=mm
								else andmask&=07777^mm
							}
						}
					};
					if (k==mstr.length-1) ok=true;
				}
			};
			if (ok) {
				for (var i=0; i<files.length; i++) files[i].mode= (files[i].mode&andmask)|ormask;
			}
		}
		else if (mstr.indexOf('=')>0) {
			var who=new Array();
			var who2='';
			var m=0;
			var sm=0;
			var whomask={u:0100,g:010,o:1};
			for (var k=0; k<mstr.length; k++) {
				var ch=mstr.charAt(k);
				if ((sm<2) && ((ch=='u') || (ch=='g') || (ch=='o') || (ch=='a'))) {
					sm=1;
					who[who.length]=ch
				}
				else if ((sm==1) && (ch=='=')) {
					sm=2
				}
				else if ((sm==2) && ((ch=='u') || (ch=='g') || (ch=='o'))) {
					sm=3;
					who2=ch;
					if (k==mstr.length-1) ok=true;
				}
			};
			if (ok) {
				for (var i=0; i<files.length; i++) {
					var f=files[i];
					var m;
					if (who2=='o') m=f.mode&7
					else if (who2=='g') m=(f.mode>>3)&7
					else if (who2=='u') m=(f.mode>>6)&7;
					for (var w=0; w<who.length; w++) {
						for (var wm in whomask) {
							if (who[w]==who2) continue;
							if ((who[w]=='a') || (who[w]==wm)) {
								f.mode= (f.mode & (07777^(7*whomask[wm]))) | whomask[wm]*m;
							}
						}
					}
				}
			}
		};
		if (!ok) {
			krnlFOut(env.stderr,'usage: '+args[0]+' [-R] <mode> <filelist> -- syntax error:');
			krnlFOut(env.stderr,'<mode> must be octal number or {u|g|o|a}(+|-){w|r|x|s} or {u|g|o|a}=(o|u|g).');
			return
		};
	};
	if (!ok) {
		krnlFOut(env.stderr,'usage: '+args[0]+' [-R] <mode> <filelist>');
		return
	}
}

function commandChmodLoop(files, dn) {
	var d=vfsGetFile(dn);
	var flist=[];
	if (typeof d=='object') flist=vfsDirList(f);
	for (var i=0; i<flist.length; i++) {
		if ((flist[i]=='.') || (flist[i]=='.')) continue;
		var fn=vfsGetPath(flist[i],dn);
		var f=vfsGetFile(fn);
		if (f<0) {
			krnlFOut(env.stderr,fn+': no search permission.');
			continue
		}
		else if (f==0) {
			krnlFOut(env.stderr,fn+': file not found.');
			continue
		}
		else if (f.owner!=usrVAR.UID) {
			krnlFOut(env.stderr,fn+': not owner.');
			continue
		}
		else files[files.length]=f;
		if ((f.kind=='d') && (rec)) commandChmodLoop(files, dn);
	}
}

function commandRm(env) {
	var files=new Array();
	var opt=krnlGetOpts(env.args,1);
	if (krnlTestOpts(opt,'ir')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	var verbous=(opt.i)? false:true;
	if (env.stdin) {
		ldscrp=env.stdin.readLine();
		while (ldscrp[0]>=0) {
			if (ldscrp[0]>0) files[files.length]=ldscrp[1];
			ldscrp=env.stdin.readLine();
		}
	};
	if (env.stdin) {
		ldscrp=env.stdin.readLine();
		while (ldscrp[0]>=0) {
			if (ldscrp[0]>0) files[files.length]=ldscrp[1];
			ldscrp=env.stdin.readLine();
		}
	};
	for (var a=1+opt.length; a<env.args.length; a++) {
		if (env.args[a]!='') files[files.length]=env.args[a];
	};
	if (files.length==0) {
		if (verbous) krnlFOut(env.stderr,'Usage: '+env.args[0]+' [-ri] <filename> {<filename>}');
		return
	}
	for (var i=0; i<files.length; i++) {
		var fn=vfsGetPath(files[i],env.cwd);
		while (fn.charAt(fn.length-1)=='/') fn=fn.substring(0,fn.length-1);
		var f= vfsGetFile(fn);
		if (f<=0) {
			if (verbous) krnlFOut(env.stderr,fn+': file not found.');
			return;
		};
		if (f.kind=='d') {
			if (!opt.r) {
				if (verbous) krnlFOut(env.stderr,fn+': can\'t delete a directory. use "rmdir" or "rm -r" in stead.');
				return
			}
			else if (vfsCheckInPath(env.cwd,f)) {
				if (verbous) krnlFOut(env.stderr,fn+': can\'t delete directory in current path.');
				return
			}
			else if (vfsCheckInPath(usrVAR.HOME,f)) {
				if (verbous) krnlFOut(env.stderr,fn+': can\'t delete directory in current home path.');
				return
			}
		};
		var r=vfsUnlink(fn);
		if (r<0) {
			if (verbous) krnlFOut(env.stderr,fn+': permission denied.');
			return
		}
	}
}

function commandCp(env) {
	var files=new Array();
	var f2='';
	var k2='';
	var opt=krnlGetOpts(env.args,1);
	if (krnlTestOpts(opt,'rpi')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	var verbous=(opt.i)? false:true;
	if (env.stdin) {
		ldscrp=env.stdin.readLine();
		while (ldscrp[0]>=0) {
			if (ldscrp[0]>0) files[files.length]=ldscrp[1];
			ldscrp=env.stdin.readLine();
		}
	};
	for (var a=1+opt.length; a<env.args.length; a++) {
		if (env.args[a]!='') files[files.length]=env.args[a];
	};
	if (files.length>=2) {
		f2=vfsGetPath(files[files.length-1],env.cwd);
		files.length--;
		var tgtf= vfsOpen(f2,2);
		if (tgtf<0) {
			if (verbous) krnlFOut(env.stderr,f2+': permission denied.');
			return
		}
		else if (typeof tgtf=='object') {
			if (tgtf.inode==krnlDevNull) return
			else if (tgtf.kind=='d') k2='d';
			else if (files.length>1) {
				if (verbous) {
					krnlFOut(env.stderr,f2+': must be directory - invalid file path.');
					krnlFOut(env.stderr,'Usage: '+env.args[0]+' [-irp] <sourcefile> {<sourcefile>} <targetfile>')
				};
				return
			}
			else k2='f';
		}
		else {
			var dn2=vfsDirname(f2);
			tgtf=vfsOpen(dn2,2);
			if (tgtf<0) {
				if (verbous) krnlFOut(env.stderr,dn2+': permission denied.');
				return
			}
			else if ((typeof tgtf=='object') && (tgtf.kind=='d')) {
				k2='f';
			}
			else {
				if (verbous) krnlFOut(env.stderr,dn2+': no such directory.');
				return
			}
		};
		for (var i=0; i<files.length; i++) commandCpLoop(env,files[i],f2,k2,opt.r,verbous,0,opt.p);
	}
	else {
		if (verbous) krnlFOut(env.stderr,'Usage: '+env.args[0]+' [-irp] <sourcefile> {<sourcefile>} <targetfile>')
	}
}

function commandCpLoop(env,f1,f2,k2,rec,verbous,moveonly,perm) {
	var fn1=vfsGetPath(f1,env.cwd);
	var srcf=vfsOpen(fn1,4);
	if (srcf<0) {
		if (verbous) krnlFOut(env.stderr,fn1+': permission denied.');
		return
	}
	else if (srcf==0) {
		if (verbous) krnlFOut(env.stderr,fn1+': file not found.');
		return
	}
	else {
		k1=(srcf.kind=='d')? 'd':'f';
	};
	var fn=(k2=='d')? f2+'/'+vfsBasename(fn1): f2;
	var devnull=((fn=='/dev/null') || (fn.indexOf('/dev/null/')==0));
	if ((devnull) && (!moveonly)) return;
	var f=vfsOpen(fn,2);
	if (f<0) {
		if (verbous) krnlFOut(env.stderr,fn+': permission denied.');
		return
	};
	if ((typeof f=='object') && (f.kind=='d') && ((moveonly) || (k1='f')) && (vfsGetSize(f)>0)) {
		if (verbous) krnlFOut(env.stderr,fn+': directory not empty.');
		return
	};
	if (moveonly) {
		if (vfsCheckInPath(env.cwd,srcf)) {
			if (verbous) krnlFOut(env.stderr,'can\'t move directory in current path.');
			return
		}
		else if (vfsCheckInPath(usrVAR.HOME,srcf)) {
			if (verbous) krnlFOut(env.stderr,'can\'t move directory in current home path.');
			return
		};
		var r=(devnull)? vfsUnlink(fn1) : vfsMove(fn1,fn);
		if (r<0) {
			if (verbous) {
				if ((devnull) || (r<-1)) krnlFOut(env.stderr,fn1+': permission denied.')
				else krnlFOut(env.stderr,fn+': permission denied.')
			}
		}
		else if (r==0) {
			if (verbous) krnlFOut(env.stderr,f2+':  invalid file path.');
		};
		return
	}
	else {
		var nf;
		var m;
		if (k1=='d') {
			if ((typeof f=='object') && (f.kind=='d') && (k1=='d')) {
				if (!vfsPermission(f,2)) {
					if (verbous) krnlFOut(env.stderr,f2+': permission denied.');
					return
				}
				else nf=f;
			}
			else {
				m=(perm)? srcf.mode:0750;
				nf=vfsCreate(fn,'d',m);
			}
		}
		else {
			m=(perm)? srcf.mode:0640;
			nf=vfsCreate(fn,'f',m);
		};
		if (nf<0) {
			if (verbous) krnlFOut(env.stderr,f2+': permission denied.');
			return
		}
		else if (!nf) {
			if (verbous) krnlFOut(env.stderr,f2+': invalid file path.');
			return
		};
		if (k1=='f') vfsFileCopy(srcf,nf)
		else if (rec) {
			for (var fi in srcf.lines) commandCpLoop(env,f1+'/'+fi,fn,'d',1,verbous,0,perm);
		}
	}
}

function commandMv(env) {
	var files=new Array();
	var f2='';
	var k2='';
	var opt=krnlGetOpts(env.args,1);
	if (krnlTestOpts(opt,'i')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	var verbous=(opt.i)? false:true;
	if (env.stdin) {
		ldscrp=env.stdin.readLine();
		while (ldscrp[0]>=0) {
			if (ldscrp[0]>0) files[files.length]=ldscrp[1];
			ldscrp=env.stdin.readLine();
		}
	};
	for (var a=1+opt.length; a<env.args.length; a++) {
		if (env.args[a]!='') files[files.length]=env.args[a];
	};
	if (files.length>=2) {
		f2=vfsGetPath(files[files.length-1],env.cwd);
		files.length--;
		var tgtf= vfsOpen(f2,2);
		if (tgtf<0) {
			if (verbous) krnlFOut(env.stderr,f2+': permission denied.');
			return
		}
		else if (typeof tgtf=='object') {
			if (tgtf.kind=='d') k2='d';
			else if (files.length>1) {
				if (verbous) {
					krnlFOut(env.stderr,f2+': must be directory - invalid file path.');
					krnlFOut(env.stderr,'Usage: '+env.args[0]+' [-i] <sourcefile> {<sourcefile>} <targetfile>')
				};
				return
			}
			else k2='f';
		}
		else {
			var dn2=vfsDirname(f2);
			tgtf=vfsOpen(dn2,2);
			if (tgtf<0) {
				if (verbous) krnlFOut(env.stderr,dn2+': permission denied.');
				return
			}
			else if ((typeof tgtf=='object') && (tgtf.kind=='d')) {
				k2='f';
			}
			else {
				if (verbous) krnlFOut(env.stderr,dn2+': no such directory.');
				return
			}
		};
		for (var i=0; i<files.length; i++) commandCpLoop(env,files[i],f2,k2,0,verbous,1,0);
	}
	else {
		if (verbous) krnlFOut(env.stderr,'Usage: '+env.args[0]+' [-i] <sourcefile> {<sourcefile>} <targetfile>')
	}
}

function commandSu(env) {
	if (env.status=='wait') {
		if (krnlTtyChar>32) {
			env.passwd+=String.fromCharCode(krnlTtyChar);
		}
		else if (krnlTtyChar==13) {
			cursorOff();
			newLine();
			if (krnlCrypt(env.passwd)==conf_rootpassskey) krnlAddUser(env.user)
			else krnlFOut(env.stderr,'Sorry.');
			env.status='';
			env.wantChar=false;
			krnlTtyChar=0
		};
		return
	};
	var user=env.args[1];
	if (user==null) user='root';
	for (var ofs=user.indexOf(' '); ofs>=0; ofs=user.indexOf(' ')) user=user.substring(0,ofs)+'_'+user.substring(ofs+1);
	var nameok=true;
	var nameok=((user!='') && (((user.charAt(0)>='A') && (user.charAt(0)<='Z')) || ((user.charAt(0)>='a') && (user.charAt(0)<='z'))));
	for (var i=1; i<user.length; i++) {
		if (!krnlWordChar(user.charAt(i))) {
			nameok=false;
			break
		}
	};
	if (user=='root') {
		env.bin='commandSu';
		env.status='wait';
		env.wantChar=true;
		cnslType('password: ');
		env.user='root';
		env.passwd='';
		cursorOn();
		return
	}
	else if ((user.toLowerCase()=='root') || user.toLowerCase()=='exit') {
		krnlFOut(env.stderr, 'Sorry - invalid user-id');
		return
	}
	if (nameok) {
		if (user.length>8) user=user.substring(0,8);
		krnlAddUser(user);
		usrVAR.USER=user;
		usrVAR.HOME='/home/'+user+'/';
		return
	};
	krnlFOut(env.stderr, 'Sorry - invalid user-id');
}

function cmdGetFDump(win) {
	win.document.forms.fdump.content.value=usrFDump;
	usrFDump=''
}

function cmdSetFDump(win) {
	var home=usrVAR.HOME;
	var s=win.document.forms.fdump.content.value;
	s=txtStringReplace('&gt;','>',s);
	s=txtStringReplace('&lt;','<',s);
	s=txtStringReplace('&amp;','&',s);
	var sl=s.split('\n');
	var li=0;
	var f=null;
	var ok=false;
	var files=new Array();
	var dirs=new Array();
	var start;
	for (start=0; start<sl.length; start++) {
		if (sl[li]=='<fdump>') {
			ok=true;
			break
		}
	};
	if (ok) {
		cnslType('found start tag, starting import ...');
		newLine();
		ok=false
	}
	else {
		cnslType('error: import abborted on missing start tag.');
		newLine();
		keyHandler({which:27});
		return
	};
	for (var li=start+1; li<sl.length; li++) {
		var l=sl[li];
		var k=l.charAt(0);
		if (((k=='d') || (k=='f') || (k=='b') || (k=='l')) && (l.charAt(1)==':')) {
			var o1=l.indexOf(' ');
			var fn=l.substring(2,o1);
			var fd=l.substring(o1+1);
			var y=parseInt(fd.substring(0,4),10);
			var m=parseInt(fd.substring(5,7),10);
			var d=parseInt(fd.substring(8,10),10);
			var hh=parseInt(fd.substring(11,13),10);
			var mm=parseInt(fd.substring(14,16),10);
			var ss=parseInt(fd.substring(17,19),10);
			var md=new Date(y,m-1,d,hh,mm,ss);
			var mx=fd.substring(21);
			var mode = (isNaN(parseInt(mx)))? '': parseInt(mx,8)&07777;
			if (k=='d') {
				dirs[dirs.length]=[fn,md,mode];
				f=null
			}
			else f=files[files.length]=[fn,md,[],k,mode];
		}
		else if (k=='>') {
			if (f) f[2][f[2].length]=l.substring(1);
		}
		else if (l.indexOf('</fdump>')==0) {
			ok=true;
			break
		}
		else {
			if ((f) && (f[2].length)) f[2][f[2].length-1]+='\n'+l.substring(1);
		}
	};
	if ((win) && (win.closed==false)) win.close();
	if (ok) {
		cnslType('imported data seems good, found end tag.')
		newLine();
		cnslType('found '+dirs.length+' directories, '+files.length+' files.');
		newLine();
		cnslType('mounting imported data ...');
		newLine();
	}
	else {
		cnslType('error: import abborted on missing end tag.');
		newLine();
		keyHandler({which:27});
		return
	};
	for (var i=0; i<dirs.length; i++) {
		var fn=vfsGetPath(dirs[i][0],home);
		var md=dirs[i][1];
		var mode=dirs[i][2];
		if (mode=='') mode=0750;
		var d=vfsGetFile(fn);
		if (typeof d=='object') {
			if (d.kind=='d') {
				cnslType('- dir  "'+fn+'" already exists, skipped.'); newLine()
			}
			else {
				cnslType('- dir  "'+fn+'" failed, file with same name already exists.'); newLine()
			}
		}
		else {
			d=vfsCreate(fn,'d',mode,md);
			if (typeof d=='object') {
				cnslType('- dir  "'+fn+'" created.'); newLine()
			}
			else {
				cnslType('- dir  "'+fn+'" failed.'); newLine()
			}
		}
	};
	for (var i=0; i<files.length; i++) {
		var fn=vfsGetPath(files[i][0],home);
		var md=files[i][1];
		var lines=files[i][2];
		var kind=files[i][3];
		var mode=files[i][4];
		if (mode=='') mode=0640;
		var f=vfsGetFile(fn);
		if (typeof f=='object') {
			if (f.kind=='d') {
				cnslType('- file "'+fn+'" failed, directory with same name already exists.'); newLine()
			}
			else {
				cnslType('- file "'+fn+'" already exists, skipped.'); newLine()
			}
		}
		else {
			f=vfsCreate(fn,kind,mode,md);
			if (typeof f=='object') {
				f.lines=lines;
				cnslType('- file "'+fn+'" created.'); newLine()
			}
			else {
				cnslType('- file "'+fn+'" failed.'); newLine()
			}
		}
	};
	cnslType('import completed.');
	newLine();
	keyHandler({which:27})
}

function commandHomeExport(env) {
	var d=vfsOpen(usrVAR.HOME,2);
	if (typeof d=='object') {
		usrFDump=cmdDirDump(d,'');
		if (usrFDump=='') {
			krnlFOut(env.stderr,'found no data to export in directory '+usrVAR.HOME);
			return
		};
		usrFDump=txtStringReplace('&','&amp;','<fdump>\n'+usrFDump+'</fdump>');
		usrFDump=txtStringReplace('>','&gt;',usrFDump);
		usrFDump=txtStringReplace('<','&lt;',usrFDump);
		var w=window.open();
		w.opener=self;
		var wd=w.document;
		wd.open();
		wd.write('<html><head><title>home export</title></head>\n<body onload="self.opener.cmdGetFDump(self);document.forms.fdump.content.select()"><p>copy the following lines for later re-import:<p><form name="fdump"><textarea name="content" wrap="virtual" rows="20" cols="83"></textarea><p><input type="button" value="close window" onclick="self.close()"></p></form>\n</body>\n</html>');
		wd.close()
	}
	else if (d==0) {
		krnlFOut(env.stderr,'can\'t export home directory.\n'+usrVAR.HOME+': permission denied.');
	}
	else {
		krnlFOut(env.stderr,'can\'t export home directory.\nno such directory: '+usrVAR.HOME);
	}
}

function commandHomeImport(env) {
	if (env.status=='') {
		cnslType('please insert file-dump in the opening form.'); newLine();
		cnslType('type "c" to abbort ...'); newLine();
		usrExWin=window.open();
		usrExWin.opener=self;
		var wd=usrExWin.document;
		wd.open();
		wd.write('<html><head><title>home import</title></head>\n<body onload="document.forms.fdump.content.select()"><p>insert home-dump and press &quot;import&quot;:<p><form name="fdump"><textarea name="content" wrap="virtual" rows="20" cols="83"></textarea><p><input type="button" value="import data" onclick="self.opener.cmdSetFDump(self)"></p>\n</form>\n</body>\n</html>');
		wd.close();
		env.bin='commandHomeImport';
		env.status='wait';
		env.wantChar=true;
	}
	else if (krnlTtyChar==99) {
		cnslType('import terminated by user.'); newLine();
		if ((usrExWin) && (usrExWin.closed==false)) usrExWin.close();
		env.status='';
		env.wantChar=false;
		krnlTtyChar=0
	}
	else if ((krnlTtyChar==27)) {
		env.status='';
		env.wantChar=false;
		krnlTtyChar=0
	}
	else {
		termImportCompleted=false;
		env.bin='commandHomeImport';
		env.status='wait';
		env.wantChar=true;
	}
}

function cmdDirDump(d,prefix) {
	if (prefix) prefix+='/';
	var s='';
	var files=new Array();
	var dirs=new Array();
	for (var i in d.lines) {
		if (d.lines[i].kind=='f') files[files.length]=i
		else if ((d.lines[i].kind=='d') || (d.lines[i].kind=='b') || (d.lines[i].kind=='l')) dirs[dirs.length]=i;
	};
	files.sort();
	for (var fi=0; fi<files.length; fi++) {
		if (files[fi].charAt(0)=='.') continue;
		var f=d.lines[files[fi]];
		var mstr=', 0'+((f.mode>>9)&7)+((f.mode>>6)&7)+((f.mode>>3)&7)+(f.mode&7);
		s+=d.lines[i].kind+':'+prefix+files[fi]+' '+vfsGetMdate(d)+mstr+'\n';
		for (var l=0; l<f.lines.length; l++) s+='>'+f.lines[l]+'\n';
	}
	dirs.sort();
	for (var di=0; di<dirs.length; di++) {
		var f=d.lines[dirs[di]];
		var mstr=', 0'+((d.mode>>9)&7)+((d.mode>>6)&7)+((d.mode>>3)&7)+(d.mode&7);
		s+='d:'+prefix+dirs[di]+' '+vfsGetMdate(f)+mstr+'\n';
	};
	for (var di=0; di<dirs.length; di++) s+=cmdDirDump(d.lines[dirs[di]],prefix+dirs[di]);
	return s
}

function commandJs(env) {
	var a=1;
	var opt=krnlGetOpts(env.args, 1);
	if (krnlTestOpts(opt,'elts')<0) {
		krnlFOut(env.stderr,'illegal option.');
		return
	};
	a+=opt.length;
	var vn=env.args[a];
	var vstring=vn;
	var vobj=null;
	if ((opt.l) || (opt.t) || (opt.s)) {
		if ((vn!=null) && ((vn.indexOf('.')>=0) || (vn.indexOf('[')>=0))) {
			var va1=vn.split('.');
			var va=new Array();
			var vt=new Array();
			for (var i=0; i<va1.length; i++) {
				if (va1[i]=='') continue;
				if (va1[i].indexOf('[')>=0) {
					var va2=va1[i].split('[');
					for (var k=0; k<va2.length; k++) {
						if (va2[k]=='') continue;
						if ((va2[k].length) && (va2[k].charAt(va2[k].length-1)==']')) va2[k]=va2[k].substring(0,va2[k].length-1);
						va[va.length]=va2[k];
						vt[vt.length]=(k==0)?'.':'['
					}
				}
				else {
					va[va.length]=va1[i];
					vt[vt.length]='.';
				}
			};
			var vobj=self;
			var vi=0;
			var vstring='self';
			while ((vobj!=null) && (vi<va.length)) {
				vstring+=(vt[vi]=='[')? '['+va[vi]+']' : '.'+va[vi];
				vobj=vobj[va[vi++]]
			}
		}
		else vobj=self[vn]
	};
	var ok=false
	if (opt.t) {
		var s=(vobj)? typeof vobj : 'undefined';
		if ((vobj!=null) && (typeof vobj=='object') && (vobj.constructor)) {
			var sc=''+vobj.constructor;
			var ofs1=sc.indexOf(' ');
			var ofs2=sc.indexOf('(');
			if ((ofs1>0) && (ofs2>0)) s+=' '+sc.substring(ofs1+1,ofs2);
		};
		krnlFOut(env.stdout,vstring+': '+s);
		ok=true
	};
	if (opt.l) {
		if (vobj==null) krnlFOut(env.stdout,'undefined')
		else if (typeof vobj=='object') {
			var s='';
			if (vobj.length) {
				for (var i=0; i<vobj.length; i++) {
					if (vobj[i]!=null) {
						if (s!='') s+='\n';
						s+='['+i+']: '+ ((jsuix_hasExceptions)? eval('try{String(vobj[i])} catch(e){"#ERROR ON ACCESSING PROPERTY#"}') : vobj[i]);
					}
				}
			}
			else {
				for (var i in vobj) {
					if (s!='') s+='\n';
					s+= i+': '+ ((jsuix_hasExceptions)? eval('try{String(vobj[i])} catch(e){"#ERROR ON ACCESSING PROPERTY#"}') : vobj[i]);
				}
			};
			krnlFOut(env.stdout,s);
		}
		else krnlFOut(env.stdout,vobj);
		ok=true
	}
	else if (opt.s) {
		if (env.args.length>a+1) {
			var val=''
			for (var ari=a+1; ari<env.args.length; ari++) {
				if (env.args[ari]!='') val+=env.args[ari];
			};
			if (opt.n) {
				eval(vstring+'='+val);
				krnlFOut(env.stderr,'js-var self.'+vstring+' set to "'+val+'" (plain value).')
			}
			else {
				for (var ofs=val.indexOf("'"); val>=0; ofs=val.indexOf("'",ofs+2)) val=val.substring(0,ofs)+"\\'"+val.substring(ofs+1);
				eval(vstring+'="'+val+'"');
				krnlFOut(env.stderr,'js-var self.'+vstring+' set to \''+val+'\' (string value).')
			}
		}
		else {
			krnlFOut(env.stdout,'usage: '+env.args[0]+' -e|l[t]|s|t <expression> -- set: <expression> ::= <varname> <value>');
		};
		ok=true
	}
	else if (opt.e) {
		for (var ari=a+1; ari<env.args.length; ari++) {
			if (env.args[ari]!='') vn+=env.args[ari];
		};
		krnlFOut(env.stdout,'evaluating "'+vn+'" in js ...');
		var result = (jsuix_hasExceptions)? eval('try{eval('+vn+')} catch(e){e}') : eval(vn);
		//var result=eval(vn);
		krnlFOut(env.stdout,"returned: "+result);
		ok=true
	};
	if (!ok) {
			krnlFOut(env.stdout,'usage: '+env.args[0]+' -e|l[t]|s|t <expression>');
	}
}

// commands as files

var cmdFileStack=new Array();

function cmdFileRegistrate(path,kind,file,perm,date) {
	// registrate a file for boot time (owner=root, group=wheel)
	cmdFileStack[cmdFileStack.length]=[path,kind,file,perm,date]
}

function commandInit() {

	var cmdFiles= [
	'/sbin/clear', ['#!/dev/js/commandClear'],
	'/sbin/reset', ['#!/dev/js/commandReset'],
	'/sbin/reboot', ['#!/dev/js/commandReset'],
	'/sbin/halt', ['#!/dev/js/commandHalt'],
	'/sbin/fexport', ['#!/dev/js/commandHomeExport'],
	'/sbin/fimport', ['#!/dev/js/commandHomeImport'],
	'/sbin/js', ['#!/dev/js/commandJs'],
	'/bin/cd', ['#!/dev/js/commandCd','# piped to shell cd','# for current subprocess only'],
	'/bin/cal', ['#!/dev/js/commandCal'],
	'/bin/date', ['#!/dev/js/commandDate'],
	'/bin/features', ['#!/dev/js/commandFeatures'],
	'/bin/hello', ['#!/dev/js/commandHello'],
	'/bin/hallo', ['#!/dev/js/commandHello'],
	'/bin/help', ['#!/dev/js/commandHelp'],
	'/bin/info', ['#!/dev/js/commandInfo'],
	'/bin/ls', ['#!/dev/js/commandLs'],
	'/bin/mail', ['#!/dev/js/commandMail'],
	'/bin/man', ['#!/dev/js/commandMan'],
	'/bin/browse', ['#!/dev/js/commandBrowse'],
	'/bin/ps', ['#!/dev/js/commandPs'],
	'/bin/web', ['#!/dev/js/commandBrowse'],
	'/bin/parse', ['#!/dev/js/commandParse'],
	'/bin/time', ['#!/dev/js/commandTime'],
	'/bin/wc', ['#!/dev/js/commandWc'],
	'/bin/cat', ['#!/dev/js/commandCat'],
	'/bin/echo', ['#!/dev/js/commandEcho'],
	'/bin/type', ['#!/dev/js/commandType'],
	'/bin/write', ['#!/dev/js/commandWrite'],
	'/bin/more', ['#!/dev/js/commandMore'],
	'/bin/pager', ['#!/dev/js/commandMore'],
	'/bin/pg', ['#!/dev/js/commandMore'],
	'/bin/splitmode', ['#!/dev/js/commandSplitScreen'],
	'/bin/stty', ['#!/dev/js/commandStty'],
	'/bin/sh', ['#!/dev/js/shellExec'],
	'/bin/cp', ['#!/dev/js/commandCp'],
	'/bin/mv', ['#!/dev/js/commandMv'],
	'/bin/mkdir', ['#!/dev/js/commandMkdir'],
	'/bin/rmdir', ['#!/dev/js/commandRmdir'],
	'/bin/rm', ['#!/dev/js/commandRm'],
	'/bin/su', ['#!/dev/js/commandSu'],
	'/bin/pr', ['#!/dev/js/commandPr'],
	'/bin/touch', ['#!/dev/js/commandTouch'],
	'/bin/chmod', ['#!/dev/js/commandChmod'],
	'/usr/bin/logname', ['#!/dev/js/commandLogname'],
	'/usr/bin/uname', ['#!/dev/js/commandUname'],
	'/usr/bin/vi', ['#!/dev/js/commandVi'],
	'/usr/bin/view', ['#!/dev/js/commandVi'],
	'/usr/bin/which', ['#!/dev/js/commandWhich'],
	'/usr/bin/apropos', ['#!/dev/js/commandApropos'],
	'/usr/bin/news', ['#!/dev/js/commandNews']
	];
	for (var i=0; i<cmdFiles.length; i+=2) vfsForceFile(cmdFiles[i], 'b', cmdFiles[i+1], 0755, os_mdate);
	for (var i=0; i<cmdFileStack.length; i++) {
		var f=cmdFileStack[i];
		vfsForceFile(f[0], f[1], f[2], f[3], f[4]);
	}
}

function sysvarsInit() {
	// preset vars
	usrVAR['PATH']='/bin/ /sbin/ /usr/bin/ ~/';
	usrVAR['USER']='user';
	usrVAR['VERSION']=os_version;
	usrVAR['HOME']='/home';
	usrVAR['HOST']=(self.location.hostname)? self.location.hostname : 'localhost';

	// aliased commands
	usrALIAS['about']= 'features',
	usrALIAS['masswerk']= usrALIAS['mass:werk']='info';
	usrALIAS['quit']= usrALIAS['close']= 'exit';
	usrALIAS['split']= 'splitmode on';
	usrALIAS['unsplit']= 'splitmode off';
}

/// eof

/*******************************************************************************
 *
 * VI Editor
 *
 ******************************************************************************/


var viUndoProps=new Array('col','lc','lr','top','curline');
var viUndoBuffer=null;
var viRedoBuffer=null;

function ViBackupData(obj) {
	for (var i=0; i<viUndoProps.length; i++) {
		var p=viUndoProps[i];
		this[p]=obj[p]
	};
	this.buffer=new Array();
	this.bufheight=new Array();
	for (var i=0; i<obj.buffer.length; i++) {
		this.buffer[i]=obj.buffer[i];
		this.bufheight[i]=obj.bufheight[i];
	}
}

function commandVi(env) {
	env.id='vi';
	env.wantChar=true;
	env.status='wait';
	env.bin='viKeyHandler';
	cnslInsert=false;
	env.buffer=[];
	env.bufheight=[];
	var f=null;
	if ((env.stdin) && (env.stdin.file)) {
		f=env.stdin.file
	}
	else if (env.args[1]) {
		env.filename=vfsGetPath(env.args[1],env.cwd);
		f=vfsOpen(env.filename,4);
		if (f<0) {
			krnlFOut(env.stderr,env.filename+': permission denied.');
			env.status='';
			delete(env.bin);
			return
		}
	};
	if (f) {
		if ((f.kind=='f') || (f.kind=='p') || (f.kind=='b')) {
			for (var i=0; i<f.lines.length; i++) {
				var l=f.lines[i];
				env.buffer[i]=l;
				env.bufheight[i]=viGetLineHeight(env,i)
			}
		}
	};
	if (env.buffer.length==0) {
		env.buffer[0]='';
		env.bufheight[0]=1;
	};
	cnslClear();
	env.bl=cnslMaxLines=conf_rows-1;
	term[env.bl]=cnslGetRowArrray(conf_cols,0);
	termStyle[env.bl]=cnslGetRowArrray(conf_cols,0);
	env.top=0;
	env.lc=0;
	viRefresh(env,true);
	viBeep(env,'+++beta restrictions: no numeral modifiers, no search expressions+++');
	env.cursorblink=cnslBlinkmode;
	env.cursorblock=cnslBlockmode;
	cnslBlinkmode=false;
	cnslBlockmode=true;
	cursorOn();
	env.mode=0
}

function viType(text,style) {
	for (var i=0; i<text.length; i++) {
		var ch=text.charCodeAt(i);
		if (t_c>=conf_cols) {
			t_c=0;
			termDisplay(t_r);
			cnslIncRow();
		};
		if ((ch<32) || (ch>255)) ch=94;
		term[t_r][t_c]=ch;
		termStyle[t_r][t_c]=(style)? style:0;
		t_c++;
	};
	termDisplay(t_r)
}

function viRefresh(env, clearall) {
	var b_l, b_r, b_c, b_lofs, b_col;
	var reset=(clearall)? false: true;
	if (reset) {
		b_r=t_r;
		b_c=t_c;
		b_l=env.curline;
		b_col=env.col
	};
	if (env.top>=env.buffer.length) {
		var th=0;
		var tl=0;
		for (var i=env.buffer.length-1; i>=0; i--) {
			th+=env.bufheight[i];
			tl++;
			if (th>=env.bl) break;
		};
		env.top=Math.max(0,env.buffer.length-Math.min(env.bl,tl));
	};
	env.curline=env.top;
	cnslClearFrameBuffer();
	t_r=0; t_c=0;
	var i=0;
	var l=env.top;
	while (i<env.bl) {
		if (l<env.buffer.length) {
			var lh=env.bufheight[l];
			if (i+lh<=env.bl) {
				viType(env.buffer[l]);
				i+=lh;
				l++
			}
			else {
				while (i<env.bl) { termDisplay(i); i++ }
			}
		}
		else {
			viType('~');
			i++;
		};
		if (i<env.bl) newLine();
	};
	env.bottom=Math.max(env.curline,l-1);
	if (reset) {
		env.curline=b_l;
		env.col=b_col;
		cursorSet(b_r,b_c)
	}
	else {
		env.lc=0;
		env.lr=0;
		env.col=0;
		cursorSet(0,0)
	}
}

function viBackup(env,m) {
	// m=0  -> new backup; m=1 -> undo; m=2 -> redo
	if ((m==1) && (viUndoBuffer==null)) { viBeep(env,'undo buffer empty'); return }
	else if ((m==2) && (viRedoBuffer==null)) { viBeep(env,'redo buffer empty'); return };
	var bu=new ViBackupData(env);
	if (m) {
		cursorOff();
		var bo=(m==1)? viUndoBuffer:viRedoBuffer;
		for (var i=0; i<viUndoProps.length; i++) {
			var p=viUndoProps[i];
			env[p]=bo[p]
		};
		env.buffer=new Array();
		env.bufheight=new Array();
		for (var i=0; i<bo.buffer.length; i++) {
			env.buffer[i]=bo.buffer[i];
			env.bufheight[i]=bo.bufheight[i];
		};
		if (m==1) {
			viRedoBuffer=bu
		}
		else {
			viUndoBuffer=bu
		};
		viRefresh(env);
		cursorOn();
	}
	else {
		env.changed=true;
		viUndoBuffer=bu;
		viRedoBuffer=null
	}
}

function viStatus(env,text) {
	term[env.bl]=cnslGetRowArrray(conf_cols,0);
	termStyle[env.bl]=cnslGetRowArrray(conf_cols,0);
	var msg=(text)? text : 'line: '+(env.curline+1)+'/'+env.buffer.length+', col: '+(env.col+1);
	cnslTypeAt(env.bl,0,msg);
}

function viBeep(env,text) {
	var msg=(text)? text : ' error ';
	term[env.bl]=cnslGetRowArrray(conf_cols,0);
	termStyle[env.bl]=cnslGetRowArrray(conf_cols,0);
	cnslTypeAt(env.bl,0,msg,1);
}

function viSetCursorPos(env) {
	t_r=0;
	t_c=0;
	var l=env.top;
	for (l=env.top; l<env.curline; l++) t_r+=env.bufheight[l];
	env.lr=t_r;
	var ll=env.buffer[env.curline].length;
	if (ll>0) {
		env.col=Math.min(ll-1,env.lc);
		if (env.col>conf_cols-1) t_r+=Math.floor(env.col/(conf_cols-1));
		t_c+=env.col%(conf_cols)
	}
	else {
		t_c=0;
		env.col=0;
	}
}

function viCursorDown(env, sub) {
	if (!sub) cursorOff();
	if (env.curline<env.bottom) {
		env.curline++;
		viSetCursorPos(env);
	}
	else if (env.bottom<env.buffer.length-1) {
		var dh=env.bufheight[env.bottom+1]-env.bufheight[env.top];
		env.top++;
		if (dh>0) env.top+=dh;
		viRefresh(env);
		env.curline=env.bottom;
		viSetCursorPos(env);
	};
	if (env.mode==0) viStatus(env);
	if (!sub) cursorOn();
}

function viCursorUp(env, sub) {
	if (!sub) cursorOff();
	if (env.curline>env.top) {
		env.curline--;
		viSetCursorPos(env);
	}
	else if (env.curline>0) {
		env.top--;
		viRefresh(env);
		env.curline=env.top;
		viSetCursorPos(env);
	};
	if (env.mode==0) viStatus(env);
	if (!sub) cursorOn();
}

function viCursorLeft(env) {
	cursorOff();
	if (env.col>0) {
		env.lc=env.col-1;
		viSetCursorPos(env);
	};
	if (env.mode==0) viStatus(env);
	cursorOn()
}

function viCursorRight(env) {
	cursorOff();
	if (env.col<env.buffer[env.curline].length-1) {
		env.lc=env.col+1;
		viSetCursorPos(env);
	};
	if (env.mode==0) viStatus(env);
	cursorOn()
}


function viMoveTop(env) {
	cursorOff();
	env.top=env.curline;
	viRefresh(env);
	env.curline=env.top;
	viSetCursorPos(env);
	viStatus(env);
	cursorOn();
}

function viMoveLineEnd(env) {
	cursorOff();
	if (env.col<env.buffer[env.curline].length-1) {
		env.lc=Math.max(0, env.buffer[env.curline].length-1);
		viSetCursorPos(env);
	};
	viStatus(env);
	cursorOn()
}

function viMoveLineStart(env,nonblank) {
	cursorOff();
	env.lc=0;
	if (nonblank) {
		var n=1;
		if ((n<env.buffer[env.curline].length-1) && (env.buffer[env.curline].charAt(n)==' ')) {
			while ((n<env.buffer[env.curline].length-1) && (env.buffer[env.curline].charAt(n)==' ')) n++;
			env.lc=n;
		};
	};
	viSetCursorPos(env);
	viStatus(env);
	cursorOn()
}

function viMoveWord(env,dir) {
	cursorOff();
	var wc=krnlWordChar(env.buffer[env.curline].charAt(env.col));
	env.lc=env.col;
	while (true) {
		if (dir>0) {
			env.lc++
			if (env.lc>=env.buffer[env.curline].length) {
				if (env.curline<env.bottom) {
					env.curline++;
					env.lc=0
				}
				else if (env.bottom<env.buffer.length-1) {
					var dh=env.bufheight[env.bottom+1]-env.bufheight[env.top];
					env.top++;
					if (dh>0) env.top+=dh;
					viRefresh(env);
					env.curline=env.bottom;
					env.lc=0
				}
				else {
					env.lc=env.buffer[env.curline].length-1
				};
				break
			}
		}
		else {
			env.lc--
			if (env.lc<0) {
				if (env.curline>0) {
					if (env.curline>env.top) {
						env.curline--;
					}
					else {
						env.top--;
						viRefresh(env);
						env.curline=env.top;
					}
					env.lc=env.buffer[env.curline].length-1;
				}
				else {
					env.lc=0
				};
				break
			}
		};
		var ch=env.buffer[env.curline].charAt(env.lc);
		if (ch==' ') {
			wc=false;
			continue
		};
		if ((wc) && (krnlWordChar(ch))) continue;
		if ((dir<0)  && (krnlWordChar(ch))) {
			var n=env.lc;
			while ((n>=0) && (krnlWordChar(env.buffer[env.curline].charAt(n-1)))) n--;
			env.lc=n
		}
		break
	};
	viSetCursorPos(env);
	viStatus(env);
	cursorOn()
}

function viMoveWordEnd(env) {
	cursorOff();
	var n=env.col+1;
	while ((n<env.buffer[env.curline].length-1) && (env.buffer[env.curline].charAt(n)==' ')) n++;
	env.col=n;
	if ((env.col<env.buffer[env.curline].length-1) && (krnlWordChar(env.buffer[env.curline].charAt(env.col)))) {
		n=env.col;
		while ((n<env.buffer[env.curline].length-1) && (krnlWordChar(env.buffer[env.curline].charAt(n+1)))) n++;
		env.lc=n;
	}
	else {
		env.lc=env.col;
		if (env.lc>=env.buffer[env.curline].length) {
			if (env.curline<env.bottom) {
				env.curline++;
				env.lc=0
			}
			else if (env.bottom<env.buffer.length-1) {
				var dh=env.bufheight[env.bottom+1]-env.bufheight[env.top];
				env.top++;
				if (dh>0) env.top+=dh;
				viRefresh(env);
				env.curline=env.bottom;
				env.lc=0
			}
			else {
				env.lc=env.buffer[env.curline].length-1
			}
		}
	};
	viSetCursorPos(env);
	viStatus(env);
	cursorOn()
}

function viMoveSentence(env,dir) {
	// coming soon
}

function viDelete(env,ofs) {
	var ll=env.buffer[env.curline].length;
	var n=env.col-ofs;
	if ((ll)  && (n>=0)) {
		cursorOff();
		viBackup(env,0);
		var h1=env.bufheight[env.curline];
		for (var i=0; i<h1; i++) term[env.lr+i]=cnslGetRowArrray(conf_cols,0);
		if (n<env.buffer[env.curline].length-1) {
			env.buffer[env.curline]=env.buffer[env.curline].substring(0,n)+env.buffer[env.curline].substring(n+1)
		}
		else {
			env.buffer[env.curline]=env.buffer[env.curline].substring(0,n)
		};
		var h2=env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
		if (ofs) env.lc--;
		cursorSet(env.lr,0);
		viType(env.buffer[env.curline]);
		viSetCursorPos(env);
		if (h1!=h2) viRefresh(env);
		cursorOn();
	}
}

function viChange(env,what,del) {
	cursorOff();
	viBackup(env,0);
	var l=env.buffer[env.curline];
	var h1=env.bufheight[env.curline];
	var h2=0;
	var p1=0;
	var p2=0;
	var l1=env.curline;
	for (var i=0; i<h1; i++) term[env.lr+i]=cnslGetRowArrray(conf_cols,0);
	if ((what=='C') || (what=='C')) {
		env.buffer[env.curline]=l.substring(0,env.col);
		h2=env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
	}
	else if (what=='c') {
		env.buffer[env.curline]='';
		h2=env.bufheight[env.curline]=1;
		viSetCursorPos(env)
	}
	else if (what=='w') {
		p1=env.col;
		viMoveWord(env,1),
		p2=env.col;
	}
	else if (what=='b') {
		p2=env.col;
		viMoveWord(env,-11),
		p1=env.col;
	}
	else if (what=='e') {
		p1=env.col;
		viMoveWordEnd(env),
		p2=env.col;
	}
	else if (what=='e') {
		p1=env.col;
		viMoveWordEnd(env),
		p2=env.col;
	}
	else if (what=='$') {
		p1=env.col;
		viMoveLineEnd(env),
		p2=env.col;
	}
	else if (what=='0') {
		p2=env.col;
		viMoveLineStart(env),
		p1=env.col;
	}
	else if (what=='^') {
		p2=env.col;
		viMoveLineStart(env,1),
		p1=env.col;
	}
	else if (what=='d') {
		env.copy=env.buffer[env.curline];
		env.linecopy=true;
		for (var i=l1; i<env.buffer.length-2; i++) {
			env.buffer[i]=env.buffer[i+1];
			env.bufheight[i]=env.bufheight[i+1]
		};
		env.buffer.length--;
		env.bufheight.length--;
		if (env.curline==env.buffer.length) {
			env.curline--;
			if (env.buffer.length<=0) {
				env.curline=0;
				env.buffer[0]='';
				env.bufheight[0]=1
			};
			viSetCursorPos(env)
		};
		h2=-1
	};
	if (h2==0) {
		cursorOff();
		if (l1==env.curline) {
			var n1=Math.min(p1,p2);
			var n2=Math.max(p1,p2);
			var ln='';
			var ll=env.buffer[l1].length;
			if (n1>0) ln+=l.substring(0,n1);
			if ((n2>0) && (n2<ll-1)) ln+=l.substring(n2+1);
			env.buffer[l1]=ln;
			h2=env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
			env.lc=n1
		}
		else if ((what=='w') || (what=='e')) {
			env.curline=l1;
			env.lc=env.buffer[l1].length-1;
			h2=h1
		}
		else if (what=='b') {
			env.curline=l1;
			if (p2>0) env.buffer[env.curline]=l.substring(p2);
			h2=env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
			env.lc=0
		}
		else {
			viRefresh(env);
			env.mode=0;
			env.modifier='';
			viBeep(env,' change in same line only ');
			cursorOn();
			return
		}
	};
	viSetCursorPos(env);
	if (h1!=h2) viRefresh(env)
	else {
		cursorSet(env.lr,0);
		viType(env.buffer[env.curline])
	};
	viSetCursorPos(env);
	env.modifier='';
	if (del) {
		viStatus(env);
		env.mode=0
		cursorOn();
	}
	else {
		env.mode=2;
		viStatus(env,' -- INSERT -- ');
		env.append=false;
		cursorOn()
	}
}

function viNewLine(env) {
	var n=env.col;
	var ol='';
	var nl='';
	cursorOff();
	if ((n>0) && (env.append)) n++;
	ol=env.buffer[env.curline].substring(0,n);
	if (n<env.buffer[env.curline].length) nl=env.buffer[env.curline].substring(n);
	env.buffer[env.curline]=ol;
	env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
	viOpenLine(env,1);
	env.lc=0;
	if (nl) {
		env.buffer[env.curline]=nl;
		env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
		viRefresh(env);
	};
	viSetCursorPos(env);
	cursorOn()
}

function viJoinLines(env) {
	if (env.curline<env.buffer.length-1) {
		cursorOff();
		viBackup(env,0);
		env.buffer[env.curline]=env.buffer[env.curline]+env.buffer[env.curline+1];
		env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
		for (var i=env.curline+1; i<env.buffer.length-1; i++) {
			env.buffer[i]=env.buffer[i+1];
			env.bufheight[i]=env.bufheight[i+1]
		};
		env.buffer.length--;
		env.bufheight.length--;
		viStatus(env);
		viRefresh(env);
		cursorOn()
	}
}

function viPaste(env,ofs) {
	if (!env.copy) return;
	cursorOff();
	viBackup(env,0);
	if (env.linecopy) {
		var arg=(ofs)? 0:1;
		viOpenLine(env,arg);
		env.buffer[env.curline]=env.copy;
		env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
		env.lc=0;
		viStatus(env);
		viSetCursorPos(env);
		viRefresh(env);
	};
	cursorOn()
}

function viInsert(env,ch) {
	cursorOff();
	n=env.col;
	var l=env.buffer[env.curline];
	var ll=l.length;
	var lh1=env.bufheight[env.curline];
	if (ll==0) {
		env.buffer[env.curline]=ch;
		cursorSet(env.lr,0);
		viType(env.buffer[env.curline]);
		env.bufheight[env.curline]=1;
		viSetCursorPos(env);
		env.append=true
	}
	else {
		if (env.append) n++;
		var le=(n>=ll-1);
		if ((le) && (env.append)) {
			env.buffer[env.curline]=l+ch;
		}
		else {
			env.buffer[env.curline]=l.substring(0,n)+ch+l.substring(n);
		};
		cursorSet(env.lr,0);
		viType(env.buffer[env.curline]);
		var lh2=env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
		if (env.append) env.append=le;
		env.lc=(env.append)? n:n+1;
		viSetCursorPos(env);
		if (lh1!=lh2) viRefresh(env);
	};
	cursorOn()
}

function viReplace(env,ch) {
	cursorOff();
	n=env.col;
	var l=env.buffer[env.curline];
	var ll=l.length;
	var lh1=env.bufheight[env.curline];
	if (l==0) {
		env.buffer[env.curline]=ch;
		cursorSet(env.lr,0);
		viType(env.buffer[env.curline]);
		env.bufheight[env.curline]=1;
		viSetCursorPos(env);
	}
	else {
		var le=(n>=ll-1);
		if (le) {
			env.buffer[env.curline]=l+ch;
		}
		else {
			if (n<ll-1) env.buffer[env.curline]=l.substring(0,n)+ch+l.substring(n+1)
			else env.buffer[env.curline]=l.substring(0,n)+ch;
		};
		cursorSet(env.lr,0);
		viType(env.buffer[env.curline]);
		var lh2=env.bufheight[env.curline]=viGetLineHeight(env,env.curline);
		env.lc=n+1;
		viSetCursorPos(env);
		if (lh1!=lh2) viRefresh(env);
	};
	cursorOn()
}

function viOpenLine(env,ofs) {
	var n=env.curline+ofs;
	if (n>=env.buffer.length) {
		n=env.buffer.length;
		env.buffer[n]='';
		env.bufheight[n]=1
	}
	else if (n<0) {
		n=0;
		var b=[''];
		var bh=[1];
		for (var i=0; i<env.buffer.length;i++) {
			b[i+1]=env.buffer[i];
			bh[i+1]=env.bufheight[i]
		};
		env.buffer=b;
		env.bufheight=bh
	}
	else {
		var b=[];
		var bh=[];
		for (var i=0; i<n; i++) {
			b[i]=env.buffer[i];
			bh[i]=env.bufheight[i]
		};
		b[n]='';
		bh[n]=1;
		for (var i=n; i<env.buffer.length;i++) {
			b[i+1]=env.buffer[i];
			bh[i+1]=env.bufheight[i]
		};
		env.buffer=b;
		env.bufheight=bh
	};
	env.curline=n;
	if (env.top>n) env.top=n;
	viSetCursorPos(env);
	viRefresh(env);
	viSetCursorPos(env)
}

function viGetLineHeight(env,l) {
	return Math.max(1,1+Math.floor((env.buffer[l].length-1)/conf_cols))
}

function viQuit(env) {
	env.wantChar=false;
	env.status='';
	cnslMaxLines=conf_rows;
	cnslBlinkmode=env.cursorblink
	cnslBlockmode=env.cursorblock
}

function viCmdError(env,msg) {
	cursorOff();
	viBeep(env,msg);
	env.mode=0;
	env.cmd='';
	cnslMaxLines=env.bl
	t_r=env.t_r;
	t_c=env.t_c;
	cursorOn()
}

function viNavCharHandler(env,ch) {
	if (env.modifier) {
		if (env.modifier=='c') {
			if (ch==119) viChange(env,'e') //w
			else if (ch==101) viChange(env,'e')
			else if (ch==98) viChange(env,'b')
			else if (ch==99) viChange(env,'c')
			else if (ch==36) viChange(env,'$')
			else if (ch==94) viChange(env,'^')
			else if (ch==48) viChange(env,'0')
			else {
				env.modifier='';
				viStatus(env);
			}
		}
		else if (env.modifier=='d') {
			if (ch==119) viChange(env,'e',1) //w
			else if (ch==101) viChange(env,'e',1)
			else if (ch==98) viChange(env,'b',1)
			else if (ch==100) viChange(env,'d',1)
			else if (ch==36) viChange(env,'$',1)
			else if (ch==94) viChange(env,'^',1)
			else if (ch==48) viChange(env,'0',1)
			else {
				env.modifier='';
				viStatus(env);
			}
		}
		else if (env.modifier=='y') {
			if (ch==121) {
				env.copy=env.buffer[env.curline];
				env.linecopy=true
			};
			env.modifier='';
			viStatus(env);
		};
		return
	};
	if (ch==111) { viBackup(env,0); viOpenLine(env,1) }
	else if (ch==79) { viBackup(env,0);viOpenLine(env,0) };
	if (ch==99) {
		env.modifier='c';
		viStatus(env,'                                                                    c')
	}
	else if (ch==100) {
		env.modifier='d';
		viStatus(env,'                                                                    d')
	}
	else if (ch==121) {
		env.modifier='y';
		viStatus(env,'                                                                    y')
	}
	else if (ch==104) viCursorLeft(env)
	else if (ch==108) viCursorRight(env)
	else if (ch==107) viCursorUp(env)
	else if (ch==106) viCursorDown(env)
	else if (ch==88) viDelete(env,1)
	else if (ch==120) viDelete(env,0)
	else if (ch==48) viMoveLineStart(env)
	else if (ch==94) viMoveLineStart(env,1)
	else if (ch==36) viMoveLineEnd(env)
	else if (ch==119) viMoveWord(env,1)
	else if (ch==98) viMoveWord(env,-1)
	else if (ch==101) viMoveWordEnd(env)
	else if (ch==122) viMoveTop(env)
	else if (ch==41) viMoveSentence(env,1)
	else if (ch==40) viMoveSentence(env,-1)
	else if (ch==67) viChange(env,'C')
	else if (ch==68) viChange(env,'D',1)
	else if (ch==112) viPaste(env,0)
	else if (ch==80) viPaste(env,1)
	else if (ch==74) viJoinLines(env)
	else if (ch==45) { cursorOff(); viCursorUp(env,1); viMoveLineStart(env,1)}
	else if (ch==43) { cursorOff(); viCursorDown(env,1); viMoveLineStart(env,1)}
	else if (ch==117) viBackup(env,1)
	else if (ch==85) viBackup(env,2)
	else if ((ch==105) || (ch==111) || (ch==79) || (ch==97) || (ch==65) || (ch==73)) {
		env.mode=2;
		cursorOff()
		viStatus(env,' -- INSERT -- ');
		if (ch==65) { viMoveLineEnd(env); cursorOff() }
		else if (ch==73) { viMoveLineStart(env,1); cursorOff() };
		env.append=((ch==97)  || (ch==65));
		if ((ch!=111) && (ch!=79)) viBackup(env,0);
		cursorOn()
	}
	else if (ch==82) {
		env.mode=3;
		cursorOff()
		viStatus(env,' -- REPLACE -- ');
		viBackup(env,0);
		cursorOn()
	}
	else if (ch==58) {
		cursorOff();
		env.t_r=t_r;
		env.t_c=t_c;
		env.cmd='';
		viStatus(env,':');
		cursorSet(env.bl,1);
		cnslMaxLines=conf_cols;
		env.mode=4;
		cursorOn()
	}
}

function viCommandHandler(env) {
	if (env.cmd=='ZZ') env.cmd='x'
	else if (env.cmd=='$') env.cmd=env.buffer.length+1;

	if ((env.cmd=='q') || (env.cmd=='quit') || (env.cmd=='q!') || (env.cmd=='quit!'))  {
		// simple quit
		if ((env.changed) && (env.cmd.indexOf('!')<0)) {
			viCmdError(env,'no write since last change (use ! to override)');
			return
		};
		cnslClear();
		viQuit(env);
		return
	}
	else if ((env.cmd) && ((env.cmd.indexOf('w')==0) || (env.cmd.indexOf('x')==0))) {
		// quit and save
		var sp=env.cmd.indexOf(' ');
		var fn='';
		if (sp>0) {
			fn=env.cmd.substring(sp+1);
			env.cmd=env.cmd.substring(0,sp);
			while ((fn) && (fn.charAt(0)==' ')) fn=fn.substring(1);
			while ((fn) && (fn.charAt(fn.length-1)==' ')) fn=fn.substring(0,fn.length-1);
		};
		var force= (env.cmd.indexOf('!')>0);
		var quit= ((env.cmd.indexOf('x')==0) || (env.cmd.indexOf('q')>0));
		if (fn) {
			env.filename=vfsGetPath(fn,env.cwd);
			env.newname=true;
		};
		if (!env.filename) {
			viCmdError(env,'no filename specified'); return
		}
		else if ((env.args[0]=='view') && (!env.newname)) {
			viCmdError(env,'opened in read only mode (write with new name)'); return
		};
		var f=vfsOpen(env.filename,2);
		if (f!=0) {
			if (f==-2) {
				viCmdError(env,env.filename+': permission denied.'); return
			}
			else if (f<0) {
				viCmdError(env,env.filename+':no write permission in parent directory.'); return
			}
			else if (f.inode==krnlDevNull) {
				f.touch();
				viStatus(env, '/dev/null: 0 lines 0 characters')
			}
			else if (f.kind!='f') {
				viCmdError(env,env.filename+': not a plain file'); return
			}
			else if ((env.newname) && (env.changed) && (!force)) {
				viCmdError(env,env.filename+': allready exists (use ! to override)'); return
			}
			else if (!((env.cmd.indexOf('x')==0) && (env.changed==null))) {
				f.lines=env.buffer;
				env.changed=null;
				var chrs=0;
				for (var li=0; li<env.buffer.length; li++) {
					chrs+=env.buffer[li].length;
					f.lines[li]=env.buffer[li]
				};
				f.touch();
				viStatus(env, env.filename+': '+env.buffer.length+' lines '+chrs+' characters')
			}
		}
		else {
			f=vfsCreate(env.filename,'f',0660);
			if (f<0) {
				viCmdError(env,env.filename+': permission denied.'); return
			}
			else if (f==0) {
				viCmdError(env,env.filename+': directory not found.'); return
			}
			else {
				env.changed=null;
				var chrs=0;
				for (var li=0; li<env.buffer.length; li++) {
					chrs+=env.buffer[li].length;
					f.lines[li]=env.buffer[li]
				};
				viStatus(env, env.filename+': '+env.buffer.length+' lines '+chrs+' characters');
			}
		};
		if (quit) {
			cnslClear();
			viQuit(env);
			return
		}
		else {
			env.mode=0
		}
	}
	else if ((env.cmd) && (env.cmd.charAt(0)=='/')) viCmdError(env,'search not implemented yet')
	else if (parseInt(env.cmd,10)>0) {
		// goto line
		cursorOff();
		cnslMaxLines=env.bl;
		env.top=parseInt(env.cmd,10)-1;
		env.cmd='';
		env.mode=0;
		viRefresh(env,true);
		viStatus(env);
		cursorOn()
	}
	else viCmdError(env,'invalid command')
}


// input driver

function viKeyHandler(env) {
	cnslInsert=false;
	var ch=krnlTtyChar;
	if ((ch<28) && (ch>=32) && (repeatTimer)) clearTimeout(repeatTimer);
	if (ch==27) {
		// esc
		cursorOff();
		if (env.mode==4) env.cmd='';
		env.mode=0;
		env.modifier='';
		env.append=false;
		viStatus(env);
		viSetCursorPos(env);
		cursorOn()
	}
	// cursor movements
	else if (ch==28) {
		// left
		if (env.mode<4) { env.modifier=''; viCursorLeft(env) }
	}
	else if (ch==29) {
		// right
		if (env.mode<34) { env.modifier=''; viCursorRight(env) }
	}
	else if (ch==8) {
		// backspace
		if (env.mode==0) { env.modifier=''; viCursorLeft(env) }
		else if (env.mode<4) viDelete(env,1)
		else if ((env.mode==4) && (env.cmd!='')) {
			cursorOff();
			env.cmd=env.cmd.substring(0,env.cmd.length-1);
			var display=(env.cmd.length<conf_cols-3)? ':'+env.cmd : ':'+env.cmd.substr(env.cmd.length-(conf_cols-3));
			viStatus(env,display);
			cursorSet(env.bl, display.length);
			cursorOn();
		}
	}
	else if (ch==30) {
		// up
		if (env.mode<4) { env.modifier=''; viCursorUp(env) }
	}
	else if (ch==31) {
		// down
		if (env.mode<4) { env.modifier=''; viCursorDown(env) }
	}
	else if ((ch>=32) && (ch<256)) {
		if (env.mode==0) viNavCharHandler(env,ch)
		else if (env.mode==2) viInsert(env,String.fromCharCode(ch))
		else if (env.mode==3) viReplace(env,String.fromCharCode(ch))
		else if (env.mode==4) {
			cursorOff();
			env.cmd+=String.fromCharCode(ch);
			var display=(env.cmd.length<conf_cols-3)? ':'+env.cmd : ':'+env.cmd.substr(env.cmd.length-(conf_cols-3));
			viStatus(env,display);
			cursorSet(env.bl, display.length);
			cursorOn()
		}
	}
	else if (ch==13) {
		if (env.mode==0) {
			env.modifier='';
			cursorOff();
			viCursorDown(env,1);
			viMoveLineStart(env,1)
		}
		else if (env.mode<4) viNewLine(env)
		else if (env.mode==4) viCommandHandler(env)
	}
}

// eof

/*******************************************************************************
 *
 * Invaders - a must
 *
 ******************************************************************************/


cmdFileRegistrate('/usr/bin/invaders', 'b', ['#!/dev/js/commandInvaders'],0755,new Date(2005,6,26,23,0,0));

var invSprites=[
	'       ',' (^o^) ',' (^-^) ',' (( ))',
	' [_A_] ',' [(.)] ',' ( . ) ','( (.) )',
	' ( . ) ','(  .  )','   .   ','       '
	];
var invRows=3;
var invCols=5;
var invMaxBombs=3;
var invBombRate=0.005;
var invTimer=null;
var invDelay=100;
var invNewWaveDelay=1500;

function invObject(y,x) {
	this.x=x;
	this.y=y;
	this.status=1;
}

function commandInvaders(env) {
	env.id='invaders';
	env.wantChar=true;
	env.status='wait';
	env.bin='invSetup';
	cnslInsert=false;
	env._stdout=env.stdout;
	env.stdout=null;
	cnslClear();
	env._bl=cnslMaxLines=conf_rows-1;
	term[env._bl]=cnslGetRowArrray(conf_cols,0);
	termStyle[env._bl]=cnslGetRowArrray(conf_cols,0);
	env.cursorblink=cnslBlinkmode;
	env.cursorblock=cnslBlockmode;
	env.rawmode=cnslRawMode;
	cnslRawMode=true;
	cnslBlinkmode=false;
	cnslBlockmode=true;
	cursorOff();
	invEnv=env;
	krnlFOut(null,[
		'',
		'                       %+i*** JS/UIX - I N V A D E R S ***%-i',
		'',
		'',
		'                       Instructions:',
		'',
		'                       use cursor LEFT and RIGHT to move',
		'                       (or use vi movements alternatively)',
		'                       press space to fire',
		'',
		'                       press "q" or "esc" to quit,',
		'                       "p" to pause the game.',
		'',
		'',
		'',
		'                       %+r press any key to start the game %-r',
		'',
		'',
		'',
		'',
		'',
		'                       (c) mass:werk N.Landsteiner 2005'
		],1)
}

function invSetup() {
	var env=krnlCurPcs;
	var ch=krnlTtyChar;
	if ((ch==27) || (ch==113)) {
		// quit on esc or q
		invQuit()
	}
	else {
		env.bin='invKeyHandler';
		env._right=conf_cols-7;
		env._wave=0;
		env._score=0;
		env._sr=env._bl-2;
		env._bombmaxy=env._sr-4;
		env._bly=env._sr-2;
		var d=Math.floor((conf_cols)/5);
		var d1=Math.floor((conf_cols-3*d)/2);
		env._blockpos=new Array();
		for (var i=0; i<4; i++) {
			var x=d1+i*d;
			env._blockpos[env._blockpos.length]=x-1;
			env._blockpos[env._blockpos.length]=x;
			env._blockpos[env._blockpos.length]=x+1
		};
		invNewWave()
	}
}

function invNewWave() {
	var env=krnlCurPcs;
	cnslLock=true;
	cnslClear();
	env._wave++;
	env._sc=Math.floor((conf_cols-3)/2);
	var c=Math.floor((conf_cols-12)/2);
	cnslTypeAt(4,c,'W A V E  # '+env._wave,4);
	cnslTypeAt(6,c,'Get ready ...');
	if (env._wave>1) {
		cnslTypeAt(env._sr,env._sc,invSprites[4],0);
		invSetScoreBg();
		invScoreDisplay()
	};
	invTimer=setTimeout('invWaveStart()', invNewWaveDelay);
}

function invWaveStart() {
	var env=krnlCurPcs;
	clearTimeout(invTimer);
	cnslClear();
	env._smove=0;
	env._phase=1;
	env._dir=1;
	env._population=0;
	env._shot=0;
	env._over=false;
	env._bombs=0;
	env._inv=new Array();
	env._maxrows=(env._wave==2)? invRows+1:invRows;
	env._maxcols=(env._wave<=2)? invCols:invCols+1;
	for (var r=0; r<env._maxrows; r++) {
		env._inv[r]=new Array();
		for (var c=0; c<env._maxcols; c++) {
			env._inv[r][c]=new invObject(r*2+1,c*8);
			env._population++;
		}
	};
	env._block=cnslGetRowArrray(conf_cols,false);
	for (var i=0; i<env._blockpos.length; i++) {
		var x=env._blockpos[i];
		env._block[x]=true;
		term[env._bly][x]=72
	};
	termDisplay(env._bly);
	env._bomb=new Array();
	env._changed=cnslGetRowArrray(env._bl,false);
	invSetScoreBg();
	invScoreDisplay();
	cnslTypeAt(env._sr,env._sc,invSprites[4],0);
	invStep(env);
	cnslLock=false;
	invTimer=setTimeout('invLoop()', invDelay);
}

function invLoop() {
	clearTimeout(invTimer);
	var env=krnlCurPcs;
	env._enter=new Date();
	if (env._smove) {
		env._sc+=env._smove;
		env._smove=0;
		invTypeAt(env._sr,env._sc,invSprites[4]);
	};
	var s=env._score;
	invStep(env);
	env._phase=(env._phase==1)? 2:1;
	for (var i=0; i<=env._sr; i++) {
		if (env._changed[i]) {
			termDisplay(i);
			env._changed[i]=false
		}
	};
	if (s!=env._score) invScoreDisplay();
	if (env._population==0) {
		invTimer=setTimeout('invNewWave()', invDelay)
	}
	else if ((env._invbottom==env._sr) || (env._over)) {
		cnslLock=true;
		env._phase=(env._over)? 5:4;
		invGameOver();
	}
	else {
		invTimer=setTimeout('invRepeat()', 1)
	}
}

function invStep(env) {
	var right=0, left=conf_cols, bottom=0, dir=env._dir;
	var linestep= ((env._invleft==0) || (env._invright==env._right));
	var shot=(env._shot>0), shotx=env._shotx, shoty=env._sr-env._shot;
	var bomb=env._bomb, block=env._block, blocky=env._bly, isblockrow=false;
	if ((shot) && (env._shot>1)) invTypeAt(shoty+1,shotx,' ');
	for (var r=0; r<env._maxrows; r++) {
		for (var c=0; c<env._maxcols; c++) {
			var i=env._inv[r][c];
			if (i.status==1) {
				if (linestep) {
					invTypeAt(i.y,i.x,invSprites[0]);
					i.y++
				};
				if ((shot) && (shoty==i.y) && ((shotx>i.x) && (shotx<(i.x+6)))) {
					i.status=2;
					env._population--;
					env._score+=50;
					env._shot=shot=0;
					invTypeAt(i.y,i.x,invSprites[3])
				}
				else {
					invTypeAt(i.y,i.x,invSprites[env._phase]);
					if ((i.y<env._bombmaxy) && (env._bombs<invMaxBombs) && (Math.random()<invBombRate)) {
						for (var n=0; n<invMaxBombs; n++) {
							if (bomb[n]==null) {
								bomb[n]=new invObject(i.y+1,i.x+3);
								env._bombs++;
								break
							}
						}
					};
					if (i.y==blocky) isblockrow=true;
					i.x+=dir
					right=Math.max(i.x,right);
					left=Math.min(i.x,left);
					bottom=Math.max(i.y,bottom)
				}
			}
			else if (i.status==2) {
				invTypeAt(i.y,i.x,invSprites[0]);
				i.status=0
			}
		}
	};
	for (var n=0; n<invMaxBombs; n++) {
		var b=bomb[n];
		if (b!=null) {
			if (term[b.y-1]==null) alert('b.y = '+b.y+'\nb.x = '+b.x+'\nb: '+b.toSource());
			if (term[b.y-1][b.x]==86) invTypeAt(b.y-1,b.x,' ');
			if ((b.y==blocky) && (block[b.x])) {
				block[b.x]=false;
				invTypeAt(blocky,b.x,' ');
				b=bomb[n]=null;
				env._bombs--
			}
			else if (b.y==env._sr) {
				if ((b.x>env._sc) && (b.x<(env._sc+6))) {
					env._phase=5;
					env._over=true
				}
				else {
					b=bomb[n]=null;
					env._bombs--
				}
			}
			else if (shot) {
				if (((b.y==shoty) || (b.y==shoty+1)) && (Math.abs(b.x-shotx)<2)) {
					b=bomb[n]=null;
					env._bombs--;
					env._score+=5;
					env._shot=shot=0
				}
			};
			if (b) {
				invTypeAt(b.y,b.x,'V');
				b.y++
			}
		}
	};
	if (shot) {
		if (shoty>0) {
			if ((shoty==blocky) && (env._block[shotx])) {
				env._block[shotx]=false;
				invTypeAt(blocky,shotx,' ');
				env._shot=0

			}
			else {
				invTypeAt(shoty,shotx,'|');
				env._shot++
			}
		}
		else env._shot=0;
	};
	env._invleft=left;
	env._invright=right;
	env._invbottom=bottom;
	if ((dir=-1) && (left==0)) env._dir=1
	else if ((dir=1) && (right==env._right)) env._dir=-1;
	// restore any overwritten blocks
	if (isblockrow) {
		for (var i=0; i<env._blockpos.length; i++) {
			var x=env._blockpos[i];
			if ((block[x]) && (term[blocky][x]<=32)) invTypeAt(blocky,x,'H');
		}
	}
}

function invRepeat() {
	// repeat with respect to utime
	clearTimeout(invTimer);
	var leave=new Date();
	invTimer=setTimeout('invLoop()', Math.max(3,invDelay-(leave.getTime() - krnlCurPcs._enter.getTime())))
}

function invGameOver() {
	clearTimeout(invTimer);
	var env=krnlCurPcs;
	if (env._phase==invSprites.length) {
		var c=Math.floor((conf_cols-26)/2);
		cnslTypeAt(3, c, '                          ');
		cnslTypeAt(4, c, '    G A M E  O V E R !    ');
		cnslTypeAt(5, c, '                          ');
		cnslTypeAt(6, c, ' press any key to restart,');
		cnslTypeAt(7, c, ' "q" or "esc" for quit.   ');
		cnslTypeAt(8, c, '                          ');
		cnslLock=false;
		env.bin='invSetup'
	}
	else {
		invTypeAt(env._sr,env._sc,invSprites[env._phase++]);
		termDisplay(env._sr);
		invTimer=setTimeout('invGameOver()', invDelay*2)
	}
}

function invPauseEnter() {
	clearTimeout(invTimer);
	var c=Math.floor((conf_cols-21)/2);
	invTypeAt(4,c,' *** P A U S E D *** ');
	termDisplay(4);
	krnlCurPcs.bin='invPauseHandler'
}

function invPauseHandler() {
	var c=Math.floor((conf_cols-19)/2);
	var ch=krnlTtyChar;
	if ((ch==27) || (ch==113)) {
		// esc or q
		invQuit()
	}
	else {
		var c=Math.floor((conf_cols-21)/2);
		invTypeAt(4,c,'                     ');
		termDisplay(4);
		krnlCurPcs.bin='invKeyHandler';
		invLoop()
	}
}

function invQuit() {
	if (invTimer) clearTimeout(invTimer);
	var env=krnlCurPcs;
	env.wantChar=false;
	env.status='';
	env.bin='invNOP';
	cnslMaxLines=conf_rows;
	cnslBlinkmode=env.cursorblink;
	cnslBlockmode=env.cursorblock;
	cnslRawMode=env.rawmode;
	env.stdout=env._stdout;
	delete(env._stdout);
	cnslClear();
	cursorOn();
	// pick up pending processes
	keyHandler({which:0})
}

function invNOP() {}

function invScoreDisplay() {
	term[krnlCurPcs._bl]=cnslGetRowArrray(conf_cols,0);
	var text=' JS/UIX - Invaders | "q","esc":quit "p":pause |  Wave: '+krnlCurPcs._wave+'  Score: '+krnlCurPcs._score;
	var tbl=term[krnlCurPcs._bl];
	for (var i=0; i<text.length; i++) tbl[i]=text.charCodeAt(i);
	termDisplay(krnlCurPcs._bl)
}

function invSetScoreBg() {
	termStyle[krnlCurPcs._bl]=cnslGetRowArrray(conf_cols,1);
}

function invTypeAt(r,c,text) {
	for (var i=0; i<text.length; i++) term[r][c+i]=text.charCodeAt(i);
	krnlCurPcs._changed[r]=true
}


// input driver

function invKeyHandler() {
	cnslInsert=false;
	var ch=krnlTtyChar;
	var env=krnlCurPcs;
	if ((ch<28) && (ch>=32) && (repeatTimer)) clearTimeout(repeatTimer);
	// cursor movements
	if ((ch==28) || (ch==104)) {
		// left
		if (env._sc>0) env._smove=-1;
	}
	else if ((ch==29) || (ch==108)) {
		// right
		if (env._sc<env._right) env._smove=1;
	}
	else if (ch==32) {
		// space
		if (env._shot==0) {
			env._shot=1;
			env._shotx=env._sc+3
		}
	}
	else if ((ch==27) || (ch==113)) {
		// esc or q
		invQuit()
	}
	else if (ch==112) {
		// p
		invPauseEnter()
	}
}

// eof

/*******************************************************************************
 *
 * Man Pages
 *
 ******************************************************************************/


new ManPage('man', {
		synopsis: 'man <command>',
		apropos: 'displays manual pages for a command',
		description: 'displays a manual page for system commands.\nif an entry for the command is found, it will be displayed using the standard\npager.',
		arguments: [
			'<command>','command name.\nfor an alias its value is displayed.'
		],
		options: [
			'-p', 'opens a new browser window with the full list.'
		]
	});

new ManPage('apropos', {
		synopsis: 'apropos <command>',
		apropos: 'displays a short description of a command',
		description: 'displays a short description of a command.',
		arguments: [
			'<command>','command name.'
		]
	});

new ManPage('cal', {
		synopsis: 'cal [-w] [[<month_nr>] [<year>]]',
		apropos: 'displays a monthly calendar',
		description: 'displays a monthly calendar.\ndefaults to current month and year if no arguments specified.',
		arguments: [
			'<month_nr>','number of month (1..12), default current month.',
			'<year>','year (1900..9999), default current year.'
		],
		options: [
			'-w','show week numbers.'
		]
	});

new ManPage('clear', {
		synopsis: 'clear',
		apropos: 'clears and resets the terminal display',
		description: 'clears and resets the terminal display.'
	});

new ManPage('date', {
		synopsis: 'date [-%+ul%-u|u] [+format]',
		apropos: 'displays the date and time with format options',
		description: 'diplays the date and time as local (default) or UTC\nas: weekday, day month year hours:minutes:seconds [UTC]\nthe output can be formated by an optional format-string.',
		arguments: [
			'<format>', 'a string consisting of any of the following characters:',
			'%%a',' week-day abrv., Sun-Sat',
			'%%d',' day, 1-31',
			'%%D',' date as mm/dd/yy',
			'%%h',' month abrv., Jan-Dec',
			'%%H',' hours, 00-23',
			'%%j',' year-day, 001-366',
			'%%m',' month, 01-12',
			'%%M',' minutes, 00-59',
			'%%n',' new line',
			'%%r',' time in AM/PM',
			'%%S',' seconds, 00-59',
			'%%t',' tab (insert space)',
			'%%T',' time as hh:mm:ss',
			'%%w',' week-day, 0-6, Sun=0',
			'%%y',' last two digits of the year, 00-99\n',
			'example:','date +%%D%%t%%T\ngives "11/05/03 16:50:01"'
		],
		options: [
			'-l','local time (default)',
			'-u','UTC time'
		]
	});

new ManPage('time', {
		synopsis: 'time [-%+ul%-u|u]',
		apropos: 'displays the current time',
		description: 'diplays the time as local (default) or UTC\nas: hours:minutes:seconds [UTC]',
		options: [
			'-l','local time (default)',
			'-u','UTC time'
		]
	});

new ManPage('echo', {
		synopsis: 'echo [<args>]',
		apropos: 'writes all arguments back to the terminal',
		description: 'writes the given arguments back to the terminal',
		arguments: ['<args>','any text separated by any amount of space.']
	});

new ManPage('type', {
		synopsis: 'type [-ipru|-n <num>] [<args>]',
		apropos: 'writes all arguments back employing type styles',
		description: 'writes the given arguments back to the terminal in specified type style.',
		arguments: ['<args>','any text separated by any amount of space.'],
		options: [
			'-n <num>', 'number representing the type style as a bit vector;\nfor details see the other options identifying styles\nby the following characters:',
			'-p', 'plain     (0)',
			'-r', 'reverse   (1)',
			'-u', 'underline (2)',
			'-i', 'italics   (4)',
			'-s', 'stroke    (8)\n',
			'-> example:','"type -n 5 <args>" is same as "type -ir <args>".'
		]
	});

new ManPage('exit', {
		synopsis: 'exit',
		apropos: 'exits the current shell or leaves the session',
		description: 'exits the current shell.\nif the current shell is the login-shell, the session is closed.'
	});

new ManPage('help', {
		synopsis: 'help',
		apropos: 'displays a help screen with complete command list',
		description: 'displays a help screen with a short list of available commands.'
	});

new ManPage('mail', {
		synopsis: 'mail [<user@host>]',
		apropos: 'launches a mail client',
		description: 'opens a mail window to given address or the webmaster if none specified.',
		arguments: ['<user@host>','mail address.']
	});

new ManPage('browse', {
		synopsis: 'browse [-n] [<url>]',
		apropos: 'opens a web page in a new browser window',
		description: 'opens a given url in a new browser window.\nif no url was specified, a standard site is called (<'+conf_defaulturl+'>).',
		arguments: ['<url>','url of a website. protocol defaults to http.'],
		options: ['-n','open in a new browser window. (with JS/UIX 0.3x default value!)']
	});

new ManPage('web', {
		synopsis: 'web [-n] [<url>]',
		apropos: 'opens a web page in a new browser window',
		description: 'synonym for "browse".',
		link: 'browse'
	});

new ManPage('splitmode', {
		synopsis: 'splitmode <mode>',
		apropos: 'switches terminal splitmode (statusline) on/off',
		description: 'displays a statusline to demonstrate screen splitting.\n(splitting will be terminated by the next "clear" command.)',
		arguments: ['<mode>','"on"  switch statusline on\n"off" switch statusline off']
	});

new ManPage('hello', {
		synopsis: 'hello',
		apropos: 'displays a short system information',
		description: 'displays a short information about this system.'
	});

new ManPage('hallo', {
		synopsis: 'hallo',
		apropos: 'displays a short system information',
		description: 'displays a short information about this system.'
	});

new ManPage('info', {
		synopsis: 'info',
		apropos: 'displays information about the site',
		description: 'displays information about this site.\naliases: "masswerk", "mass:werk".'
	});

new ManPage('features', {
		synopsis: 'features',
		apropos: 'displays the features of this application.',
		description: 'displays the features of this application.'
	});

new ManPage('write', {
	synopsis: 'write <args>',
	apropos: 'writes to the terminal employing type styles as mark up.',
	description: 'writes the arguments back to the terminal using type styles.',
	arguments: [
			'<args>', 'any arguments (treated as strings separated by spaces).\ntype styles can be specified as follows:\n %%+<typestyle>  switch type style on\n %%-<typestyle>  switch type style off\n %%n             new line\n %%%             escaped "%%"\nwhere <typestyle> is marked by one the following characters:\n p  plain (+p discards all active styles, -p is ineffective)\n r  reverse\n u  underline\n i  italics\n s  strike.\ntype styles may overlap.\n',
			'-> example:', 'write "Do not use %%+rREVERSE%%-r for 100%%% of the text."'
		]
	});

new ManPage('set', {
	synopsis: 'set [<varname> {<varname>} [= {<value>}]]',
	apropos: 'sets shell-variables, without arguments a full list is displayed',
	description: 'sets a variable in the command shell.\nvariables can be retrieved by "$<varname>" in any term not in single-quotes.\nsee "man sh" for more. to discard a variable use "unset".\nif called without arguments all set variables and values are listed.\n\nThe system supports currently the following special variables:\n  GID      group-id\n  HOME     home directory\n  HOST     login-host\n  PATH     command path\n  PID      process id of current process environment\n  PS       shell prompt\n  UID      user-id\n  USER     user-name\n  VERSION  os/term-version',
	arguments: [
		'<varname>', 'the name of the variable. names must begin with a letter\nand use only the characters "A"-"Z", "0"-"9" or "_".',
		'<value>', 'the value of the variable. use quotes and escapes ("\\") for\ncomplex expressions.\nif no value is assigned, the variable holds an empty value.'
	]
	});

new ManPage('unset', {
	synopsis: 'unset <varname>',
	apropos: 'discards a shell variable',
	description: 'discards a variable defined by "set".\nreserved variables must not be discarded. (see "man set").',
	arguments: [
		'<varname>', 'the name of the variable. names must begin with a letter\nand use only the characters "A"-"Z", "0"-"9" or "_".'
	]
	});

new ManPage('alias', {
	synopsis: 'alias <name> {<value>}',
	apropos: 'sets an alias for a (complex) command',
	description: 'sets an alias that will be used as a command.\naliases can be discarded using "unset".\nif called without arguments, all set aliases are listed.',
	arguments: [
		'<name>', 'the name of the alias. names must begin with a letter\nand use only the characters "A"-"Z", "0"-"9" or "_".',
		'<value>', 'the value of the alias.'
	]
	});

new ManPage('unalias', {
	synopsis: 'unalias <name>',
	apropos: 'discards an alias defined by "alias"',
	description: 'discards an alias defined by "alias".',
	arguments: [
		'<name>', 'the name of the alias. names must begin with a letter\nand use only the characters "A"-"Z", "0"-"9" or "_".'
	]
	});

new ManPage('more', {
	synopsis: 'more <filename>',
	apropos: 'displays long files in a pager',
	description: 'displays the specified file in a pager. if used in a pipe, any lines in STDIN\nwill preceed the content of any specified file. Any outgoing lines in STDOUT\nwill be stripped off of any type-styles.\n\nfor navigation use\n    <SPACE>  for the next page, or\n    "q"      for quit'
	});

new ManPage('wc', {
	synopsis: 'wc [-clw]',
	apropos: 'word count (words, lines, characters)',
	description: 'word count.\ncounts the characters, words, and lines of a specified file or from STDIN.',
	options: [
		'-c','count characters',
		'-l','count lines',
		'-w','count words'
	]
	});

new ManPage('stty', {
	synopsis: 'stty <option>',
	apropos: 'sets terminal options',
	description: 'set terminal options.',
	options: [
		'-a','list all options',
		'-g','list all options in formated output',
		'[-]blink','[no] cursor blinking',
		'[-]block','[no] block cursor',
		'[-]smart','[no] smart console (minimal scrolling)',
		'[-]rows n','[re]set max. terminal line to n',
		'sane','reset to sane values'
	]
	});

new ManPage('ls', {
	synopsis: 'ls <dirname>',
	apropos: 'lists a directory',
	description: 'lists a directory.\n',
	arguments: [
		'<dirname>', 'ralative or absolute file path.\nif called with option "i" or "l" also the name of a plain file.'
	],
	options: [
		'-C','force output to colums',
		'-F','show file type (appended to filename)\n"/" ... directory\n"*" ... executable\n"@" ... link\n<nothing> ... plain file',
		'-L','force output to one file by line',
		'-a','show hidden \'.\'-files.',
		'-i','show inode-id (file serial number)',
		'-l','long output, format:\n"mode  inodes  user  group  bytes  mdate [YYYY/MM/DD hh.mm:ss]  name"'
	]
	});

new ManPage('cd', {
	synopsis: 'cd [<dirname>]',
	apropos: 'changes the current directory',
	description: 'change directory to given path.\nif called without argument, the current working directory will be set to the\nvalue of $HOME.\n\npath/name-conventions:\n    "/" = file-separator\n    "." = current directory\n    ".." = parent directory.'
	});

new ManPage('pwd', {
	synopsis: 'pwd',
	apropos: 'prints the current working directory',
	description: 'print working directory.\noutputs the path of the current working directory.'
	});

new ManPage('cat', {
	synopsis: 'cat <filelist>',
	apropos: 'concatenates and outputs files',
	description: 'concatenate files\njoins any specified files to a new stream.\nany lines in STDIN will preceed the content of theese files.',
	arguments: [
		'<filelist>','any number of file-paths separated by spaces.'
	]
	});

new ManPage('vi', {
	synopsis: 'vi [<filename>]',
	apropos: 'visual editor (simpler version of standard UN*X vi)',
	description: 'opens a (simple) implementation of the visual editor (vi).\ncurrent beta restrictions: no numeral modifiers, no search expressions.\nas the standard vi this implementation is a modal application.\nuse <esc> to enter movements, ":" to enter the command-line, or one of the\ninsert-, append-, change-, replacement-keys to enter edit mode.\n<esc> brings you always back to movements; leave with ":q!" without changes.\n\n%+uBasic Commands%-u: (+<return>)\n\n   :q[uit]            quit (if no changes made)\n   :q[uit]!           forced quit, ignore changes\n   :w [filename]      write [filename]\n   :w! [filename]     forced write, overwrite existing files\n   :wq[!] [filename]  forced write and quit\n   :x[!] [filename]   like "wq" - write only when changes have been made\n   :ZZ                like "x"\n   :1                 display first line\n   :$                 display last line\n   :N                 display line N\n\n%+uCursor Movements%-u:\n\n   h  left  (or cursor)     k  line up   (or cursor)\n   l  right (or cursor)     j  line down (or cursor)\n\n   0  go to the first character of the current line\n   ^  go to the first non-blank character of the current line\n   $  go to the end of the current line\n   -  go up one line and to the first non-blan character\n   +  go down one line and to the first non-blan character\n   w  one word forward\n   b  one word backward\n   e  forward to end of word\n   z  display current-line on top\n\n%+uEditing Comands%-u:\n\n  a   append after cursor\n  A   append after end of line\n  i   insert before cursor\n  I   insert before first non-blank character of the line\n  o   open a new line below the current line\n  O   open a new line above the current line\n  c[motion]  change text (insert between old and new cursor position)\n             (this command is currently restricted to the same line)\n  cc  change the current line\n  C   change to the end of the current line\n  R   replace text\n\n%+uDeleting, Copy and Paste, Undo%-u:\n\n  x   delete character under (and after) the cursor\n  X   delete character before the cursor\n  dd  delete current line and put it in the copy buffer\n  D   delete to end of line\n  J   join lines (delete new line at end of the current line)\n\n  Copy & Paste (currently restricted to lines only):\n\n  yy  yank current line (put to copy buffer)\n  p   put (insert) copy buffer to end line after current line\n  P   put (insert) copy buffer above current line\n\n  u  undo last change\n  U  redo last undo\n\nThis implementation accepts pipes as valid input. If called as "view"\nvi is opened in read only mode.',
	arguments: [
		'<filename>','a file to be opened.'
	]
	});

new ManPage('view', {
		synopsis: 'view [<filename>]',
		apropos: 'vi (visual editor) in view mode (read only)',
		description: 'synonym for "vi" in view-mode (read only mode).\nfiles must be saved with new name or changes will be lost.',
		link: 'vi'
	});

new ManPage('ps', {
	synopsis: 'ps',
	apropos: 'displays current processes',
	description: 'displays a list of active processes with PID (Process-ID) and name.'
	});

new ManPage('pager', {
		synopsis: 'pager <filename>',
		apropos: 'pager (synonym for "more")',
		description: 'synonym for "more".',
		link: 'more'
	});

new ManPage('pg', {
		synopsis: 'pager <filename>',
		apropos: 'pager (synonym for "more")',
		description: 'synonym for "more".',
		link: 'more'
	});

new ManPage('uname', {
		synopsis: 'uname',
		apropos: 'displays the system identification',
		description: 'displays the system identification'
	});

new ManPage('logname', {
		synopsis: 'logname',
		apropos: 'displays the current user name',
		description: 'displays the current user name'
	});

new ManPage('halt', {
		synopsis: 'halt',
		apropos: 'halts / shuts down the system',
		description: 'halt / shut down the system'
	});

new ManPage('reboot', {
		synopsis: 'reboot',
		apropos: 'halts and reboots the system',
		description: 'halt and reboot the system'
	});

new ManPage('cp', {
		synopsis: 'cp [-ipr] <sourcefile> {<sourcefile>} <target>',
		apropos: 'copies files from source to target',
		description: 'copy files from source- to target-file.',
		arguments:[
			'<sourcefile>', 'file(s) or directories to be copied\nif called with multiple source-files the target must be\na directory',
			'<target>', 'the file name of the new file or the name of a directory.'
		],
		options: [
			'-i', 'ignore error warnings',
			'-p', 'copy file permissions',
			'-r', 'recursive - include nested files'
		]
	});

new ManPage('mv', {
		synopsis: 'mv [-i] <filename> {<filename>} <target>',
		apropos: 'moves (renames) files from source to target',
		description: 'move (rename) files from source to target.',
		arguments:[
			'<filename>', 'file(s) or directories to be moved\nif called with multiple files the target must be a directory',
			'<target>', 'the file name of the new file or the name of a directory.'
		],
		options: [
			'-i', 'ignore error warnings'
		]
	});

new ManPage('rm', {
		synopsis: 'rm [-ir] <filename> {<filename>}',
		apropos: 'removes files',
		description: 'remove (discard) files.\nuse "rmdir" or "rm -r" for directories.',
		arguments:[
			'<filename>', 'file(s) to be removed',
		],
		options: [
			'-i', 'ignore error warnings',
			'-r', 'recursive - discard directories and included files'
		]
	});

new ManPage('rmdir', {
		synopsis: 'rmdir [-i] <dirname> {<dirname>}',
		apropos: 'removes /empty) directories',
		description: 'remove (discard) directories.\ndirectories must be empty! use "rm -r" for populated directories.',
		arguments:[
			'<dirname>', 'directory/ies to be removed',
		],
		options: [
			'-i', 'ignore error warnings'
		]
	});

new ManPage('mkdir', {
		synopsis: 'mkdir <dirname> {<dirname>}',
		apropos: 'creates a directory',
		description: 'make one or more new directory/ies',
		arguments:[
			'<dirname>', 'directory/ies to be inited',
		]
	});

new ManPage('which', {
		synopsis: 'which <command>',
		apropos: 'evaluates which command will be executed',
		description: 'evaluates the command path for the given command.\nif the command is found it is displayed with full path-name.',
		arguments:[
			'<command>', 'name of the command to be found.',
		]
	});

new ManPage('su', {
		synopsis: 'su <username>',
		apropos: 'switches user',
		description: 'switch the user.',
		arguments:[
			'<username>', 'user, name must consist of the characters [A-Za-z0-9_]\nonly the first 8 characters are recognized (rest ignored).',
		]
	});

new ManPage('touch', {
		synopsis: 'touch <filenamename> {<filenamename>}',
		apropos: 'sets the timestamp of a file or creates empty file',
		description: 'set the file last modified date (mdate) to current time.\nif the file does\'nt exist an empty file be created.',
		arguments:[
			'<filenamename>', 'name of the file to be modified or created.',
		]
	});

new ManPage('pr', {
		synopsis: 'pr <filelist>',
		apropos: 'prints a file to a browser window',
		description: 'print files (to a new browser window) - ready for copy&paste.',
		arguments:[
			'<filelist>', 'list of files to be printed.\nany content of a lefthand pipe will preceed the content of\nthese files.',
		]
	});

new ManPage('fexport', {
		synopsis: 'fexport',
		apropos: 'exports home-directory for copy and later re-use',
		description: 'file-export and backup.\nexports the files and directories residing in the home-directory (as set in\n$HOME) to a browser form for later re-use. copy this data and keep it on your\nlocal machine for later import. (hidden files won\'t be exported.)\nyou can mount exported files and directories with "fimport".'
	});

new ManPage('fimport', {
		synopsis: 'fimport',
		apropos: 'imports preveously exported file-data to the file-system',
		description: 'imports/mounts exported files and directories to the current home-directory.\nif files or directories with the same name exist, these will have precedence\nover any files on the import-list. timestamps will be set according to import-\ndata. this may back-date directories with newer content.\nsee "fexport" for exporting data.'
	});

new ManPage('shell', {
		synopsis: 'JS/UIX-shell',
		apropos: 'the system shell (command interpreter)',
		description: 'see "sh" for more.',
		link: 'sh'
	});

new ManPage('sh', {
	synopsis: 'shell, commands, aliases, and variables.',
		apropos: 'starts a new system shell (command interpreter)',
	description: 'A simple implementation of sh. As command opens a subshell.\nCurrently the following features are supported:\nquotings, escapes, variables, aliases, pipes, subshells, simple scripts.\n\nQuoting levels:\n   double-quotes  string with variable interpolation\n   single-quotes  literal string without interpolation\n   backticks (`)  will be expanded to the output processed by a subshell called\n                  with this string as its arguments.\n\nCommands may be separated by ";".\nThe pipe-character "|" will stream the output of the left side to the STDIN-\nstream of the command on its right side.\nThe output redirector ">" writes the output of the command to a file specified\non its right side. ">>" appends the output to an existing file if any.\n\nOrder of Interpolation:\nFirst all control-characters ("`", "|", ";", ">", ">>") will be traced, then\nany terms in backticks will be evaluated in a new subshell and the return\nvalues will be inserted and parsed as arguments.\nAfterwards all variables of the current arguments will be expanded. If the\nfirst argument is an alias, the alias will be expanded, its value parsed and\ncopied in front the first remaining argument.\nIn case a backslash ("\\") is found at the end of a line, the line is\nconcatenated with the following one to a single line.\n\nOrder of Execution:\nIf the now first argument is a shell-command (set, unset, alias, unalias, cd)\nit will be executed in the same shell.\nElse, if an executable file with the name of the command is found in any\ndirectory specified in the PATH-variable, this command will be executed in a\nnew sub-process spawned as child of the current shell. If the first argument\ncontains a slash it will be interpretated as relative path-name of a binary\nor an executable shell-script to be processed in a new sub-shell.\nFinally, if the first-argument is not a valid file-name, an error message will\nbe put to STDERR.\n\nPermissions, Modes:\nIn order to be executable a script or command must either be set to execute\nprivileges for the effective user or group or - in the case of a script called\nin the form "sh <filename>" - with sufficient read permissions.\nPermissions can be set using "chmod".\n(Since the shell is the only script-language present, the *magic cookie*\n"#!/bin/sh" may be absent. Permissions take precedence.)\n\nVariable Interpolation:\nVariables will be expanded in any double-quoted or unquoted term.\nUse $<varname> or ${<varname>} to retrieve the value of any defined variable.\nvariables can be hidden from the shell using single-quotes or escapes with\nbackslash ("\\").\n\nPositional Parameters:\nIn shell-scripts the term $<number> - where <number> is in the range 0-9 -\nexpands to positional paramters. $0 will expand to the command or script name\nwhile the variable $1-$9 will give the value of the first argument and so on.\n\nCurrently the system employs a number of special variables:\n  GID      group-id\n  HOME     home directory\n  HOST     login-host\n  PATH     command path\n  PID      process id of current process environment\n  PS       shell prompt\n  UID      user-id\n  USER     user-name (log-name)\n  VERSION  os/term-version\n\nSpecial Files, Command History:\nThere are two special files to the shell:\nThe first is "etc/profile" which is executed by the login-shell on start up\nfor initialization.\nThe second one is "~/.history" where the command history is stored. (You can\naccess the command history using cursor up/down in the command line.)',
	arguments: [
		'<filename>', 'a script to be opened in a subshell',
		'<args>', 'currently, if the first argument is not a valid filename,\nthe arguments will be interpreted as arguments to be executed\nby a new subshell.'
		]
	});

new ManPage('js', {
		synopsis: 'js -l[t]|t <varname>\njs -s[n] <varname> <value>\njs -e <expression>',
		apropos: 'jav'+'as'+'cript evaluation (no user command, experts only; read man!)',
		description: 'jav'+'as'+'cript evaluation (no user command, experts only!).\nlists or sets javascript objects and object properties, evaluates expressions.\nCAUTION: an error in an eval-string will cause an jav'+'as'+'cript-error bringing\ndown the JS/UIX-system! setting a variable may override and harm the system.',
		options: [
			'-l[t]', 'list an object or property',
			'-s[n]', 'set an object\'s value or object\'s property\'s value\n"-sn" for numeric (plain) value (default: string)',
			'-t', 'report object\'s type or object\'s property\'s type',
			'-e', 'eval expression (use single quotes to hide specials from shell)'
		],
		arguments: [
			'<varname>','name of a variable, object or property\nmay be in form of "varname", "varname[index]",\n"varname.prop[index]", "varname[index][index]" and so on.',
			'<value>', 'a numeric or string value for set (option -s)',
			'<expression>','expression to be evaled (option -e)'
		]
	});

new ManPage('chmod', {
		synopsis: 'chmod [-R] <mode> <filelist>\nwhere <mode> is octal number or {u|g|o|a}(+|-){w|r|x|s} or {u|g|o|a}=(o|u|g)',
		apropos: 'changes a files\'s permissions.',
		description: 'change a files\'s permissions for read, write or execute.',
		options: [
			'-R', 'recursive (include nested files and directories).'
		],
		arguments: [
			'<filelist>','file(s) to be set (you must be the file\'s owner).',
			'<mode>', 'either an octal number representing a bit-vector,\nwhere position "x" stands for:\n  00x00 ... user (owner of the file)\n  000x0 ... group\n  0000x ... others\n  0x000 ... sticky-bit\n\nand "x" is a 3-bit value (0-7),\nwhere a set or unset bit represents permissions for:\n  4 ... read\n  2 ... write\n  1 ... execute\n\nor in the form of {u|g|o|a}(+|-){w|r|x|s},\nwhere the first part represents the "who"-part as:\n  u ... user\n  g ... group\n  o ... other\n  a ... all\n\nto be either set (+) or unset (-) to the third part as:\n  w ... write\n  r ... read\n  x ... execute/search\n  s ... sticky-bit\n\nor in the form of {u|g|o|a}=(o|u|g),\nwhere the first part represents the "who"-part as above\nto be set to the value of the third part.\n\n(the current version does not support setUID or setGID.\nthese bits will be ignored.)'
		]
	});

new ManPage('news', {
		synopsis: 'news',
		apropos: 'displays system-news and information on recent changes.',
		description: 'displays system-news and information on recent changes. (displays /etc/news)'
	});

new ManPage('invaders', {
		synopsis: 'invaders',
		apropos: 'starts the well known arcade game.',
		description: 'starts the well kown arcade game: %+ispace invaders%-i for JS/UIX.\nplease note that there is only one life and only one shot at a time.\n\nusage: use cursor <LEFT> and cursor <RIGHT> to move, press <SPACE> to fire.\n(alternatively you may use the vi-movements "h"=left and "l"=right.)\npress "p" for pause, "q" or <ESC> to quit.'
	});

// oef

/*******************************************************************************
 *
 * .rc File
 *
 ******************************************************************************/


function jsuixRC() {

vfsForceFile('/etc/profile', 'f', [
'#!/bin/sh',
'alias -s split splitmode on',
'alias -s unsplit splitmode off',
'set -s PATH = \'/bin /sbin /usr/bin ~\'',
'set -s PS = \'[${USER}@${HOST}:${PID}]\'',
'alias -s ll "ls -l"',
'alias -s bla \'echo "Vergil, Aeneis:" | more /var/testfile\'',
'stty -blink',
'write "                           %+r     Terminal ready.     %-r"',
'echo " $VERSION - The JavaScript virtual OS and terminal application for the web."',
'echo " Type \\"info\\" for site information. Type \\"help\\" for available commands."',
'echo " ------------------------------------------------------------------------------"'
], 0755);

vfsForceFile('/etc/motd', 'f', [
'Aliquando praeterea rideo, iocor, ludo, homo sum. (Plinius iun.)'
], 0664);

vfsForceFile('/var/testfile', 'f', [
"01    Arma virumque cano, Troiae qui primus ab oris",
"02  Italiam fato profugus Laviniaque venit",
"03  litora, multum ille et terris iactatus et alto",
"04  vi superum saeyae memorem Iunonis ob iram",
"05  multa quoque et bello passus, dum conderet urbem",
"06  inferretque deos Latio, genus unde Latinum",
"07  Albanique patres atque altae moenia Romae.",
"08    Musa, mihi causa memora, quo numine laeso",
"09  quidve dolens regina deum tot volvere casus",
"10  insignem pietate virum, tot adire, labores",
"11  inpulerit. tantaene animis caelestibus irae?",
"12    Urbs antiqua fuit - Tyrii tenuere coloni -",
"13  Karthago, Italiam contra Tiberinaque longe",
"14  ostia, dives opum studiisque asperrima belli;",
"15  quam Iuno fertur terris magnis omnibus unam",
"16  posthabita coluisse Samo: hic illus arma,",
"17  hic currus fuit; hoc regnum dea gentibus esse,",
"18  si qua fata sinant, iam tum tenditque fovetque.",
"19  progeniem sed enim Troiano a sanguine duci",
"20  audierat, Tyrias olim quae verteret arces;",
"21  hinc populum late regem belloque superbum",
"22  venturum excidio Libyae: sic volvere Parcas.",
"23  id metuens veterisque memor Saturnia belli,",
"24  prima quod Troiam pro caris gesserat Argis",
"25  - necdum etiam causae irarum saevique dolores",
"26  exciderant animo; manet alta mente repostum",
"27  iudicium Paridis spretaeque iniuria formae",
"28  et genus invisum et rapti Ganymedis honores -",
"29  his accensa super iactatos aequore toto",
"30  Troas, reliquias Danaum qtque inmitis Achilli,",
"31  arcebat longe Latio, multosque per annos",
"32  errabant acti fatis maria omnia circum.",
"33  tantae molis erat Romanam condere gentem.",
"34    Vix e conspectu Siculae telluris in altum",
"35  vela dabant laeti et spumas salis aere ruebant,",
"36  cum Iuno aeternum servans sub pectore volnus",
"37  haec secum 'mene icepto desistere victam",
"38  nec posse Italia Teucrorum avertere classem",
"39  Argivom atque ipsos potuit submergere ponto",
"40  unius ob noxam et furias Aiacis Oilei?",
"41  quippe Iovis rapidum iaculata e nubibus ignem",
"42  disiecitque rates evertitque aequora ventis,",
"43  illum exspirantem transfixo pectore flammas",
"44  turbine corripuit scopuloque inflixit acuto;",
"45  ast ego, quae divom incedo regina, Iovisque",
"46  et sorror et coniunx, una cum gente tot annos",
"47  bella gero. et quisquam numen Iunonis adorat",
"48  praeterea aut supplex aris inponet honrem?'",
"49    Talia flammato secum dea corde volutans",
"50  nimborum in patriam, loca feta furentibus austris,",
"51  Aeoliam venit. hic vasto rex Aeolus antro",
"52  luctantis ventos tempestatesque sonoras",
"53  imperio premit ac vinclis et carcere frenat.",
"54  illi indignantes magno cum murmure montis",
"55  circam claustra fremunt; celsa sedet Aeolus arce",
"56  sceptra tenens mollitque animos et temperat iras.",
"57  ni faciat, maria ac terras caelumque profundum",
"58  quippe ferant rapidi secum verrantque per auras.",
"59  sed pater omnipotens speluncis abdidit atris",
"60  hoc metuens molemque et montis insuper altos",
"61  inposuit remque dedit, qui foedere certo",
"62  et premere et laxas sciret dare iussus habenas.",
"63  ..."
], 0666);

vfsForceFile('/var/test.sh', 'f', [
'# start this file with "/var/test.sh" or "sh /var/test.sh"',
'write "%+istarting test with PID=$PID%-i"',
'write \'%+i> "date":%-i\'; date',
'write \'%+i> "cal -w":%-i\'; cal -w',
'write \'%+i> "cal -w | wc":%-i\'; cal -w | wc',
'write \'%+i> "ls -l /var":%-i\'; ls -l /var',
'write "%+idone.%-i"'
], 0777);

vfsForceFile('/var/lx', 'f', [
'#!/bin/sh',
'# command-test: copy this to /bin/lx (using cp -p)',
'echo  "Content of $1:"',
'ls -C $1',
'echo `ls -l $1 | wc -l` "file(s)."'
], 0777);

vfsForceFile('/etc/news', 'f', [
'%+r JS/UIX News %-r',
'-------------------------------------------------------------------------------',
'Oops: JS/UIX was slashdotted (June 16 2005)!',
'Thanks for mails and comments!',
' ',
'Recent changes:',
' * fixed a new dead keys issue with mac OS (backticks, tilde). [v.0.48]',
' * fixed the key-handler for Safari (fired BACKSPACE twice). [v.0.46]',
' * added ecxeption handling for command "js" for supporting browsers. [v.0.46]',
' * added "/usr/bin/invaders" to demo interactive run time. [v0.45]',
'   yes, it\'s space invaders for JS/UIX!',
' * added a new "smart console" feature for smart scolling. [v.044]',
'   this should avoid most scrolling delays by rendering only visble changes.',
'   the smart console option is activated by default and may be switched on/off',
'   using "stty [-]smart".',
' * fixed a bug in command "which" [v0.43]',
' * added news-feature (displays this file) [v0.42]',
' * fixed "wc" command to work like the real thing. [v0.42]',
' ',
'Any major changes to the system will be posted on this page.',
'Stay tuned to be informed.',
'-------------------------------------------------------------------------------'
], 0644);

}


// must be included as last function for integrety test at start up
function jsuixRX() {
	return true
}

// eof

/*******************************************************************************
 * A quick note on this...all rights belong to mass:werk (N.Landsteiner)
 * This was adapted from JS/UIX as just an experiment.
 ******************************************************************************/
