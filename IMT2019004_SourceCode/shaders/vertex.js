export const vertexShaderSrc = `      
	attribute vec3 aPosition;
	uniform mat4 uModelTransformMatrix;  
	uniform mat4 viewMatrix;  
	uniform mat4 projMatrix;  
	void main () {             
		gl_Position = projMatrix * viewMatrix * uModelTransformMatrix * vec4(aPosition, 1.0); 
	}                          
`;

// gl_Position = projMatrix * viewMatrix * uModelTransformMatrix * vec4(aPosition, 1.0);