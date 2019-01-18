var brandColor = process.argv[2];

var cp = require('child_process');
var pngquant = require('pngquant-bin');

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
};
var colorGray  = '#828282';
var colorBlack = '#000000';

var finalSize = 96;

var squareSize = finalSize+'x'+finalSize;
var outputPath = './icons/';

var DEBUG = false;

var color, inputIcon;
for(var icon in iconsDef) if (iconsDef.hasOwnProperty(icon)) {
  color = iconsDef[icon];
  inputIcon = './icons-def/'+icon+'-black-512.png';

  // white
  convert(inputIcon,'-fuzz 90%','-fill white', '-opaque black','-resize '+squareSize,outputPath+icon+'-white-'+finalSize+'.png');
  // color
  convert(inputIcon,'-fuzz 90%','-fill "'+color+'"','-opaque black','-resize '+squareSize,outputPath+icon+'-coloured-'+finalSize+'.png');
  // black
  convert(inputIcon,'-fuzz 90%','-fill black', '-opaque black','-resize '+squareSize,outputPath+icon+'-black-'+finalSize+'.png');
  // color circle white icon
  convert('-size 600x600','xc:transparent','-fill "'+color+'"','-draw "circle 300,300 0,300"','"\(" '+inputIcon+' -fuzz 90% -fill white -opaque black -geometry +44+44 "\)" -composite','-resize '+squareSize,outputPath+icon+'-colors-'+finalSize+'.png');
  // grey circle black icon
  convert('-size 600x600','xc:transparent','-fill gray',  '-draw "circle 300,300 0,300"','"\(" '+inputIcon+' -fuzz 90% -fill white -opaque black -geometry +44+44 "\)" -composite','-resize '+squareSize,outputPath+icon+'-bw-'+finalSize+'.png');
  // color outline color icon
  convert('-size 680x680','xc:transparent','-fill none', '-stroke black', '-strokewidth 40', '-draw "circle 340,340 20,340"','"\(" '+inputIcon+' -geometry +84+84 "\)" -composite','-fuzz 90%','-fill "'+color+'"','-opaque black','-resize '+squareSize,outputPath+icon+'-rdcol-'+finalSize+'.png');
  // black outline black icon
  convert('-size 680x680','xc:transparent','-fill none', '-stroke black', '-strokewidth 40', '-draw "circle 340,340 20,340"','"\(" '+inputIcon+' -geometry +84+84 "\)" -composite','-resize '+squareSize,outputPath+icon+'-rdbl-'+finalSize+'.png');
  // white outline white icon
  convert('-size 680x680','xc:transparent','-fill none', '-stroke white', '-strokewidth 40', '-draw "circle 340,340 20,340"','"\(" '+inputIcon+' -geometry +84+84 "\)" -composite','-fuzz 90%','-fill white','-opaque black','-resize '+squareSize,outputPath+icon+'-rdw-'+finalSize+'.png');

  if (brandColor) {
    // brand color
    convert(inputIcon,'-fuzz 90%','-fill "'+brandColor+'"','-opaque black','-resize '+squareSize,outputPath+icon+'-colouredbrand-'+finalSize+'.png');
    // brand color circle white icon
    convert('-size 600x600','xc:transparent','-fill "'+brandColor+'"','-draw "circle 300,300 0,300"','"\(" '+inputIcon+' -fuzz 90% -fill white -opaque black -geometry +44+44 "\)" -composite','-resize '+squareSize,outputPath+icon+'-colorsbrand-'+finalSize+'.png');
    // brand color outline brand color icon
    convert('-size 680x680','xc:transparent','-fill none', '-stroke black', '-strokewidth 40', '-draw "circle 340,340 20,340"','"\(" '+inputIcon+' -geometry +84+84 "\)" -composite','-fuzz 90%','-fill "'+brandColor+'"','-opaque black','-resize '+squareSize,outputPath+icon+'-rdbrandcol-'+finalSize+'.png');
  }
}

var overviewColumns = 8;
if (brandColor) {
  overviewColumns = 11;
}

// Review available icons
montage(outputPath+'* -background transparent -tile '+overviewColumns+'x10','./icons-overview/all.png');
montage(outputPath+'* -background transparent -geometry 48x48+6+6 -tile '+overviewColumns+'x10','./icons-overview/all-48.png');
montage(outputPath+'* -background transparent -geometry 32x32+6+6 -tile '+overviewColumns+'x10','./icons-overview/all-32.png');

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
