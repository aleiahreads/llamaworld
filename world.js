// Vertex shader program
// we added a uniform variable, u_Size to pass the desired size to
// webgl
var VSHADER_SOURCE = `
attribute vec4 a_Position;
// UV coordinate stuff
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

uniform float u_Size;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
attribute vec4 a_Color;   
varying vec4 v_Color;     
void main() {
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
  gl_PointSize = u_Size;
  v_Color = a_Color;  
  // so we can pass a_UV to fragment shader
  v_UV = a_UV;
}`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  varying vec4 v_Color; 
  varying vec2 v_UV;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  
  void main() {
    if(u_whichTexture == -2) {
      // Use plain color
      gl_FragColor = u_FragColor;
    } else if(u_whichTexture == -1) {
      // Debug color
      gl_FragColor = vec4(v_UV, 1.0,1.0);
    } else if(u_whichTexture == 0) {
      // Use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if(u_whichTexture == 1) {
      // Use texture1
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if(u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      // Error
      gl_FragColor = vec4(1,.2,.2,1);
    }
}`


// Global variables. They're already defined later but they're beneficial to have global because there is only one
// of each in our program
let canvas;
let gl;
let a_Position;
let g_globalAngle = 0;
let g_globalVerticalAngle = 0;
let g_magAngle = 0;
let g_yellowAngle = 0;
let g_yellowAnimation = false;

// UV coordinates
let a_UV;
let u_Sampler0;
let u_whichTexture;
let u_ProjectionMatrix;
let u_ViewMatrix;

// Camera
let g_Camera; 

// Animation angle variables
let g_frontLeftLegAngle = 0;
let g_frontRightLegAngle = 0;
let g_backLeftLegAngle = 0;
let g_backRightLegAngle = 0;
let g_neckAngle = 0;
let g_earAngle = 0;
let g_tailAngle = 0;
let g_headAngle = 0;

// Animation on/off variables
let g_frontLeftLegAnimate = false;
let g_frontRightLegAnimate = false;
let g_backLeftLegAnimate = false;
let g_backRightLegAnimate = false;
let g_neckAnimate = false;
let g_headAnimate = false;
let g_earAnimate = false;

// Mouse rotation control variables
let g_mouseXRotation = 0;  // For rotating the animal around X-axis
let g_mouseYRotation = 0;  // For rotating the animal around Y-axis

let u_FragColor;
let a_Color;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
// let u_Size;

function setUpWebGL() {
  // Retrieve <canvas> element
  // We got rid of the vars because it made a new local variable
  // instead of just using the global one
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // gl will keep track of whats in front of what
  gl.enable(gl.DEPTH_TEST);

  // Declare camera here AFTER canvas has been made
  g_Camera = new Camera(canvas);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  
  // Get the storage location of a_Color 
  a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return;
  }

  // storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
      console.log('Failed to get the storage location of a_UV');
      return;
  }

  // Get storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  // Get storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // Get storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }
  // Get storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return false;
  }
  // Get storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return false;
  }
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y])
}


function renderAllShapes() {
  // Pass projection matrix
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_Camera.projectionMatrix.elements);
  
  // Pass view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_Camera.viewMatrix.elements);

  // Pass the matrix to u_GlobalRotateMatrix attribute
  // var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  // globalRotMat.rotate(-g_globalVerticalAngle, 1, 0,0);
  var globalRotMat = new Matrix4().rotate(g_mouseYRotation, 0, 1, 0);
  globalRotMat.rotate(g_mouseXRotation, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  var identityMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);

  // Draw map
  drawMap(map, 1);

  // draw body cube
  var body1 = new Cube();
  body1.color = [1.0,0.0,0.0,1.0];
  // These operations happen in REVERSE order
  body1.matrix.translate(-.25, -.75, 0.0);
  body1.matrix.rotate(-5,1,0,0);
  body1.matrix.scale(.5, .3, .5);  
  body1.textureNum = -2;
  if (body1 && typeof body1.renderFast === "function") {
    body1.renderFast();
} else {
    console.log("renderFast() is not available on body1 yet");
}
  body1.renderFast();
/*
  // draw a left arm
  var leftArm = new Cube();
  leftArm.color = [1,1,0,1];
  // These operations happen in REVERSE order btw
  leftArm.matrix.setTranslate(0, -0.5, 0.0);
  leftArm.matrix.rotate(-5,1,0,0);
  leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  // We want to save the place where the left arm starts before it gets moved around
  var yellowCoordinatesMat= new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, .7, .5);
  leftArm.matrix.translate(-.5,0,0);
  leftArm.textureNum = -1;
  leftArm.renderFast();

  // Test box
  var box = new Cube();
  box.color = [1,0,1,1];
  // Makes it so that box starts where leftarm is, so that way we can start box in the same position and then
  // simply move it to where we want it to be, proportionally to where the left arm is
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0, .65, 0);
  box.matrix.rotate(g_magAngle,0,0,1);
  box.matrix.scale(.3,.3,.3);
  // Moves the box slightly forward so that the boxes don't overlap
  box.matrix.translate(-.5, 0, -0.001);
  box.textureNum = 0;
  box.renderFast();
*/

  let floor = new Cube();
  floor.color = [1,0,0,1];
  floor.textureNum = 1;
  floor.matrix.translate(0,-.75, 0);
  floor.matrix.scale(32, 0, 32);
  floor.matrix.translate(-.5,0,-.5);
  floor.renderFast();

  let sky = new Cube();
  sky.color = [0,0,1,1];
  sky.textureNum = 0;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5,-.5,-.5);
  sky.renderFast();
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variable which is the color chosen by the user
let g_selectedColor = [1.0,1.0,1.0,1.0];
// Global variable which is the user selected point size
let g_selectedSize=5;
// global variable that's the selected shape type
let g_selectedType=POINT;

function addActionsForHtmlUI() {
  // angle slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function () {g_globalAngle = this.value; renderAllShapes(); })
  document.getElementById('verticalAngleSlide').addEventListener('mousemove', function () {g_globalVerticalAngle = this.value; renderAllShapes(); })
  document.getElementById('frontLLSlide').addEventListener('mousemove', function () {g_frontLeftLegAngle = this.value; renderAllShapes(); })
  document.getElementById('frontRLSlide').addEventListener('mousemove', function () {g_frontRightLegAngle = this.value; renderAllShapes(); })
  document.getElementById('backLLSlide').addEventListener('mousemove', function () {g_backLeftLegAngle = this.value; renderAllShapes(); })
  document.getElementById('backRLSlide').addEventListener('mousemove', function () {g_backRightLegAngle = this.value; renderAllShapes(); })
  document.getElementById('neckSlide').addEventListener('mousemove', function () {g_neckAngle = this.value; renderAllShapes(); })
  document.getElementById('headSlide').addEventListener('mousemove', function () {g_headAngle = this.value; renderAllShapes(); })
  document.getElementById('earSlide').addEventListener('mousemove', function () {g_earAngle = this.value; renderAllShapes(); })

  // animation button events
  document.getElementById('frontLLAnimateOn').onclick = function () {g_frontLeftLegAnimate = true;}
  document.getElementById('frontLLAnimateOff').onclick = function () {g_frontLeftLegAnimate = false;}
  document.getElementById('frontRLAnimateOn').onclick = function () {g_frontRightLegAnimate = true;}
  document.getElementById('frontRLAnimateOff').onclick = function () {g_frontRightLegAnimate = false;}
  document.getElementById('backLLAnimateOn').onclick = function () {g_backLeftLegAnimate = true;}
  document.getElementById('backLLAnimateOff').onclick = function () {g_backLeftLegAnimate = false;}
  document.getElementById('backRLAnimateOn').onclick = function () {g_backRightLegAnimate = true;}
  document.getElementById('backRLAnimateOff').onclick = function () {g_backRightLegAnimate = false;}
  document.getElementById('neckAnimateOn').onclick = function () {g_neckAnimate = true;}
  document.getElementById('neckAnimateOff').onclick = function () {g_neckAnimate = false;}
  document.getElementById('headAnimateOn').onclick = function () {g_headAnimate = true;}
  document.getElementById('headAnimateOff').onclick = function () {g_headAnimate = false;}
  document.getElementById('earAnimateOn').onclick = function () {g_earAnimate = true;}
  document.getElementById('earAnimateOff').onclick = function () {g_earAnimate = false;}
}

function initTextures() {
  // Sky image ------------------------------------------------------------------------------------------------------------------------ 
  var sky = new Image();
  if(!sky) {
    console.log('Failed to create the sky image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  sky.onload = function() { sendImageToTEXTURE(sky, 0); }
  // Tell the browswer to load an image
  sky.src = 'puffy_sky-blue_04-512x512.png';

  // ground image -----------------------------------------------------------------------------------------------------------------------
  var ground = new Image();
  if(!ground) {
    console.log('Failed to create the ground image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  ground.onload = function() { sendImageToTEXTURE(ground, 1); }
  // Tell the browswer to load an image
  ground.src = 'Grass_Ground_Texture.png';

  // block image ------------------------------------------------------------------------------------------------------------------------
  var block = new Image();
  if(!block) {
    console.log('Failed to create the block image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  block.onload = function() { sendImageToTEXTURE(block, 2); }
  // Tell the browswer to load an image
  block.src = 'Ground_01.png';

   
  return true;
}

function sendImageToTEXTURE(image, textureUnit) {
  /*
  // Create a texture on GPU
  var texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create texture object');
    return false;
  }

  // Flip the image's y-axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set parameters about how we will use the texture
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Send the texture image to GPU
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  console.log('finished loadTexture');
*/

  // Create a texture on GPU
  var texture = gl.createTexture();
  if (!texture) {
    console.log(`Failed to create texture object for texture ${textureUnit}`);
    return false;
  }

  // Flip the image's y-axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
  // Activate the correct texture unit
  gl.activeTexture(gl[`TEXTURE${textureUnit}`]);
  
  // Bind the texture object
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
  // Send the texture image to GPU
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Bind the texture sampler uniform
  if (textureUnit === 0) gl.uniform1i(u_Sampler0, 0);
  if (textureUnit === 1) gl.uniform1i(u_Sampler1, 1);
  if (textureUnit === 2) gl.uniform1i(u_Sampler2, 2);

  console.log(`Loaded texture ${textureUnit} from ${image.src}`);
}

function main() {

  // Set up canvas and gl variables
  setUpWebGL();

  // Set up GLSL shader program and connect GLSL variables
  connectVariablesToGLSL();
  
  // Set up actions for the html UI elements
  addActionsForHtmlUI();

  // When a key is pressed call keydown function
  document.onkeydown = keydown;

  // Mouse rotation event listener
  canvas.addEventListener('mousemove', mouseMove);

  initTextures();

  // Specify the color for clearing <canvas>
  //gl.clearColor(0.678, 0.847, 0.9019, 1.0);
  gl.clearColor(0,0,0, 1.0);

  //drawMap();

  requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

// Variables to keep track of fps and ms
var lastFrameTime = performance.now();
var fps = 0;

function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0-g_startTime; 

  // Debugging purposes
  //console.log(g_seconds);

  let now = performance.now();
  let deltaTime = now - lastFrameTime;
  lastFrameTime = now;

  fps = 1000/deltaTime;

  // Update FPS display
  document.getElementById("fpsCounter").innerText = `FPS: ${fps.toFixed(1)} | Frame Time: ${deltaTime.toFixed(2)} ms`;

  // Update all angles
  // updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell browser to update again
  requestAnimationFrame(tick);
}

function keydown(ev) {
  let speed = 2;
  let angle = 36;
  // W
  if(ev.keyCode == 87) {
    g_Camera.moveForward(speed);
    updateViewMatrix();
    // S
  } else if(ev.keyCode == 83) {
    g_Camera.moveBackwards(speed);
    updateViewMatrix();
    // A
  } else if(ev.keyCode == 65) {
    g_Camera.moveLeft(speed);
    updateViewMatrix();
    // D
  } else if(ev.keyCode == 68) {
    g_Camera.moveRight(speed);
    updateViewMatrix();
    // Q
  }  else if(ev.keyCode == 81) {
    g_Camera.panLeft(angle);
    updateViewMatrix();
    // E
  } else if(ev.keyCode == 69) {
    g_Camera.panRight(angle);
    updateViewMatrix();
  } else if(ev.keyCode == 90) {
    addBlock();
    renderAllShapes();
  } else if(ev.keyCode == 88) {
    deleteBlock();
    renderAllShapes();
  }
}

function updateViewMatrix() {
  g_Camera.viewMatrix.setLookAt(
    g_Camera.eye.elements[0], g_Camera.eye.elements[1], g_Camera.eye.elements[2], 
    g_Camera.at.elements[0], g_Camera.at.elements[1], g_Camera.at.elements[2], 
    g_Camera.up.elements[0], g_Camera.up.elements[1], g_Camera.up.elements[2]
  );

  console.log("matrix after being updated: " + g_Camera.viewMatrix.elements);
}

  let map = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,4,4,4,4,4,0,0,0,0],
  [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,4,4,4,4,0,0,0],
  [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,3,0,0,0,0,0,0],
  [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,4,3,2,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,5,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,3,3,3,5,4,3,2,1,0,0,0,0,0],
  [0,0,5,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,4,2,8,7,6,0,0,0,0,0,0],
  [0,0,5,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,3,2,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,0,0,0,0,0,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

function drawMap(map_array, scale) {
  let rowSize = map_array.length;
  let colSize = map_array[0].length;
  let walls = [];

  
  for(let row = 0; row < rowSize; row++) {
    for(let col = 0; col < colSize; col++) {
      let height = map_array[row][col]; // The value determines how many cubes to stack
      for (let y = 0; y < height; y++) {
        let block = new Cube();
        block.color = [0, 1, 1, 1];
        block.textureNum = 2;
        block.matrix.translate(row-16, y-.75, col-16);
        block.matrix.scale(scale,scale,scale);
        walls.push(block);
      }
    }
  }
  //console.log("number of blcoks to be drawn: " + walls.length);

  for(let i =0; i < walls.length; i++) {
    walls[i].renderFast();
  }
}

// Mouse rotation stuff: 
let lastMouseX = 0;
let lastMouseY = 0;

function mouseMove(ev) {
  const [x, y] = convertCoordinatesEventToGL(ev);

  if (lastMouseX === 0 && lastMouseY === 0) {
    lastMouseX = x;
    lastMouseY = y;
    return;
  }

  // Calculate the difference in mouse position
  const deltaX = x - lastMouseX;
  const deltaY = y - lastMouseY;

  // Update rotation angles based on the mouse movement
  g_mouseXRotation += deltaY * 180;  // Adjust sensitivity
  g_mouseYRotation += deltaX * 180;  // Adjust sensitivity

  // Prevent the X-axis rotation from going too far (gimbal lock prevention)
  if (g_mouseXRotation > 90) g_mouseXRotation = 90;
  if (g_mouseXRotation < -90) g_mouseXRotation = -90;

  // Update last mouse position for next movement
  lastMouseX = x;
  lastMouseY = y;

  // Redraw scene after mouse movement
  renderAllShapes();
}



// Minecraft add/remove blocks functions

// Method to calculate the front vector (direction the camera is facing)
function getCameraFront() {
  let f = new Vector3();
  f.set(g_Camera.at);  
  f.sub(g_Camera.eye); 
  f.normalize();     
  return f;
}

// Get the position in front of the camera
function getFrontOfCamera() {
  const cameraPos = g_Camera.eye.elements;  // [x, y, z]
  const cameraDirection = getCameraFront();  // Direction the camera is facing

  // Assuming the front vector is normalized
  const frontPos = [
      cameraPos[0] + cameraDirection.elements[0], 
      cameraPos[1] + cameraDirection.elements[1], 
      cameraPos[2] + cameraDirection.elements[2]
  ];

  return frontPos;  // Return position in front of the camera
}

// Convert world position to map coordinates
function worldToMapCoordinates(worldPosition) {
  const mapSize = 32;  // Assuming the map size is 32x32

  // Convert world coordinates (-16 to 16) to map coordinates (0 to 31)
  const mapX = Math.floor((worldPosition[0] + 16) % mapSize);
  const mapZ = Math.floor((worldPosition[2] + 16) % mapSize);

  return [mapX, mapZ];
}

function addBlock() {
  let frontPos = getFrontOfCamera();
  let mapCoords = worldToMapCoordinates(frontPos);

  // Update the map at the front position
  let x = mapCoords[0];
  let z = mapCoords[1];

  // Increment the stack of blocks
  map[x][z] += 1;
}

// Remove a block at the position in front of the camera
function deleteBlock() {
  let frontPos = getFrontOfCamera();
  let mapCoords = worldToMapCoordinates(frontPos);

  // Update the map at the front position
  let x = mapCoords[0];
  let z = mapCoords[1];
  // Decrement the stack if there is at least one block
  if (map[x][z] > 0) {
      map[x][z] -= 1;
  }
}