class Triangle{
    constructor(){
      this.type= 'triangle';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 5.0
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color; 
      var size = this.size;
      /*
      var xy = g_points[i];
      var rgba = g_colors[i];
      var size = g_sizes[i];
      */
  
      // Pass the position of a point to a_Position variable
      // dont need this anymore, we use attribpointer instead in drawTriangle()
      //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

      gl.uniform1i(u_UseVertexColor, 0); // Disable vertex colors

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      // Pass the size of a point to u_Size variable
      gl.uniform1f(u_Size, size);


        
      // Draw
      var d = this.size/200.0;   // delta
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d])
    }
}


function drawTriangle(vertices) {
    var n = 3; // The number of vertices
  
    // Create a buffer object on the gpu so we can pass vertices into it
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    // instead of a call to vertexAtribLocation, we call vertextAttribPointer
    // now a_Position will be a pointer to the buffer we made
    // The 2 means there is elements per vertex, an x and a y and gl.FLOAT means they're all floats
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
}

// Same function as a above but vertexArrribPointer has 3 not 2 points
function drawTriangle3D(vertices) {
    var n = vertices.length/3; // The number of vertices
  
    // Create a buffer object on the gpu so we can pass vertices into it
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    // instead of a call to vertexAtribLocation, we call vertextAttribPointer
    // now a_Position will be a pointer to the buffer we made
    // The 2 means there is elements per vertex, an x and a y and gl.FLOAT means they're all floats
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
}


// Stuff so we only need to initialize the buffer once
let g_vertexUVBuffer = null;

function initdrawTriangle3DUV() {
  if (g_vertexUVBuffer) return; // Already initialized, no need to run again

  g_vertexUVBuffer = gl.createBuffer();
  if (!g_vertexUVBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexUVBuffer);

  // Assign buffer to attributes
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0); // Position
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT); // UV
  gl.enableVertexAttribArray(a_UV);
}


//function drawTriangle3DUV(vertices, uv) {
function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length/3; // The number of vertices
  
  if(g_vertexUVBuffer == null) {
    initdrawTriangle3DUV();
  }
  /*
  // Create a buffer object on the gpu so we can pass vertices into it
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the position buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position); 


  // Create buffer for UV 
  var n = 3; // The number of vertices
  
    // Create a buffer object on the gpu so we can pass vertices into it
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
      console.log('Failed to create the uv buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write date into the buffer object
    //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_UV variable
    // instead of a call to vertexAtribLocation, we call vertextAttribPointer
    // now a_Position will be a pointer to the buffer we made
    // The 2 means there is elements per vertex, an x and a y and gl.FLOAT means they're all floats
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);


    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);
    */

    // Interleave data: [posX, posY, posZ, u, v, posX, posY, posZ, u, v, ...]
    let interleavedData = [];
    for (let i = 0; i < n; i++) {
      interleavedData.push(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]); // Position
      interleavedData.push(uv[i * 2], uv[i * 2 + 1]); // UV
    }

    // Update the buffer with new data
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexUVBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(interleavedData), gl.DYNAMIC_DRAW);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function drawTriangle3DUVFast(vertices_uvs32) {
    var n = vertices_uvs32.length/5; // The number of vertices
  
    if(g_vertexUVBuffer == null) {
      initdrawTriangle3DUV();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexUVBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_uvs32, gl.DYNAMIC_DRAW);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);

  }