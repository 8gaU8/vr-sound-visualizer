uniform sampler2D tAudioData;
uniform float colorR;
uniform float colorG;
uniform float colorB;
varying vec2 vUv;

void main() {

    vec3 backgroundColor = vec3( 40. / 255. , 75./255., 99./255. ); //
    vec3 color = vec3( colorR, colorG, colorB );

    float f = texture2D( tAudioData, vec2( vUv.x, 0.0 ) ).r;

    float i = step( vUv.y, f ) * step( f - 0.05, vUv.y );

    gl_FragColor = vec4( mix( backgroundColor, color, i ), 0.8 );

}
