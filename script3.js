/*
 * Variables
 */

var test = 'this is a test variable';
var selector = $('#selector');
var sourceimage = new Image();

var canvas = $('#original-canvas');
var context = canvas[0].getContext('2d');

var zcanvas = $('#zoom-canvas');
var zcontext = zcanvas[0].getContext('2d');

var scalingfactor = 10; 
var zoomcanvassize = 250;
var totalscale = scalingfactor;
var scrollzoomincrement = 0.25; //decimal between 0 and 1 exclusive.
var minzoomamount = 1;
var maxzoomamount = 25;

var currentcolor = $('#current-color');

var scanvas = $('#simplified-canvas');
var scontext = scanvas[0].getContext('2d');

var savedcolorlist = $('#saved-color-list');
var savedcolors = [];

var originalImageData;
var simplifiedImageData;
var greyscalesavedcolors = [];

/*
 * Functions
 */

function setCanvasSize(canv, canvwidth, canvheight) {
	//WARNING this clears the canvas
	canv.width = canvwidth;
	canv.height  = canvheight;
}

function resetAll() {
	context.clearRect(0, 0, canvas[0].width, canvas[0].height);
	zcontext.clearRect(0, 0, zcanvas[0].width, zcanvas[0].height);
	scontext.clearRect(0, 0, scanvas[0].width, scanvas[0].height);

	// zcontext.scale(scalingfactor/totalscale, scalingfactor/totalscale); //FIX THIS SO IT RESETS THE SCALE WHEN THE ORIGINAL CANVAS IS CHANGED
	zcontext.restore();

	canvas[0].width = 0;
	canvas[0].height = 0;
	scanvas[0].width = 0;
	scanvas[0].height = 0;

	zcanvas[0].style.visibility = 'hidden';

	$('#make-grayscale').attr('checked', false);

	savedcolorlist.empty();
	savedcolors = [];
	console.clear();
	console.log("Reset All");
}

function readSelector(sel) {
	// console.log('selector set to ' + sel.value);
	if (sel.value === 'mushroom') {
		return 'images/mushroom.png';
	} else if (sel.value === 'yoshi') {
		return 'images/yoshi.png';
	} else if (sel.value === 'pikachu') {
		return 'images/pikachu.png';
	} else if (sel.value === 'testing') {
		return 'images/testing.png';
	} else if (sel.value === 'red') {
		return 'images/red.png';
	} else if (sel.value === 'rhino') {
		return 'images/rhino.jpg';
	} else if (sel.value === 'questionmark') {
		return 'images/questionmark.png';
	} else if (sel.value === 'mario') {
		return 'images/marioicon.png';
	} else {
		return null;
	}
}

function getFittingRatio(srcimg, canv) {
	var ratio = 1;
	if (srcimg.width > canv.width || srcimg.height > canv.height) {
		var hRatio = canv.width / srcimg.width;
		var vRatio = canv.height / srcimg.height;
		ratio = Math.min(hRatio, vRatio);
	}
	return ratio;
}

function fitImageToCanvas(srcimg, canv) {
	ratio = getFittingRatio(srcimg, canv);
	canv.width = srcimg.width * ratio;
	canv.height = srcimg.height * ratio;
}

function makeGrayscale(canv, ctx, thisobj) {
	if (thisobj.checked === false) {
		ctx.putImageData(originalImageData,0,0);
	} else {
		var imageData = ctx.getImageData(0,0,canv.width, canv.height);
		var data = imageData.data;
		for (var i = 0; i < data.length; i += 4) {
			var avg = (data[i] + data[i +1] + data[i +2]) / 3;
			data[i]     = avg; // red
			data[i + 1] = avg; // green
			data[i + 2] = avg; // blue
			// data[i + 3] = 1;   // alpha
		}
		ctx.putImageData(imageData, 0, 0);
	}
}

function setImageFromFile(thiselement, srcimg, canv, ctx, sel) {
	sel.append($('<option/>', {
		value: 'none',
		text: 'Select an image',
	}));
	sel.val('none');
	resetAll();
	setCanvasSize(canv, 200, 200);
	if (thiselement.files && thiselement.files[0]) {
		var FR = new FileReader();
		FR.onload = function(e) {
			srcimg.onload = function() {
				var ratio = getFittingRatio(srcimg, canv);
				fitImageToCanvas(srcimg, canv);
				ctx.drawImage(
					srcimg,
					0,
					0,
					srcimg.width,
					srcimg.height,
					0,
					0,
					srcimg.width*ratio,
					srcimg.height*ratio
				);
				originalImageData = context.getImageData(0,0,canvas[0].width, canvas[0].height);
			};
			srcimg.src = e.target.result;
		};
		FR.readAsDataURL(thiselement.files[0]);
	}
}

function setImageFromSelector(srcimg, sel, canv, ctx) {
	var selectorvalue = readSelector(sel[0]);
	if (selectorvalue === null) {
		return;
	} else {
		resetAll();
		setCanvasSize(canv, 200, 200);
		srcimg.onload = function() {
			var ratio = getFittingRatio(srcimg, canv);
			fitImageToCanvas(srcimg, canv);
			ctx.drawImage(
				srcimg,
				0,
				0,
				srcimg.width,
				srcimg.height,
				0,
				0,
				srcimg.width*ratio,
				srcimg.height*ratio
			);
			originalImageData = context.getImageData(0,0,canvas[0].width, canvas[0].height);
		};
		srcimg.src = selectorvalue;
	}

	var selectnone = sel.children("option[value='none']");
	if (selectnone) { selectnone.remove();}
}

function getMousePos(canv, evt) {
	var rect = canv.getBoundingClientRect();
	return {
		x: evt.clientX - Math.floor(rect.left),
		y: evt.clientY - Math.floor(rect.top)
	};
}

function showZoom(scalingfctr, canv, zcanv, ctx, zctx, evt) {
	var mousePos = getMousePos(canv, evt);

	var sx = 0;
	var sy = 0;
	var swidth = canv.width;
	var sheight = canv.height;
	var dx = mousePos.x * -1 - 0.5;
	var dy = mousePos.y * -1 - 0.5;
	var dwidth = canv.width;
	var dheight = canv.height;

	zctx.imageSmoothingEnabled = false;

	//Clear the image drawn at the previous mouse point to stop artifacting on the upper-left edge of the image
	zctx.clearRect(
		zcanv.width/2*-1,
		zcanv.height/2*-1,
		zcanv.width,
		zcanv.height
	);

	//Draw the zoomed image to the zoom canvas
	zctx.drawImage(
		canv,
		sx,
		sy,
		swidth,
		sheight,
		dx,
		dy,
		dwidth,
		dheight
	);

	//Draw the small square in the center of the zoom canvas
	// var boxlinewidth = 2/scalingfctr;
	var boxlinewidth = 4/scalingfctr;

	var boxwidth = 1;
	var boxheight = 1;

	// var boxx = boxwidth/-2;
	// var boxy = boxheight/-2;

	var boxx = boxwidth/-2;
	var boxy = boxheight/-2;

	zctx.strokeStyle = 'black';
	zctx.lineWidth = boxlinewidth;
	zctx.strokeRect(
		boxx,
		boxy,
		boxwidth,
		boxheight
	);
}

function getNewScale(minzmamount, maxzmamount, changeinnewscale, evt) {	
		var newscalingfactor = 1;

		var newtotalscale;

		if (evt.deltaY > 0) {
			//zoom in
			console.log('zoomed in');
			newtotalscale = totalscale*(newscalingfactor+changeinnewscale);

			if (newtotalscale > maxzmamount) {
				console.log('special case');
				console.log('newscalingfactor = ', newscalingfactor);
				newscalingfactor = maxzmamount/totalscale;
				console.log('newscalingfactor = ', newscalingfactor);
				console.log('totalscale = ', totalscale);
				totalscale = totalscale*newscalingfactor;
				console.log('totalscale = ', totalscale);
			} else {
				newscalingfactor = newscalingfactor + changeinnewscale;
				console.log(newscalingfactor);
				totalscale = totalscale*newscalingfactor;
				console.log(totalscale);
			}

		} 

		if (evt.deltaY < 0 ) {
			//zoom out
			console.log('zoomed out');
			newtotalscale = totalscale*(newscalingfactor-changeinnewscale);

			if (newtotalscale < minzmamount) {
				console.log('special case');
				console.log('newscalingfactor = ', newscalingfactor);
				newscalingfactor = minzmamount/totalscale;
				console.log('newscalingfactor = ', newscalingfactor);
				console.log('totalscale = ', totalscale);
				totalscale = totalscale*newscalingfactor;
				console.log('totalscale = ', totalscale);
			} else {
				newscalingfactor = newscalingfactor - changeinnewscale;
				console.log(newscalingfactor);
				totalscale = totalscale*newscalingfactor;
				console.log(totalscale);
			}

		} 
		console.log('newscalingfactor = ', newscalingfactor);
		console.log('totalscale = ', totalscale);
		return newscalingfactor;
}

function existsInArray(needle, haystack){
  var i, j, current;
  for(i = 0; i < haystack.length; ++i){
    if(needle.length === haystack[i].length){
      current = haystack[i];
      for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
      if(j === needle.length)
        return i;
    }
  }
  return -1;
}

function getColorUnderMouse(canv, ctx, ev) {
	var mousePos = getMousePos(canv, ev);
	var canvasColor = ctx.getImageData(
		mousePos.x,
		mousePos.y,
		1,
		1)
		.data;
	var r = canvasColor[0];
	var g = canvasColor[1];
	var b = canvasColor[2];
	var a = canvasColor[3]/255;

	return [r,g,b,a];
}

function updateSelectedColor(canv, ctx, ev) {
	var colorarray = getColorUnderMouse(canv, ctx, ev);

	$('#selected-color').css('background-color', 'rgba(' + colorarray[0] + ',' + colorarray[1] + ',' + colorarray[2] + ',' + colorarray[3] +')');
	$('#current-color-rgba').html(' rgba(' + colorarray[0] + ',' + colorarray[1] + ',' + colorarray[2] + ',' + colorarray[3] +')');
}

function showHideSimplifyColorsButton(svdcolors) {
	if (svdcolors.length === 2 && $('#simplify-colors-button').is(":visible") === false) {
		// console.log('Showing Simplify Colors Button');
		$('#simplify-colors-button').show();
	} else if (svdcolors.length === 1 && $('#simplify-colors-button').is(":visible") === true) {
		// console.log('Hiding Simplify Colors Button');
		$('#simplify-colors-button').hide();
	}
}

function saveColor(canv, ctx, colorlist, svdcolors, ev) {
	var colorarray = getColorUnderMouse(canv, ctx, ev);

	var alreadysaved = existsInArray(colorarray, svdcolors);

	if ( alreadysaved > -1) {
		alert("You've already saved color "+"rgba(" + colorarray[0] + "," + colorarray[1] + "," + colorarray[2] + "," + colorarray[3] +")");
		return;
	}

	if (svdcolors.length >= 10) {
		alert("You have already saved 10 colors. Too many colors won't look right. Remove some colors before continuing.");
		return;
	}

	var savedcolorlistitem = $('<tr>', {
		'class': 'saved-color'
	}).appendTo(colorlist);

	var countertd = $('<td>').appendTo(savedcolorlistitem);

	var colorswatch = $('<td>', {
		'class': 'color-swatch',
		'style': 'background-color: rgba(' + colorarray[0] + ',' + colorarray[1] + ',' + colorarray[2] + ',' + colorarray[3] +')'
	}).appendTo(savedcolorlistitem);


	var rgbatext = $('<td>', {
		'html': ' rgba(' + colorarray[0] + ',' + colorarray[1] + ',' + colorarray[2] + ',' + colorarray[3] +') '
	}).appendTo(savedcolorlistitem);

	var removetd = $('<td>').appendTo(savedcolorlistitem);

	var removebutton = $('<button>', {
		'class': 'remove',
		'html': 'Remove'
	}).appendTo(removetd);


	svdcolors.push(colorarray);

	removebutton.on('click', function() {
		removeSavedColor($(this), svdcolors);
		showHideSimplifyColorsButton(svdcolors);
	});

	showHideSimplifyColorsButton(svdcolors);
}

function removeSavedColor(clickedelement, colorlist) {
	var listelement = clickedelement.closest('tr');
	var index = listelement.prevAll().length;
	colorlist.splice(index, 1);
	listelement.remove();
}


function simplifyColors(canv, ctx, scanv, sctx, svdcolors) {
	var imageData = ctx.getImageData(0, 0, canv.width, canv.height);
	var data = imageData.data;

	for (var pixel = 0; pixel < data.length; pixel+=4) {
		var distances = [];

		var rdata = data[pixel];
		var gdata = data[pixel+1];
		var bdata = data[pixel+2];

		//GRAYSCALE THE ORIGINAL IMAGE
		var avg = (rdata + gdata + bdata) / 3;
		avg = Math.round(avg);
		rdata = avg; // red
		gdata = avg; // green
		bdata = avg; // blue

		for (var savedcolor = 0; savedcolor < svdcolors.length; savedcolor++){
			var rsaved = svdcolors[savedcolor][0];
			var gsaved = svdcolors[savedcolor][1];
			var bsaved = svdcolors[savedcolor][2];

			//GRAYSCALE THE SAVED COLORS
			var savedavg = (rsaved + gsaved + bsaved) / 3;
			savedavg = Math.round(savedavg);
			rsaved = savedavg; // red
			gsaved = savedavg; // green
			bsaved = savedavg; // blue


			if (rdata === rsaved && gdata === gsaved && bdata === bsaved) {
				distances.push(0);
				break;
			}

			//FULL COLOR SIMPLIFICATION
			// var dist = Math.sqrt(Math.pow(rsaved-rdata,2)+Math.pow(gsaved-gdata,2)+Math.pow(bsaved-bdata,2));

			//GRAYSCALE SIMPLIFICATION
			var dist = Math.abs(rsaved-rdata);

			distances.push(dist);
		}

		var shortestdistindex = distances.indexOf(Math.min.apply(this,distances));

		//FULL COLOR SIPLIFICATION
		// data[pixel] = svdcolors[shortestdistindex][0];
		// data[pixel+1] = svdcolors[shortestdistindex][1];
		// data[pixel+2] = svdcolors[shortestdistindex][2];

		//GRAYSCALE SIMPLIFICATION
		var shortestavg = (svdcolors[shortestdistindex][0] + svdcolors[shortestdistindex][1] + svdcolors[shortestdistindex][2])/3;
		data[pixel]   = shortestavg;
		data[pixel+1] = shortestavg;
		data[pixel+2] = shortestavg;
	}
	scanv.width = canv.width;
	scanv.height = canv.height;

	sctx.putImageData(imageData,0,0);

	simplifiedImageData = imageData;


	//SAVE GRAYSCALE COLORS
	greyscalesavedcolors = [];
	for (var color = 0; color < svdcolors.length; color++){
		var savg = (svdcolors[color][0] + svdcolors[color][1] + svdcolors[color][2]) / 3;
		savg = Math.round(savg);
		greyscalesavedcolors.push(savg); 
	}

}

// function copyTextToClipboard(text) {
//  	var textArea = document.createElement("textarea");
// 	textArea.value = text;

// 	document.body.appendChild(textArea);

// 	textArea.select();

// 	try {
// 		var successful = document.execCommand('copy');
// 		var msg = successful ? 'successful' : 'unsuccessful';
// 		console.log('Copying text command was ' + msg);
// 	} catch (err) {
// 		console.log('Oops, unable to copy');
// 	}
// 	document.body.removeChild(textArea);
// }

function generateArray(sdata, gcolors, scanv) {
	// var text = '[';

	var valuearray = [];
	var jscadarray = [];
	var rowarray = [];

	function sortDescending(a, b) {return b - a;}
	var sortedcolors = gcolors.sort(sortDescending);

	for (var pixel = 0; pixel < sdata.data.length; pixel+=4) {
		if (sdata.data[pixel+3] === 0) { //correct for transparent black pixels TEST THIS
			sdata.data[pixel] = 255;
			sdata.data[pixel+1] = 255;
			sdata.data[pixel+2] = 255;
			sdata.data[pixel+3] = 255;
		}
		var value = $.inArray(sdata.data[pixel], sortedcolors)+1; //index plus one in sortedcolors that matches the value of the red pixel in sdata
		valuearray.push(value);
	}

	for (var i = 0; i < valuearray.length; i++) {
		rowarray.push(valuearray[i]);

		if ((i+1) % scanv.width === 0) {
			jscadarray.push(rowarray);
			rowarray = [];
		}
	}
 
 	var stringarray = JSON.stringify(jscadarray);
 	// console.log('stringarray = ', stringarray);
 	// copyTextToClipboard(stringarray);
 	return stringarray;
 	// $('.copied.original')[0].style.display = 'hidden';
 	// $('.copied.original').fadeOut();
  // 	copiedtext.fadeIn().delay(1500).fadeOut();
}

function generateArrayOriginal(odata, canv) {

	var uniquecolors = [];
	var origdata 	 = odata.data;
	var valuearray 	 = [];
	var jscadarray 	 = [];
	var rowarray 	 = [];

	for (var i = 0; i < origdata.length; i += 4) {
		if (origdata[i+3] === 0) { //correct for transparent black pixels TEST THIS
			origdata[i] = 255;
			origdata[i+1] = 255;
			origdata[i+2] = 255;
			origdata[i+3] = 255;
		}
		var avg = Math.round((origdata[i] + origdata[i +1] + origdata[i +2]) / 3);
		origdata[i]     = avg; // red
		origdata[i + 1] = avg; // green
		origdata[i + 2] = avg; // blue

		if ($.inArray(avg, uniquecolors) === -1) {
			uniquecolors.push(avg);
		}
	}

	function sortDescending(a, b) {return b - a;}
	var sorteduniquecolors = uniquecolors.sort(sortDescending);

	// console.log('sorteduniquecolors = ', sorteduniquecolors);


	for (var pixel = 0; pixel < origdata.length; pixel+=4) {
		var value = $.inArray(origdata[pixel], sorteduniquecolors)+1; //index plus one in sortedcolors that matches the value of the red pixel in sdata
		valuearray.push(value);
	}

	for (var j = 0; j < valuearray.length; j++) {
		rowarray.push(valuearray[j]);

		if ((j+1) % canv.width === 0) {
			jscadarray.push(rowarray);
			rowarray = [];
		}
	}

 	var stringarray = JSON.stringify(jscadarray);
 	// console.log('stringarray = ', stringarray);
 	// copyTextToClipboard(stringarray);
 	return stringarray;
 	// $('.copied.simplified').fadeOut();
  // 	copiedtext.fadeIn().delay(1500).fadeOut();
}

/*
 * Main
 */

$(window).load( function() {
	setImageFromSelector(sourceimage, selector, canvas[0], context);
	$('#simplify-colors-button').hide();
	zcanvas[0].style.visibility = 'hidden';
	currentcolor[0].style.visibility = 'hidden';
	zcanvas[0].width = zoomcanvassize;
	zcanvas[0].height = zoomcanvassize;
	zcontext.translate(zoomcanvassize/2, zoomcanvassize/2);
	zcontext.scale(scalingfactor, scalingfactor);
	zcontext.save();
});

selector.change( function() {
	setImageFromSelector(sourceimage, selector, canvas[0], context);

});

$('#file-upload').change( function() {
	setImageFromFile(this, sourceimage, canvas[0], context, selector);

});

$('#make-grayscale').click( function() {
	makeGrayscale(canvas[0], context, this);
});

canvas.mouseenter( function() {
	zcanvas[0].style.visibility = 'visible';
	currentcolor[0].style.visibility = 'visible';
	// console.log('zcanvas is visible');
});
canvas.mouseout( function() {
	zcanvas[0].style.visibility = 'hidden';
	currentcolor[0].style.visibility = 'hidden';
	// console.log('zcanvas is hidden');
});

canvas.mousemove( function(e) {
	updateSelectedColor(canvas[0], context, e);
	showZoom(totalscale, canvas[0], zcanvas[0], context, zcontext, e);
});

canvas.mousewheel(function (e) {
	console.log('e.deltaY = ', e.deltaY);
	e.preventDefault();
	var newscalingfactor = getNewScale(minzoomamount, maxzoomamount, scrollzoomincrement, e );
	zcontext.scale(newscalingfactor, newscalingfactor);
	showZoom(totalscale, canvas[0], zcanvas[0], context, zcontext, e);
});

canvas.click( function(e) {
	saveColor(canvas[0], context, savedcolorlist, savedcolors, e);
});

$('#simplify-colors-button').click( function() {
	simplifyColors(canvas[0], context, scanvas[0], scontext, savedcolors);
});

scanvas.mouseenter( function() {
	zcanvas[0].style.visibility = 'visible';
});
scanvas.mouseout( function() {
	zcanvas[0].style.visibility = 'hidden';
});

scanvas.mousemove( function(e) {
	updateSelectedColor(scanvas[0], scontext, e);
	showZoom(totalscale, scanvas[0], zcanvas[0], scontext, zcontext, e);
});

$('#create-simplified').click( function() {
	$('td:contains("New Bitmap Array").caption').next().children('input').val(generateArray(simplifiedImageData, greyscalesavedcolors, scanvas[0]));
	$('.parameterstable').next('button:contains("Update")').trigger('click');
});

$('#create-original').click( function() {
	$('td:contains("New Bitmap Array").caption').next().children('input').val(generateArrayOriginal(originalImageData, canvas[0]));
	$('.parameterstable').next('button:contains("Update")').trigger('click');

});


