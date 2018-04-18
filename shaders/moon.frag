varying vec2 vTextureCoord;
uniform vec2 resxy;
uniform float time;

#define circle( c, p, s ) length(p - c) * s
#define sun(c, p) smoothstep(1., 0.2, circle(c, p, 8.)) * vec4( 4., 2., 1., 1.)
#define moon(c, p) smoothstep(1., 0.1, circle(c, p, 8.8)) * vec4( 100., 100., 200., 0) + vec4(0,0,0,1)

void main()
{
    vec2 uv = vTextureCoord;

    uv = uv - vec2(0.5, 0.2);
    gl_FragColor = sun(vec2(0, 0), uv) - moon(vec2(0, 0), uv + vec2(-0.1 + 0.7 * sin(.25 * time), 0)) + vec4( 0., 0., 0., 0.);
}


