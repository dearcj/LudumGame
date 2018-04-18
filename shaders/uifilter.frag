varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 center;
uniform vec3 params; // 10.0, 0.8, 0.1
uniform float time;

void main()
{
    vec2 uv = vTextureCoord;
    vec2 texCoord = uv;

    float dist = distance(uv, center);

    if ((dist <= (time + params.z)) && (dist >= (time - params.z)) )
    {
        float diff = (dist - time);
        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);

        float diffTime = diff  * powDiff;
        vec2 diffUV = normalize(uv - center);
        texCoord = uv + (diffUV * diffTime);
    }

    vec4 orig =  texture2D(uSampler, uv);
    vec4 new2  =  texture2D(uSampler, texCoord);
    vec4 color = orig;
    color.x = (orig.x + 1.8*max(new2.x, max(new2.z, new2.y))*orig.w) *0.6;
    gl_FragColor = color;
}
