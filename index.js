var brandColor = process.argv[2];

import cp from 'child_process';
import pngquant from 'pngquant-bin';

var iconStyles = {
  white: { color: 'white', sampleBg: 'gray' },
  coloured: { },
  black: { color: 'black' },

  sqcolors: { transform: 'negativeSquares' },
  sqbw: { transform: 'negativeSquares', color: 'gray' },
  sqbwb: { transform: 'negativeSquares', color: 'black' },

  colors: { transform: 'negativeCircles' },
  bw: { transform: 'negativeCircles', color: 'gray' },
  bwb: { transform: 'negativeCircles', color: 'black' },

  rdcol: { transform: 'roundedColors' },
  rdbl: { transform: 'roundedColors', color: 'black' },
  rdw: { transform: 'roundedColors', color: 'white', sampleBg: 'gray' },

  sqrdcol: { transform: 'squaredColors' },
  sqrdbl: { transform: 'squaredColors', color: 'black' },
  sqrdw: { transform: 'squaredColors', color: 'white', sampleBg: 'gray' },

};

var iconsDef = {
  'fb':   '#3b5998',
  'tr':   '#4099FF',
  'tw':   '#000000',
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
  'tt':   '#000000',
  'tc':   '#9146ff',
};

var iconsSelection = ['fb', 'tw', 'in', 'inst', 'wa', 'tg'];

var iconsSourceOverride = {
  negativeCircles: {
    'wa': 'wa-nc',
  },
  roundedColors: {
    'wa': 'wa-rd',
  }
}

var finalSize = 96;
var squareSize = finalSize+'x'+finalSize;
var outputPath = './icons/';

var DEBUG = false;

if (typeof brandColor !== 'undefined') {
  iconStyles.colouredbrand = { color: brandColor };
  iconStyles.colorsBrand = { transform: 'negativeCircles', color: brandColor };
  iconStyles.sqcolorsBrand = { transform: 'negativeSquares', color: brandColor };
  iconStyles.rdbrandcol = { transform: 'roundedColors', color: brandColor };
  iconStyles.sqrdbrandcol = { transform: 'squaredColors', color: brandColor };
}

var color, inputPath;
for(var icon in iconsDef) if (iconsDef.hasOwnProperty(icon)) {
  color = iconsDef[icon];

  var iconDef, iconColor, transform, iconStyle, inputName, outputName;
  for (var is in iconStyles) if (iconStyles.hasOwnProperty(is)) {
    iconStyle = iconStyles[is];
    iconDef = icon;
    iconColor = iconStyle.hasOwnProperty('color') ? iconStyle.color : color;
    transform = iconStyle.hasOwnProperty('transform') ? iconStyle.transform : 'color';
    if (iconStyle.hasOwnProperty('transform') && iconsSourceOverride.hasOwnProperty(iconStyle.transform)
      && iconsSourceOverride[iconStyle.transform].hasOwnProperty(icon)) {
      iconDef = iconsSourceOverride[iconStyle.transform][icon];
      transform = 'color';
    }
    inputName = './icons-def/'+iconDef+'-black-512.png';
    outputName = outputPath+icon+'-'+is+'-'+finalSize+'.png';

    switch(transform) {
      case 'color':
        convert(
          inputName,
          '-fuzz 90%',
          '-fill "'+iconColor+'"',
          '-opaque black',
          '-resize '+squareSize,
          outputName
        );
        break;

      case 'negativeCircles':
        convert('-size 600x600',
          'xc:transparent',
          '-fill "'+iconColor+'"',
          '-draw "circle 300,300 0,300"',
          '"\(" '+inputName+' -fuzz 90% -fill white -opaque black -geometry +44+44 "\)" -composite',
          '-resize '+squareSize,
          outputName
        );
        break;

      case 'negativeSquares':
        convert('-size 600x600',
          'xc:transparent',
          '-fill "'+iconColor+'"',
          '-draw "roundRectangle 0,0,600,600 100,100"',
          '"\(" '+inputName+' -fuzz 90% -fill white -opaque black -geometry +44+44 "\)" -composite',
          '-resize '+squareSize,
          outputName
        );
        break;

      case 'roundedColors':
        convert('-size 680x680',
          'xc:transparent',
          '-fill none',
          '-stroke black',
          '-strokewidth 40',
          '-draw "circle 340,340 20,340"',
          '"\(" '+inputName+' -geometry +84+84 "\)" -composite',
          '-fuzz 90%',
          '-fill "'+iconColor+'"',
          '-opaque black',
          '-resize '+squareSize,
          outputName
        );
        break;

      case 'squaredColors':
        convert('-size 680x680',
          'xc:transparent',
          '-fill none',
          '-stroke black',
          '-strokewidth 40',
          '-draw "roundRectangle 20,20,660,660 100,100"',
          '"\(" '+inputName+' -geometry +84+84 "\)" -composite',
          '-fuzz 90%',
          '-fill "'+iconColor+'"',
          '-opaque black',
          '-resize '+squareSize,
          outputName
        );
        break;

      default: 
        console.log("ERROR: unknown style ", is);
    }
  }
}

var overviewColumns = Object.keys(iconStyles).length;
var overviewRows = Object.keys(iconsDef).length;

// Review available icons
montage(outputPath+'*.png -background transparent -tile '+overviewColumns+'x'+overviewRows,'./icons-overview/all.png');
montage(outputPath+'*.png -background transparent -geometry 48x48+6+6 -tile '+overviewColumns+'x'+overviewRows,'./icons-overview/all-48.png');
montage(outputPath+'*.png -background transparent -geometry 32x32+6+6 -tile '+overviewColumns+'x'+overviewRows,'./icons-overview/all-32.png');

// Create style overview icons
var opts;
for (var style in iconStyles) if (iconStyles.hasOwnProperty(style)) {
  opts = [];
  for (var i = 0; i < iconsSelection.length; i++) opts.push(outputPath+iconsSelection[i]+'-'+style+'-96.png');
  if (iconStyles[style].hasOwnProperty('sampleBg')) {
    opts.push('-background ' + iconStyles[style].sampleBg);
  } else {
    opts.push('-background transparent');
  }
  opts.push('-geometry +6+6');
  opts.push('-tile '+iconsSelection.length+'x1');
  opts.push('./edres/_social-select-'+style+'.png');
  montage.apply(null, opts);
}

console.log("DONE!");

// FUNCTIONS

function convert() {
  var args = [].slice.call(arguments);
  var outputname = args.pop();
  return run('convert'+' '+args.join(' ')+' '+outputname) && run(pngquant+' '+outputname+' --ext=.png --force');
}

function montage() {
  var args = [].slice.call(arguments);
  var outputname = args.pop();
  return run('montage'+' '+args.join(' ')+' '+outputname) && run(pngquant+' '+outputname+' --ext=.png --force');
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
