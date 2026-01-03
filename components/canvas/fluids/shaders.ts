export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const baseFs = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 texelSize;
`;

// 0. Clear
export const clearShader = `
  ${baseFs}
  uniform float value;
  void main() {
    gl_FragColor = vec4(value, value, value, 1.0);
  }
`;

// 1. Splat
export const splatShader = `
  ${baseFs}
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;

  void main() {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

// 1.5 External Force (Gravity)
export const forceShader = `
  ${baseFs}
  uniform sampler2D velocity;
  uniform vec2 force; 
  uniform float dt;

  void main() {
    vec2 v = texture2D(velocity, vUv).xy;
    v += force * dt;
    gl_FragColor = vec4(v, 0.0, 1.0);
  }
`;

// 2. Advection: 移流
export const advectionShader = `
  ${baseFs}
  uniform sampler2D velocity;
  uniform sampler2D source;
  uniform float dt;
  uniform float dissipation;

  void main() {
    // 現在の速度場に従って過去の位置をサンプリング (Back-trace)
    vec2 coord = vUv - dt * texture2D(velocity, vUv).xy * texelSize;
    vec4 result = texture2D(source, coord);
    gl_FragColor = result * dissipation;
  }
`;

// 3. Divergence: 発散
export const divergenceShader = `
  ${baseFs}
  uniform sampler2D velocity;

  void main() {
    float L = texture2D(velocity, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(velocity, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(velocity, vUv + vec2(0.0, texelSize.y)).y;
    float B = texture2D(velocity, vUv - vec2(0.0, texelSize.y)).y;

    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

// 4. Curl: 渦度計算 (∂v/∂x - ∂u/∂y)
export const curlShader = `
  ${baseFs}
  uniform sampler2D velocity;

  void main() {
    float L = texture2D(velocity, vUv - vec2(texelSize.x, 0.0)).y;
    float R = texture2D(velocity, vUv + vec2(texelSize.x, 0.0)).y;
    float T = texture2D(velocity, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(velocity, vUv - vec2(0.0, texelSize.y)).x;

    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

// 5. Vorticity: 渦度閉じ込め (修正版)
// Force = (N x z) * curl, where N = grad(|curl|) / |grad(|curl|)|
export const vorticityShader = `
  ${baseFs}
  uniform sampler2D velocity;
  uniform sampler2D curl;
  uniform float curlStrength;
  uniform float dt;

  void main() {
    float L = texture2D(curl, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(curl, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(curl, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(curl, vUv - vec2(0.0, texelSize.y)).x;
    float C = texture2D(curl, vUv).x;

    // 勾配計算 (x成分: ∂|w|/∂x, y成分: ∂|w|/∂y)
    vec2 force = 0.5 * vec2(abs(R) - abs(L), abs(T) - abs(B));
    
    // 正規化 (ゼロ除算回避)
    float epsilon = 1e-5;
    float len = length(force);
    if (len > epsilon) {
        force /= len;
    } else {
        force = vec2(0.0);
    }
    
    // 力の向き: 勾配方向と直交する方向 (N x z)
    // N = (nx, ny) -> ForceDir = (ny, -nx)
    // そして渦度の強さと向き(C)を掛ける
    vec2 forceDir = vec2(force.y, -force.x);
    vec2 finalForce = forceDir * curlStrength * C;

    vec2 vel = texture2D(velocity, vUv).xy;
    gl_FragColor = vec4(vel + finalForce * dt, 0.0, 1.0);
  }
`;

// 6. Pressure: 圧力 (Jacobi)
export const pressureShader = `
  ${baseFs}
  uniform sampler2D pressure;
  uniform sampler2D divergence;

  void main() {
    float L = texture2D(pressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(pressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(pressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(pressure, vUv - vec2(0.0, texelSize.y)).x;
    float C = texture2D(pressure, vUv).x;
    float div = texture2D(divergence, vUv).x;

    float p = (L + R + T + B - div) * 0.25;
    gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
  }
`;

// 7. Gradient Subtract: 射影
export const gradientSubtractShader = `
  ${baseFs}
  uniform sampler2D pressure;
  uniform sampler2D velocity;

  void main() {
    float L = texture2D(pressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(pressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(pressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(pressure, vUv - vec2(0.0, texelSize.y)).x;
    
    vec2 v = texture2D(velocity, vUv).xy;
    v.xy -= vec2(R - L, T - B) * 0.5;
    gl_FragColor = vec4(v, 0.0, 1.0);
  }
`;

// 8. Boundary: 境界条件
export const boundaryShader = `
  ${baseFs}
  uniform sampler2D uTarget;
  uniform vec2 simRes;
  uniform float uInvert; // 1.0 for Velocity (Invert normal), 0.0 for Scalars

  void main() {
    vec2 uv = vUv;
    float x = 1.0 / simRes.x;
    float y = 1.0 / simRes.y;
    
    bool isLeft   = uv.x <= x;
    bool isRight  = uv.x >= 1.0 - x;
    bool isBottom = uv.y <= y;
    bool isTop    = uv.y >= 1.0 - y;

    // 内部はそのまま
    if (!isLeft && !isRight && !isBottom && !isTop) {
      gl_FragColor = texture2D(uTarget, uv);
      return;
    }

    vec2 offset = vec2(0.0);
    if (isLeft)   offset.x = x;
    else if (isRight)  offset.x = -x;
    else if (isBottom) offset.y = y;
    else if (isTop)    offset.y = -y;

    vec4 neighbor = texture2D(uTarget, uv + offset);

    // Slip Wall 実装
    // Velocity場の場合(uInvert > 0.5)は、壁に垂直な成分を反転
    if (uInvert > 0.5) {
      vec2 v = neighbor.xy;
      if (isLeft || isRight) v.x *= -1.0;
      if (isTop || isBottom) v.y *= -1.0;
      gl_FragColor = vec4(v, neighbor.zw);
    } else {
      // スカラー場（密度・圧力）はNeumann（コピー）
      gl_FragColor = neighbor;
    }
  }
`;

// 9. Display: 可視化モード
export const displayShader = `
  ${baseFs}
  uniform sampler2D uDensity;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform sampler2D uPressure;
  
  uniform float uMode;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uBias;

  vec3 ramp(float t) {
    return mix(uColorA, uColorB, clamp(t, 0.0, 1.0));
  }

  // HSV to RGB
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec3 c = vec3(0.0);
    
    // float比較の安全策として、小さな幅を持たせる
    if (uMode < 0.1) {
      // 0: Density
      vec3 den = texture2D(uDensity, vUv).rgb;
      float val = length(den); 
      // uBiasでコントラスト調整
      float strength = clamp(val * uBias, 0.0, 1.0);
      c = ramp(strength);
    } 
    else if (uMode < 1.1) {
      // 1: Velocity
      vec2 v = texture2D(uVelocity, vUv).xy;
      float angle = atan(v.y, v.x) / 6.28318 + 0.5;
      float mag = length(v) * uBias * 0.1;
      c = hsv2rgb(vec3(angle, 1.0, clamp(mag, 0.0, 1.0)));
    }
    else if (uMode < 2.1) {
      // 2: Curl
      float curl = texture2D(uCurl, vUv).x;
      // 負=ColorA, 正=ColorB
      float val = curl * uBias * 0.5 + 0.5;
      c = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), clamp(val, 0.0, 1.0));
    }
    else {
      // 3: Pressure
      float p = texture2D(uPressure, vUv).x;
      float val = p * uBias * 1.0;
      c = ramp(val);
    }

    gl_FragColor = vec4(c, 1.0);
  }
`;