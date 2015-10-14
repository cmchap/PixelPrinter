/*
 * Variables
 */

var selector = $('#selector');
var sourceimage = new Image();

var canvas = $('#original-canvas');
var context = canvas[0].getContext('2d');

var hcanvas = document.createElement("canvas");
var hcontext = hcanvas.getContext("2d");

var hscanvas = document.createElement("canvas");
var hscontext = hscanvas.getContext("2d");

var currentcolor = $('#current-color');

var scanvas = $('#simplified-canvas');
var scontext = scanvas[0].getContext('2d');

var savedcolorlist = $('#saved-color-list');
var savedcolors = [];

var originalImageData;
var simplifiedImageData;
var grayscalesavedcolors = [];

/*
 * Functions
 */

function resetAll() {
	context.clearRect(0, 0, canvas[0].width, canvas[0].height);
	hcontext.clearRect(0,0, hcanvas.width, hcanvas.height);
	scontext.clearRect(0, 0, scanvas[0].width, scanvas[0].height);

	scanvas.hide();
	$('#create-simplified').hide();
	$('#simplify-colors-button').hide();

	savedcolorlist.empty();
	savedcolors = [];
	console.clear();
	console.log("Reset All");
}

function readSelector(sel) {
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

// Returns a value greater than 1 when A is larger than B in width or height.
function getFittingMultiplier(A, B) {
	var ratio = 1;
	var hRatio = A.width / B.width;
	var wRatio = A.height / B.height;
	ratio = Math.min(hRatio, wRatio);
	return ratio;
}

// Resize A to fit its longest side into B.
function fitAToB(A, B) {
	A.width = B.width;
	A.height = B.height;
}

function setImageFromFile(thiselement, srcimg, canv, ctx, hcanv, hctx, sel) {
	sel.append($('<option/>', {
		value: 'none',
		text: 'Select an image',
	}));
	sel.val('none');
	resetAll();
	if (thiselement.files && thiselement.files[0]) {
		var FR = new FileReader();
		FR.onload = function(e) {
			srcimg.onload = function() {
				var ratio = getFittingMultiplier(canv, srcimg);
				fitAToB(hcanv, srcimg);
				canv.width = srcimg.width*ratio;
				canv.height = srcimg.height*ratio;
				ctx.imageSmoothingEnabled = false;
				ctx.scale(ratio,ratio);
				ctx.drawImage(
					srcimg,
					0,
					0
				);
				hctx.drawImage(
					srcimg,
					0,
					0
				);
				ctx.scale(1/ratio,1/ratio);
				originalImageData = hctx.getImageData(0,0,hcanv.width, hcanv.height);
			};
			srcimg.src = e.target.result;
		};
		FR.readAsDataURL(thiselement.files[0]);
	}
}

function setImageFromSelector(srcimg, sel, canv, ctx, hcanv, hctx) {
	var selectorvalue = readSelector(sel[0]);
	if (selectorvalue === null) {
		return;
	} else {
		resetAll();
		srcimg.onload = function() {
			var ratio = getFittingMultiplier(canv, srcimg);
			fitAToB(hcanv, srcimg);
			canv.width = srcimg.width*ratio;
			canv.height = srcimg.height*ratio;
			ctx.imageSmoothingEnabled = false;
			ctx.scale(ratio,ratio);
			ctx.drawImage(
				srcimg,
				0,
				0
			);
			hctx.drawImage(
				srcimg,
				0,
				0
			);
			ctx.scale(1/ratio,1/ratio);
			originalImageData = hctx.getImageData(0,0,hcanv.width, hcanv.height);
		};
		srcimg.src = selectorvalue;
	}
}

function getMousePos(canv, evt) {
	var rect = canv.getBoundingClientRect();
	return {
		x: evt.clientX - Math.floor(rect.left),
		y: evt.clientY - Math.floor(rect.top)
	};
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
		$('#simplify-colors-button').show();
	} else if (svdcolors.length === 1 && $('#simplify-colors-button').is(":visible") === true) {
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


function simplifyColors(hcanv, hctx, scanv, sctx, hscanv, hsctx, svdcolors, srcimg) {
	sctx.restore();
	sctx.clearRect(0,0,scanv.width,scanv.height);
	var ratio = getFittingMultiplier(scanv, hcanv);
	var imageData = hctx.getImageData(0, 0, hcanv.width, hcanv.height);
	var data = imageData.data;

	scanv.width = srcimg.width*ratio;
	scanv.height = srcimg.height*ratio;
	sctx.imageSmoothingEnabled = false;

	for (var value = 0; value < data.length; value+=4) {
		var distances = [];
		var rdata = data[value];
		var gdata = data[value+1];
		var bdata = data[value+2];

		for (var color = 0; color < svdcolors.length; color++) {
			var rsaved = svdcolors[color][0];
			var gsaved = svdcolors[color][1];
			var bsaved = svdcolors[color][2];

			if (rdata == rsaved && gdata == gsaved && bdata == gsaved) {
				distances.push(0);
			} 
			else {
				var rdist = Math.pow(rsaved-rdata,2);
				var gdist = Math.pow(gsaved-gdata,2);
				var bdist = Math.pow(bsaved-bdata,2);

				var dist = Math.sqrt(rdist+gdist+bdist);
				distances.push(dist);
			}
		}
		var shortestdistindex = distances.indexOf(Math.min.apply(Math,distances));
		var shortestavg = (svdcolors[shortestdistindex][0] + svdcolors[shortestdistindex][1] + svdcolors[shortestdistindex][2]) / 3;
		data[value]   = shortestavg;
		data[value+1] = shortestavg;
		data[value+2] = shortestavg;
	}

	fitAToB(hscanv, srcimg);
	hsctx.putImageData(imageData,0,0);

	sctx.scale(ratio,ratio);
	sctx.drawImage(hscanv,0,0);
	sctx.scale(1/ratio,1/ratio);


	simplifiedImageData = imageData;


	// SAVE GRAYSCALE COLORS
	grayscalesavedcolors = [];
	for (var fullcolor = 0; fullcolor < svdcolors.length; fullcolor++) {
		var savg = (svdcolors[fullcolor][0] + svdcolors[fullcolor][1] + svdcolors[fullcolor][2]) / 3;
		savg = Math.round(savg);
		grayscalesavedcolors.push(savg); 
	}

}

function sortDescending(a, b) {return b - a;}

function generateArray(sdata, gcolors, hscanv) {

	var valuearray = [];
	var jscadarray = [];
	var rowarray = [];

	// var sortedcolors = gcolors.sort(sortDescending);

	var sortedcolors = gcolors;

	for (var pixel = 0; pixel < sdata.data.length; pixel+=4) {
		if (sdata.data[pixel+3] === 0) { //"correct" for transparent black pixels
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

		if ((i+1) % hscanv.width === 0) {
			jscadarray.push(rowarray);
			rowarray = [];
		}
	}
 
 	var stringarray = JSON.stringify(jscadarray);
 	return stringarray;
}

function generateArrayOriginal(odata, hcanv) {

	var uniquecolors = [];
	var origdata 	 = odata.data;
	var valuearray 	 = [];
	var jscadarray 	 = [];
	var rowarray 	 = [];

	for (var i = 0; i < origdata.length; i += 4) {
		if (origdata[i+3] === 0) { //"correct" for transparent black pixels
			origdata[i] = 255;
			origdata[i+1] = 255;
			origdata[i+2] = 255;
			origdata[i+3] = 255;
		}
		var avg = Math.round((origdata[i] + origdata[i +1] + origdata[i +2]) / 3);
		origdata[i]     = avg; // red
		origdata[i + 1] = avg; // green
		origdata[i + 2] = avg; // blue

		//add unique colors to a list
		if ($.inArray(avg, uniquecolors) === -1) {
			uniquecolors.push(avg);
		}
	}

	var sorteduniquecolors = uniquecolors.sort(sortDescending);


	for (var pixel = 0; pixel < origdata.length; pixel+=4) {
		var value = $.inArray(origdata[pixel], sorteduniquecolors)+1; //index plus one in sortedcolors that matches the value of the red pixel in sdata
		valuearray.push(value);
	}

	for (var j = 0; j < valuearray.length; j++) {
		rowarray.push(valuearray[j]);

		if ((j+1) % hcanv.width === 0) {
			jscadarray.push(rowarray);
			rowarray = [];
		}
	}

 	var stringarray = JSON.stringify(jscadarray);
 	return stringarray;
}

/*
 * Main
 */

$(window).load( function() {
	setImageFromSelector(sourceimage, selector, canvas[0], context, hcanvas, hcontext);
	$('#simplify-colors-button').hide();
	context.imageSmoothingEnabled = false;
	hcontext.imageSmoothingEnabled = false;
	scontext.imageSmoothingEnabled = false;
	hscontext.imageSmoothingEnabled = false;
	scanvas.hide();
	$('#create-simplified').hide();
	currentcolor[0].style.visibility = 'hidden';
	scontext.save();
});

selector.change( function() {
	setImageFromSelector(sourceimage, selector, canvas[0], context, hcanvas, hcontext);
});

$('#file-upload').change( function() {
	setImageFromFile(this, sourceimage, canvas[0], context, hcanvas, hcontext, selector);

});

canvas.mouseenter( function() {
	currentcolor[0].style.visibility = 'visible';
});
canvas.mouseout( function() {
	currentcolor[0].style.visibility = 'hidden';
});

canvas.mousemove( function(e) {
	updateSelectedColor(canvas[0], context, e);
});

canvas.click( function(e) {
	saveColor(canvas[0], context, savedcolorlist, savedcolors, e);
});

$('#simplify-colors-button').click( function() {
	simplifyColors(hcanvas, hcontext, scanvas[0], scontext, hscanvas, hscontext, savedcolors, sourceimage);
	scanvas.show();
	$('#create-simplified').show();
});

$('#create-simplified').click( function() {
	$('.parameterstable td.caption:contains("New Bitmap Array")').next().children('input').val(generateArray(simplifiedImageData, grayscalesavedcolors, hscanvas));
	$('.parameterstable').next('button:contains("Update")').trigger('click');
});

$('#create-original').click( function() {
	$('.parameterstable td.caption:contains("New Bitmap Array")').next().children('input').val(generateArrayOriginal(originalImageData, hcanvas));
	$('.parameterstable').next('button:contains("Update")').trigger('click');

});


