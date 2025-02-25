class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.textureNum=0;
        //this.cubeVerts32 = new Float32Array([
        this.cubeVerts = [
        0,0,0,  1,1,0,  1,0,0,
        0,0,0,  0,1,0,  1,1,0,
        0,1,0,  0,1,1,  1,1,1,
        0,1,0,  1,1,1,  1,1,0,
        1,0,0,  1,1,1,  1,1,0,
        1,0,0,  1,1,1,  1,0,1,
        0,1,0,  0,0,0,  0,0,1,
        0,1,0,  0,0,1,  0,1,1,
        0,0,0,  1,0,1,  1,0,0,
        0,0,0,  1,0,1,  0,0,1,
        0,1,1,  1,0,1,  0,0,1,
        0,1,1,  1,0,1,  1,1,1
        ];
        this.cubeUVs = [
            0,0,  1,1,  1,0, 
            0,0,  0,1,  1,1,
            0,0,  0,1,  1,1,
            0,0, 1,1, 1,0,  
            0,0, 1,1, 1,0,
            0,0, 1,1, 0,1,    
            1,0, 0,0, 0,1,
            1,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 1,1, 0,1,

            0,1, 1,0, 0,0,

            0,1, 1,0, 1,1
        ];
        
        this.cubeUVsVerts32 = [
            0,0,0, 0,0,
            1,1,0, 1,1,
            1,0,0, 1,0,
           
            0,0,0, 0,0,
            0,1,0, 0,1,
            1,1,0, 1,1,

            0,1,0, 0,0,
            0,1,1, 0,1, 
            1,1,1, 1,1,
            
            0,1,0, 0,0,
            1,1,1, 1,1,
            1,1,0, 1,0,

            1,0,0, 0,0, 
            1,1,1, 1,1,
            1,1,0, 1,0,
           
            1,0,0, 0,0,
            1,1,1, 1,1,
            1,0,1, 0,1,

            0,1,0, 1,0,
            0,0,0, 0,0,
            0,0,1, 0,1,

            0,1,0, 1,0,
            0,0,1, 0,1,
            0,1,1, 1,1,

            0,0,0, 0,0,
            1,0,1, 1,1,
            1,0,0, 1,0,

            0,0,0, 0,0,
            1,0,1, 1,1,
            0,0,1, 0,1,

            0,1,1, 0,1,
            1,0,1, 1,0,
            0,0,1, 0,0,

            0,1,1, 0,1,  
            1,0,1, 1,0,
            1,1,1, 1,1
        ]

    }

    render() {
        var rgba = this.color;

        // Pass texture number in this.textureNum to u_whichTexture which is in the GPU
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // Pass matrix.elements 
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of Cube
        //drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0,0] );
        //drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0] );
        drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0,  1,1,  1,0])
        drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0,  0,1,  1,1] );

        // Pass the color of a ppoint to u_FragColor uniform variable
        // This makes it so the color is slightly darker and so we can fake lighting
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top of cube
        drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);
        drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // Right side of cube
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        drawTriangle3DUV([1,0,0,  1,1,1, 1,1,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([1,0,0,  1,1,1, 1,0,1], [0,0, 1,1, 0,1]);

        // Left side of cube
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3DUV([0,1,0,  0,0,0, 0,0,1], [1,0, 0,0, 0,1]);
        drawTriangle3DUV([0,1,0,  0,0,1, 0,1,1], [1,0, 0,1, 1,1]);

        // Bottom of cube
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3DUV( [0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV( [0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 0,1]);

        //Back of cube
        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        drawTriangle3DUV([0,1,1,  1,0,1,  0,0,1], [0,1, 1,0, 0,0]);
        drawTriangle3DUV([0,1,1,  1,0,1,  1,1,1], [0,1, 1,0, 1,1]);
    }

    renderFast() {
        var rgba = this.color;

        // Pass texture number in this.textureNum to u_whichTexture which is in the GPU
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // Pass matrix.elements 
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //drawTriangle3DUVFast(this.cubeUVsVerts32);
        drawTriangle3DUV(this.cubeVerts, this.cubeUVs);
    }

    renderCubes(cubes) {
        for(let i =0; i < cubes.length; i++) {
            cubes[i].renderFast();
        }
    }
}



/*

class Cube {
    constructor() {
        this.type = 'cube';
        this.matrix = new Matrix4();
        this._color = [1.0, 1.0, 1.0, 1.0]; // Default: White

        if (!Cube.vertexBuffer) {
            Cube.initBuffers();
        }

        this.updateFaceColors(); // Generate default shaded colors
    }

    // Getter for color (returns base color)
    get color() {
        return this._color;
    }

    // Setter for color (updates shaded colors)
    set color(newColor) {
        this._color = newColor;
        this.updateFaceColors();
    }

    updateFaceColors() {
        let shades = [1.0, 0.85, 0.75, 0.6, 0.85, 0.55]; // Darker shades
        this.faceColors = shades.map(s => this._color.map((c, i) => (i < 3 ? c * s : c))); // Scale RGB, keep Alpha
        this.updateColorBuffer();
    }

    updateColorBuffer() {
        let colorArray = [];
        for (let i = 0; i < this.faceColors.length; i++) {
            for (let j = 0; j < 6; j++) { // 6 vertices per face
                colorArray.push(...this.faceColors[i]);
            }
        }

        // Update the color buffer in OpenGL
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
    }

    static initBuffers() {
        Cube.vertices = new Float32Array([
            // Front face
            0,0,0,  1,1,0,  1,0,0,  
            0,0,0,  0,1,0,  1,1,0,
    
            // Top face
            0,1,0,  0,1,1,  1,1,1,  
            0,1,0,  1,1,1,  1,1,0,
    
            // Right face
            1,1,0,  1,1,1,  1,0,0,  
            1,0,0,  1,1,1,  1,0,1,
    
            // Left face
            0,1,0,  0,0,0,  0,0,1,  
            0,1,0,  0,0,1,  0,1,1,
    
            // Bottom face
            0,0,0,  1,0,1,  1,0,0,  
            0,0,0,  1,0,1,  0,0,1,
    
            // Back face
            0,1,1,  1,0,1,  0,0,1,  
            0,1,1,  1,0,1,  1,1,1
        ]);
    
        Cube.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Cube.vertices, gl.STATIC_DRAW);
    
        Cube.colorBuffer = gl.createBuffer();
    }

    render() {
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
        // Use per-vertex colors
        gl.uniform1i(u_UseVertexColor, 1); // Enable vertex colors
    
        // Bind position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
    
        // Bind color buffer (updated with new colors)
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.colorBuffer);
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.drawArrays(gl.TRIANGLES, 0, Cube.vertices.length / 3);
    
        // Reset color mode so other objects use u_FragColor
        gl.uniform1i(u_UseVertexColor, 0);
    }
}

*/