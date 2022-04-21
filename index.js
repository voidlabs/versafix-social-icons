var brandColor = process.argv[2];

import cp from 'child_process';
import pngquant from 'pngquant-bin';

var iconsDef = {
  'fb':   '#3b5998',
  'tw':   '#4099FF',
  'gg':   '#d34836',
  'web':  '#606060',
  'in':   '#007bb6',
  'pi':   '#C92228',
  'fl':   '#ff0084',
  'vi':   '#45bbff',
  'inst': '#bc2a8d',
  'you':  '#cd201f',
  'wa':   '#25d366',
  'tg':   '#2da5e1',
};
var coloursIconsSourceOverride = {
};
var negativeCirclesIconsSourceOverride = {
  'wa': 'wa-nc',
};
var roundedColorsIconsSourceOverride = {
  'wa': 'wa-rd',
};

var colorGray  = '#828282';
var colorBlack = '#000000';

var finalSize = 96;

var squareSize = finalSize+'x'+finalSize;
var outputPath = './icons/';

var DEBUG = false;

function getinputPathOverride(icon, override) {
  if (typeof override === 'object' && typeof override[icon] === 'string')
    return override[icon];
  return false;
}

function inputName(icon) {
  return './icons-def/'+icon+'-black-512.png';
}

function outputName(icon, type) {
  return outputPath+icon+'-'+type+'-'+finalSize+'.png';
}

function defaultConvert(iconPath, color, squareSize, outputPath) {
  return convert(
    iconPath,
    '-fuzz 90%',
    '-fill "'+color+'"',
    '-opaque black',
    '-resize '+squareSize,
    outputPath
  );
}

var color, inputPath;
for(var icon in iconsDef) if (iconsDef.hasOwnProperty(icon)) {
  color = iconsDef[icon];

  var colours = {
    // white
    white: 'white',
    // color
    coloured: color,
    // black
    black: 'black',
    // brand color
    colouredbrand: brandColor,
  };

  for (var p in colours) if (colours.hasOwnProperty(p)) if (typeof colours[p] !== 'undefined') {
    defaultConvert(inputName(icon), colours[p], squareSize, outputName(icon, p));
  }


  var negativeCircles = {
    // color circle white icon
    colors: color,
    // grey circle black icon
    bw: 'gray',
    // brand color circle white icon
    colorsbrand: brandColor,
  };

  for (var p in negativeCircles) if (negativeCircles.hasOwnProperty(p)) if (typeof negativeCircles[p] !== 'undefined') {
    var iconOverride = getinputPathOverride(icon, negativeCirclesIconsSourceOverride);
    if (iconOverride) {
      defaultConvert(inputName(iconOverride), negativeCircles[p], squareSize, outputName(icon, p));
    } else {
      convert('-size 600x600',
        'xc:transparent',
        '-fill "'+negativeCircles[p]+'"',
        '-draw "circle 300,300 0,300"',
        '"\(" '+inputName(icon)+' -fuzz 90% -fill white -opaque black -geometry +44+44 "\)" -composite',
        '-resize '+squareSize,
        outputName(icon, p)
      );
    }
  }

  var roundedColors = {
    // color outline color icon
    rdcol: color,
    // black outline black icon
    rdbl: 'black',
    // white outline white icon
    rdw: 'white',
    // brand color outline brand color icon
    rdbrandcol: brandColor,

  };

  for (var p in roundedColors) if (roundedColors.hasOwnProperty(p)) if (typeof roundedColors[p] !== 'undefined') {
    var iconOverride = getinputPathOverride(icon, roundedColorsIconsSourceOverride);
    if (iconOverride) {
      defaultConvert(inputName(iconOverride), roundedColors[p], squareSize, outputName(icon, p));
    } else {
      convert('-size 680x680',
        'xc:transparent',
        '-fill none',
        '-stroke black',
        '-strokewidth 40',
        '-draw "circle 340,340 20,340"',
        '"\(" '+inputName(icon)+' -geometry +84+84 "\)" -composite',
        '-fuzz 90%',
        '-fill "'+roundedColors[p]+'"',
        '-opaque black',
        '-resize '+squareSize,
        outputName(icon, p)
      );
      // convert('-size 680x680','xc:transparent','-fill none', '-stroke black', '-strokewidth 40', '-draw "circle 340,340 20,340"','"\(" '+inputPath+' -geometry +84+84 "\)" -composite','-resize '+squareSize,outputPath+icon+'-rdbl-'+finalSize+'.png');
    }
  }

}

var overviewColumns = 8;
if (brandColor) {
  overviewColumns = 11;
}
var overviewRows = 12;

// Review available icons
montage(outputPath+'*.png -background transparent -tile '+overviewColumns+'x'+overviewRows,'./icons-overview/all.png');
montage(outputPath+'*.png -background transparent -geometry 48x48+6+6 -tile '+overviewColumns+'x'+overviewRows,'./icons-overview/all-48.png');
montage(outputPath+'*.png -background transparent -geometry 32x32+6+6 -tile '+overviewColumns+'x'+overviewRows,'./icons-overview/all-32.png');

console.log("DONE!");

// FUNCTIONS

function convert() {
  var args = [].slice.call(arguments);
  var outputname = args.pop();
  return run('convert'+' '+args.join(' ')+' '+outputname) && run(pngquant+' '+outputname+' --ext=.png --force');
}

function montage() {
  var args = [].slice.call(arguments);
  return run('montage'+' '+args.join(' '));
}

function run(cmd) {
  if (DEBUG) console.log(cmd);
  else console.log(".");
  try {
    cp.execSync(cmd, {stdio:[0,1,2]});
    return true;
  } catch (e) {
    console.log("FAILED to run command: "+e, "Command line: ", cmd);
    return false;
  }
}
