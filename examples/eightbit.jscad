function eightBit(bitmap, block_size, color_array) {
	var o = [];
	var number_of_rows = bitmap.length;
	var number_of_columns = bitmap[0].length;
	bitmap.forEach(function (row, rowCounter) {
		row.forEach(function (pixel, columnCounter) {
			if (pixel !== 0){
				o.push(cube({size: [block_size, block_size, pixel*block_size]})
					.translate([columnCounter*block_size, rowCounter*block_size*-1, 0])
					.translate([number_of_columns/-2*block_size, number_of_rows/2*block_size, 0]) //center
				    .setColor(color_array)
				);
			}
		});
	});
	
// 	o = union(o);
	
	return o;
}

function convertBitmap(bitmap, ones, twos, threes, fours, fives, sixes, sevens, eights, nines, tens) {
	bitmap.forEach(function (row, rowCounter) {
		row.forEach(function (pixel, columnCounter, arr) {
			if (pixel !== 0) {
				if (pixel === 1) {
					arr[columnCounter] = ones;
				} else if (pixel === 2) {
					arr[columnCounter] = twos;
				} else if (pixel === 3) {
					arr[columnCounter] = threes;
				} else if (pixel === 4) {
					arr[columnCounter] = fours;
				} else if (pixel === 5) {
					arr[columnCounter] = fives;
				} else if (pixel === 6) {
					arr[columnCounter] = sixes;
				} else if (pixel === 7) {
					arr[columnCounter] = sevens;
				} else if (pixel === 8) {
					arr[columnCounter] = eights;
				} else if (pixel === 9) {
					arr[columnCounter] = nines;
				} else if (pixel === 10) {
					arr[columnCounter] = tens;
				}
			}
		});
	});
	return bitmap;
}

function thicken(bitmap, thickness) {
	bitmap.forEach(function (row, rowCounter) {
		row.forEach(function (pixel, columnCounter, arr) {
			if (pixel !== 0) {
				arr[columnCounter] = pixel+thickness;
			}
		});
	});
	return bitmap;
}

function arrayMax(arr) {
	var len = arr.length, max = -Infinity;
	while (len--) {
		if (arr[len] > max) {
			max = arr[len];
		}
	}
	return max;
}

function invertBitmap(bitmap) {
	var maxvalue = bitmap.reduce(function(max, arr) {
    	return max >= arr[0] ? max : arr[0];
	}, -Infinity);

	bitmap.forEach(function (row, rowCounter) {
		row.forEach(function (pixel, columnCounter, arr) {
			arr[columnCounter] = maxvalue - pixel + 1;
		});
	});
	return bitmap;
}

function getParameterDefinitions() {
	return [
		{
			name: 'model',
			type: 'choice',
			caption: 'Model',
			values: ["RUNMAR", "STANDMAR", "RACCOONMAR", "GOOBA", "ONEUP", "QUESTIONMARK", "PIKA"],
			captions: ["Running Mario", "Standing Mario", "Raccoon Mario", "Gooba", "1+", "Question Mark Block", "Pikachu"],
			initial: "ONEUP"
		},
		{
			name: 'thickness',
			type: 'float',
			initial: 0,
			caption: 'Additional Thickness (mm)'
		},
		// {
		// 	name: 'size_of_block',
		// 	type: 'float',
		// 	initial: 1,
		// 	caption: 'Pixel size (mm)'
		// },
		// {
		// 	name: 'invert',
		// 	type: 'choice',
		// 	caption: 'Invert Heights',
		// 	values: ['NO', 'YES'],
		// 	captions: ['No','Yes'],
		// 	initial: 'No'
		// },
		{
			name: 'multiplier',
			type: 'float',
			initial: 1,
			caption: 'Multiplier'
		},{
			name: 'ones',
			type: 'float',
			initial: 1,
			caption: 'Ones'
		},
		{
			name: 'twos',
			type: 'float',
			initial: 2,
			caption: 'Twos'
		},
		{
			name: 'threes',
			type: 'float',
			initial: 3,
			caption: 'Threes'
		},
		{
			name: 'fours',
			type: 'float',
			initial: 4,
			caption: 'Fours'
		},
		{
			name: 'fives',
			type: 'float',
			initial: 5,
			caption: 'Fives'
		},
		{
			name: 'sixes',
			type: 'float',
			initial: 6,
			caption: 'Sixes'
		},
		{
			name: 'sevens',
			type: 'float',
			initial: 7,
			caption: 'Sevens'
		},
		{
			name: 'eights',
			type: 'float',
			initial: 8,
			caption: 'Eights'
		},
		{
			name: 'nines',
			type: 'float',
			initial: 9,
			caption: 'Nines'
		},
		{
			name: 'tens',
			type: 'float',
			initial: 10,
			caption: 'Tens'
		},
		{ 	name: 'bitmaparray',
			initial: "",
			type: 'text',
			caption: 'New Bitmap Array'
		},
		{
		    name: 'color',
		    default: [0.968627451, 0.28627451, 0.007843137],
		    type: 'color',
		    caption: 'Color'
		}
	];
}

function main(params) {
	var bitmap = [];
	switch (params.model) {
		case "RUNMAR":
			bitmap = [
				[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,0,0,3,3,3,3,3,3,0,0,0,0,0],
				[1,1,1,3,3,3,3,3,3,3,3,3,0,0,0,0],
				[2,2,2,0,1,2,1,1,1,2,2,2,0,0,0,0],
				[2,2,2,1,1,2,1,1,1,1,2,1,2,0,0,0],
				[0,1,1,1,2,1,1,1,1,2,2,1,2,0,0,0],
				[0,0,2,2,2,2,1,1,1,1,1,2,2,0,0,0],
				[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
				[0,0,0,0,3,2,2,2,3,2,2,2,2,2,0,0],
				[2,0,0,3,2,2,2,3,2,2,2,2,2,2,2,0],
				[2,0,0,3,3,3,3,3,2,2,2,2,2,2,1,1],
				[2,2,3,1,3,3,1,3,3,2,3,3,0,1,1,1],
				[2,2,3,3,3,3,3,3,3,3,3,3,2,0,1,0],
				[2,2,3,3,3,3,3,3,3,3,3,2,2,2,0,0],
				[0,0,0,0,0,3,3,3,3,3,3,3,2,2,2,0],
				[0,0,0,0,0,0,0,0,3,3,3,3,0,0,2,0]
			];
			break;
		case "GOOBA":
			bitmap = [
				[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
				[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
				[0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
				[0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
				[0,0,1,2,2,1,1,1,1,1,1,2,2,1,0,0],
				[0,1,1,1,0,2,1,1,1,1,2,0,1,1,1,0],
				[0,1,1,1,0,2,2,2,2,2,2,0,1,1,1,0],
				[1,1,1,1,0,2,0,1,1,0,2,0,1,1,1,1],
				[1,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[0,1,1,1,1,2,2,2,2,2,2,1,1,1,1,0],
				[0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
				[0,0,0,0,2,2,2,2,2,2,2,2,1,1,0,0],
				[0,0,0,1,1,2,2,2,2,2,1,1,1,1,1,0],
				[0,0,0,0,1,1,1,2,2,2,1,1,1,1,1,0],
				[0,0,0,0,0,1,1,1,2,0,1,1,1,1,0,0]
			];
			break;
		case "STANDMAR":
			bitmap = [
				[0,0,0,3,3,3,3,3,0,0,0,0],
				[0,0,3,3,3,3,3,3,3,3,3,0],
				[0,0,2,2,2,1,1,2,1,0,0,0],
				[0,2,1,2,1,1,1,2,1,1,1,0],
				[0,2,1,2,2,1,1,1,2,1,1,1],
				[0,2,2,1,1,1,1,2,2,2,2,0],
				[0,0,0,1,1,1,1,1,1,1,0,0],
				[0,0,2,2,3,2,2,2,0,0,0,0],
				[0,2,2,2,3,2,2,3,2,2,2,0],
				[2,2,2,2,3,3,3,3,2,2,2,2],
				[1,1,2,3,1,3,3,1,3,2,1,1],
				[1,1,1,3,3,3,3,3,3,1,1,1],
				[1,1,3,3,3,3,3,3,3,3,1,1],
				[0,0,3,3,3,0,0,3,3,3,0,0],
				[0,2,2,2,0,0,0,0,2,2,2,0],
				[2,2,2,2,0,0,0,0,2,2,2,2]
			];
			break;
		case "RACCOONMAR":
			bitmap = [
				[0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,2,2,1,0,1,1,1,1,2,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,3,3,3,3,2,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,3,1,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,3,1,1,1,1,1,1,0,0],
				[0,0,0,0,0,0,0,0,0,0,1,3,3,3,1,1,1,1,1,1,1,1,1,0],
				[0,0,0,0,0,0,0,0,0,0,1,3,1,1,2,2,2,2,2,2,1,1,0,0],
				[0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,1,2,1,2,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,1,2,1,1,2,2,2,1,2,1,2,1,0,0,0],
				[0,0,0,0,0,0,0,0,1,2,2,1,1,1,2,2,2,2,2,2,2,1,0,0],
				[0,0,0,0,0,0,0,0,1,2,2,2,1,2,2,1,2,2,2,2,2,1,0,0],
				[0,0,0,0,0,0,0,0,0,1,2,2,2,2,1,1,1,1,2,2,1,1,1,0],
				[0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,1,1,1,1,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,2,2,2,1,0,0,0,0],
				[0,1,1,0,0,0,0,0,0,1,1,3,3,1,1,1,1,1,1,1,1,1,1,0],
				[1,3,3,1,1,0,1,1,1,1,3,3,3,3,1,1,3,3,1,1,2,2,2,1],
				[1,3,3,2,1,1,2,2,2,2,1,3,3,3,3,1,1,3,3,1,1,2,2,1],
				[1,3,2,2,2,1,2,2,2,2,2,1,3,3,3,1,1,3,3,3,1,1,1,0],
				[1,2,2,2,3,3,1,1,1,2,2,1,3,1,1,1,1,1,1,1,1,1,0,0],
				[0,1,2,3,3,3,2,2,1,1,1,1,1,1,1,1,2,2,1,1,2,1,0,0],
				[0,0,1,1,3,2,2,1,1,1,1,1,1,1,1,1,2,2,1,1,2,1,0,0],
				[0,0,0,0,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
				[0,0,0,0,0,0,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
				[0,0,0,0,0,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
				[0,0,0,0,0,1,3,3,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
				[0,0,0,0,0,1,3,3,1,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0]
			];
			break;
		case "ONEUP":
			bitmap = [
				[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[2,2,2,2,2,2,6,6,6,6,6,6,2,2,2,2,2,2],
				[2,2,2,2,6,6,1,1,5,5,5,5,6,6,2,2,2,2],
				[2,2,2,6,1,1,1,1,4,4,4,4,1,1,6,2,2,2],
				[2,2,6,1,1,1,1,3,3,3,3,3,4,1,1,6,2,2],
				[2,2,6,1,1,1,3,3,1,1,1,1,3,4,1,6,2,2],
				[2,6,5,4,3,3,3,1,1,1,1,1,1,3,4,5,6,2],
				[2,6,5,1,1,3,3,1,1,1,1,1,1,3,4,5,6,2],
				[2,6,1,1,1,1,3,1,1,1,1,1,1,3,4,1,6,2],
				[2,6,1,1,1,1,4,4,1,1,1,1,4,4,1,1,6,2],
				[2,6,5,1,1,5,5,5,5,5,5,5,5,5,1,1,6,2],
				[2,6,5,5,5,6,6,6,6,6,6,6,6,5,5,1,6,2],
				[2,2,6,6,6,1,1,6,1,1,6,1,1,6,6,6,2,2],
				[2,2,2,6,1,1,1,6,1,1,6,1,1,1,6,2,2,2],
				[2,2,2,6,1,1,1,1,1,1,1,1,1,1,6,2,2,2],
				[2,2,2,2,6,1,1,1,1,1,1,1,1,6,2,2,2,2],
				[2,2,2,2,2,6,6,6,6,6,6,6,6,2,2,2,2,2],
				[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
			];
			break;
		case "QUESTIONMARK":
			bitmap = [
				[2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2],
				[3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
				[3,1,3,1,1,1,1,1,1,1,1,1,1,3,1,2],
				[3,1,1,1,1,3,3,3,3,3,1,1,1,1,1,2],
				[3,1,1,1,3,3,1,1,1,3,3,1,1,1,1,2],
				[3,1,1,1,3,3,1,1,1,3,3,1,1,1,1,2],
				[3,1,1,1,3,3,1,1,1,3,3,1,1,1,1,2],
				[3,1,1,1,1,1,1,1,3,3,3,1,1,1,1,2],
				[3,1,1,1,1,1,1,3,3,1,1,1,1,1,1,2],
				[3,1,1,1,1,1,1,3,3,1,1,1,1,1,1,2],
				[3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
				[3,1,1,1,1,1,1,3,3,1,1,1,1,1,1,2],
				[3,1,1,1,1,1,1,3,3,1,1,1,1,1,1,2],
				[3,1,3,1,1,1,1,1,1,1,1,1,1,3,1,2],
				[3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
				[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
			];
			break;
		case "PIKA":
			bitmap = [
				[0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
				[0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
				[0,0,0,1,1,1,2,2,1,1,1,2,2,2,1],
				[0,0,1,2,2,2,2,2,2,1,2,2,2,1,0],
				[0,1,2,2,2,2,2,2,1,1,2,2,1,0,0],
				[0,1,2,2,2,2,2,2,1,2,2,1,0,0,0],
				[1,2,2,1,2,2,2,2,2,1,2,1,1,1,0],
				[1,2,2,2,2,3,2,2,2,1,1,2,2,1,0],
				[0,1,2,2,2,2,2,4,4,4,1,4,1,0,0],
				[0,1,2,1,2,2,2,2,2,2,1,4,4,1,0],
				[0,1,2,1,1,2,2,4,4,4,1,4,1,0,0],
				[0,1,1,2,2,2,2,2,2,1,1,1,0,0,0],
				[1,2,2,1,2,2,2,2,1,1,2,1,0,0,0],
				[0,1,1,0,1,1,1,1,2,2,1,0,0,0,0],
				[0,0,0,0,0,0,0,0,1,1,0,0,0,0,0]
			];
			break;
		default:
			bitmap = [
				[0,1,1,0],
				[1,1,1,1],
				[1,2,2,1],
				[1,2,2,1],
				[1,2,2,1],
				[1,2,2,1],
				[1,2,2,1],
				[1,2,2,1],
				[1,1,1,1],
				[0,1,1,0],
				[0,0,0,0],
				[0,0,0,0],
				[0,1,1,0],
				[1,2,2,1],
				[1,2,2,1],
				[0,1,1,0]
			];
	}

	if (params.bitmaparray !== '') {
		bitmap = JSON.parse(params.bitmaparray);
	}

	if (params.invert === 'YES') {
		bitmap = invertBitmap(bitmap);
	}

	if (params.multiplier !== 1 || params.ones !== 1 || params.twos !== 2 || params.threes !== 3 || params.fours !== 4 || params.fives !== 5 || params.sixes !== 6 || params.sevens !== 7 || params.eights !== 8 || params.nines !== 9 || params.tens !== 10) {
		bitmap = convertBitmap(bitmap, params.multiplier*params.ones, params.multiplier*params.twos, params.multiplier*params.threes, params.multiplier*params.fours, params.multiplier*params.fives, params.multiplier*params.sixes, params.multiplier*params.sevens, params.multiplier*params.eights, params.multiplier*params.nines, params.multiplier*params.tens);
	}

	if (params.thickness !== 0) {
		bitmap = thicken(bitmap, params.thickness);
	}

	// return scale([params.size_of_block, params.size_of_block, 1], eightBit(bitmap, 1)).setColor([.968627451, .28627451, .007843137]);
	return eightBit(bitmap, 1, params.color);
}