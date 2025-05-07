// Utilities
interface Vector3 {
    x: number;
    y: number;
    z: number;
    array?: Float32Array;
  }
  
  type Matrix44 = Float32Array;
  
  const Vector3 = {
    create: (x: number, y: number, z: number): Vector3 => ({ x, y, z }),
    dot: (v0: Vector3, v1: Vector3): number => v0.x * v1.x + v0.y * v1.y + v0.z * v1.z,
    cross: (v: Vector3, v0: Vector3, v1: Vector3): void => {
      v.x = v0.y * v1.z - v0.z * v1.y;
      v.y = v0.z * v1.x - v0.x * v1.z;
      v.z = v0.x * v1.y - v0.y * v1.x;
    },
    normalize: (v: Vector3): void => {
      const l = v.x * v.x + v.y * v.y + v.z * v.z;
      if (l > 0.00001) {
        const invL = 1.0 / Math.sqrt(l);
        v.x *= invL;
        v.y *= invL;
        v.z *= invL;
      }
    },
    arrayForm: (v: Vector3): Float32Array => {
      if (v.array) {
        v.array[0] = v.x;
        v.array[1] = v.y;
        v.array[2] = v.z;
      } else {
        v.array = new Float32Array([v.x, v.y, v.z]);
      }
      return v.array;
    },
  };
  
  const Matrix44 = {
    createIdentity: (): Matrix44 =>
      new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]),
    loadProjection: (m: Matrix44, aspect: number, vdeg: number, near: number, far: number): void => {
      const h = near * Math.tan((vdeg * Math.PI) / 180.0 * 0.5) * 2.0;
      const w = h * aspect;
      m[0] = (2.0 * near) / w;
      m[5] = (2.0 * near) / h;
      m[10] = -(far + near) / (far - near);
      m[11] = -1.0;
      m[14] = (-2.0 * far * near) / (far - near);
    },
    loadLookAt: (m: Matrix44, vpos: Vector3, vlook: Vector3, vup: Vector3): void => {
      const frontv = Vector3.create(vpos.x - vlook.x, vpos.y - vlook.y, vpos.z - vlook.z);
      Vector3.normalize(frontv);
      const sidev = Vector3.create(0, 0, 0);
      Vector3.cross(sidev, vup, frontv);
      Vector3.normalize(sidev);
      const topv = Vector3.create(0, 0, 0);
      Vector3.cross(topv, frontv, sidev);
      Vector3.normalize(topv);
      m[0] = sidev.x;
      m[1] = topv.x;
      m[2] = frontv.x;
      m[4] = sidev.y;
      m[5] = topv.y;
      m[6] = frontv.y;
      m[8] = sidev.z;
      m[9] = topv.z;
      m[10] = frontv.z;
      m[12] = -(vpos.x * m[0] + vpos.y * m[4] + vpos.z * m[8]);
      m[13] = -(vpos.x * m[1] + vpos.y * m[5] + vpos.z * m[9]);
      m[14] = -(vpos.x * m[2] + vpos.y * m[6] + vpos.z * m[10]);
      m[15] = 1.0;
    },
  };
  
  // Time Info
  const timeInfo = { start: 0, prev: 0, delta: 0, elapsed: 0 };
  
  interface RenderSpec {
    width: number;
    height: number;
    aspect: number;
    array: Float32Array;
    halfWidth: number;
    halfHeight: number;
    halfArray: Float32Array;
    pointSize?: { min: number; max: number };
    renderTargets: { [key: string]: RenderTarget | undefined };
    setSize: (w: number, h: number) => void;
  }
  
  const renderSpec: RenderSpec = {
    width: 0,
    height: 0,
    aspect: 1,
    array: new Float32Array(3),
    halfWidth: 0,
    halfHeight: 0,
    halfArray: new Float32Array(3),
    renderTargets: {
      mainRT: undefined,
      wFullRT0: undefined,
      wFullRT1: undefined,
      wHalfRT0: undefined,
      wHalfRT1: undefined,
    },
    setSize: function (w: number, h: number) {
      this.width = w;
      this.height = h;
      this.aspect = w / h;
      this.array[0] = w;
      this.array[1] = h;
      this.array[2] = this.aspect;
      this.halfWidth = Math.floor(w / 2);
      this.halfHeight = Math.floor(h / 2);
      this.halfArray[0] = this.halfWidth;
      this.halfArray[1] = this.halfHeight;
      this.halfArray[2] = this.halfWidth / this.halfHeight;
    },
  };
  
  // WebGL Types
  interface RenderTarget {
    width: number;
    height: number;
    sizeArray: Float32Array;
    dtxArray: Float32Array;
    frameBuffer: WebGLFramebuffer;
    renderBuffer: WebGLRenderbuffer;
    texture: WebGLTexture;
  }
  
  interface ShaderProgram {
    program: WebGLProgram; // Explicitly store the WebGLProgram
    uniforms: { [key: string]: WebGLUniformLocation };
    attributes: { [key: string]: number };
  }
  
  interface IBlossomParticle {
    velocity: number[];
    rotation: number[];
    position: number[];
    euler: number[];
    size: number;
    alpha: number;
    zkey: number;
    setVelocity: (vx: number, vy: number, vz: number) => void;
    setRotation: (rx: number, ry: number, rz: number) => void;
    setPosition: (nx: number, ny: number, nz: number) => void;
    setEulerAngles: (rx: number, ry: number, rz: number) => void;
    setSize: (s: number) => void;
    update: (dt: number) => void;
  }
  
  interface PointFlower {
    program?: ShaderProgram | null; // Allow null in addition to undefined
    offset?: Float32Array;
    fader?: Vector3;
    numFlowers?: number;
    particles?: IBlossomParticle[];
    dataArray?: Float32Array;
    positionArrayOffset?: number;
    eulerArrayOffset?: number;
    miscArrayOffset?: number;
    buffer?: WebGLBuffer;
    area?: Vector3;
  }
  // WebGL Functions
  const deleteRenderTarget = (gl: WebGLRenderingContext, rt: RenderTarget): void => {
    gl.deleteFramebuffer(rt.frameBuffer);
    gl.deleteRenderbuffer(rt.renderBuffer);
    gl.deleteTexture(rt.texture);
  };
  
  const createRenderTarget = (gl: WebGLRenderingContext, w: number, h: number): RenderTarget => {
    const ret: RenderTarget = {
      width: w,
      height: h,
      sizeArray: new Float32Array([w, h, w / h]),
      dtxArray: new Float32Array([1.0 / w, 1.0 / h]),
      frameBuffer: gl.createFramebuffer()!,
      renderBuffer: gl.createRenderbuffer()!,
      texture: gl.createTexture()!,
    };
    gl.bindTexture(gl.TEXTURE_2D, ret.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ret.texture, 0);
    gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ret.renderBuffer);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return ret;
  };
  
  const compileShader = (gl: WebGLRenderingContext, shtype: number, shsrc: string): WebGLShader | null => {
    const retsh = gl.createShader(shtype)!;
    gl.shaderSource(retsh, shsrc);
    gl.compileShader(retsh);
    if (!gl.getShaderParameter(retsh, gl.COMPILE_STATUS)) {
      const errlog = gl.getShaderInfoLog(retsh);
      gl.deleteShader(retsh);
      console.error(errlog);
      return null;
    }
    return retsh;
  };
  
  const createShader = (
    gl: WebGLRenderingContext,
    vtxsrc: string,
    frgsrc: string,
    uniformlist: string[] | null,
    attrlist: string[] | null
  ): ShaderProgram | undefined => {
    const vsh = compileShader(gl, gl.VERTEX_SHADER, vtxsrc);
    if (!vsh) {
      console.error('Vertex shader compilation failed');
      return undefined; // Changed from null
    }
  
    const fsh = compileShader(gl, gl.FRAGMENT_SHADER, frgsrc);
    if (!fsh) {
      console.error('Fragment shader compilation failed');
      return undefined; // Changed from null
    }
  
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.deleteShader(vsh);
    gl.deleteShader(fsh);
    gl.linkProgram(prog);
  
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const errlog = gl.getProgramInfoLog(prog);
      console.error('Shader program linking failed:', errlog);
      gl.deleteProgram(prog);
      return undefined; // Changed from null
    }
  
    const shaderProgram: ShaderProgram = {
      program: prog,
      uniforms: {},
      attributes: {},
    };
    if (uniformlist) {
      uniformlist.forEach((u) => {
        shaderProgram.uniforms[u] = gl.getUniformLocation(prog, u)!;
      });
    }
    if (attrlist) {
      attrlist.forEach((a) => {
        shaderProgram.attributes[a] = gl.getAttribLocation(prog, a);
      });
    }
    return shaderProgram;
  };
  
  const activateShader = (gl: WebGLRenderingContext, prog: ShaderProgram): void => {
    if (!prog || !prog.program) {
      console.error('Cannot use shader: program is null or invalid');
      return;
    }
    gl.useProgram(prog.program); // Use the actual WebGLProgram
    Object.keys(prog.attributes).forEach((attr) => {
      gl.enableVertexAttribArray(prog.attributes[attr]);
    });
  };
  
  // Update deactivateShader accordingly
  const deactivateShader = (gl: WebGLRenderingContext, prog: ShaderProgram): void => {
    if (!prog || !prog.program) {
      console.error('Cannot unuse shader: program is null or invalid');
      return;
    }
    Object.keys(prog.attributes).forEach((attr) => {
      gl.disableVertexAttribArray(prog.attributes[attr]);
    });
    gl.useProgram(null);
  };
  
  // Projection and Camera
  const projection = {
    angle: 60,
    nearfar: new Float32Array([0.1, 100.0]),
    matrix: Matrix44.createIdentity(),
  };
  
  const camera = {
    position: Vector3.create(0, 0, 100),
    lookat: Vector3.create(0, 0, 0),
    up: Vector3.create(0, 1, 0),
    dof: Vector3.create(10.0, 4.0, 8.0),
    matrix: Matrix44.createIdentity(),
  };
  
  // Blossom Particle
  const pointFlower: PointFlower = {};

  
  class BlossomParticle implements IBlossomParticle {
    velocity: number[] = new Array(3);
    rotation: number[] = new Array(3);
    position: number[] = new Array(3);
    euler: number[] = new Array(3);
    size: number = 1.0;
    alpha: number = 1.0;
    zkey: number = 0.0;
  
    setVelocity(vx: number, vy: number, vz: number): void {
      this.velocity[0] = vx;
      this.velocity[1] = vy;
      this.velocity[2] = vz;
    }
  
    setRotation(rx: number, ry: number, rz: number): void {
      this.rotation[0] = rx;
      this.rotation[1] = ry;
      this.rotation[2] = rz;
    }
  
    setPosition(nx: number, ny: number, nz: number): void {
      this.position[0] = nx;
      this.position[1] = ny;
      this.position[2] = nz;
    }
  
    setEulerAngles(rx: number, ry: number, rz: number): void {
      this.euler[0] = rx;
      this.euler[1] = ry;
      this.euler[2] = rz;
    }
  
    setSize(s: number): void {
      this.size = s;
    }
  
    update(dt: number): void {
      this.position[0] += this.velocity[0] * dt;
      this.position[1] += this.velocity[1] * dt;
      this.position[2] += this.velocity[2] * dt;
      this.euler[0] += this.rotation[0] * dt;
      this.euler[1] += this.rotation[1] * dt;
      this.euler[2] += this.rotation[2] * dt;
    }
  }
  
  const createPointFlowers = (gl: WebGLRenderingContext, vtxsrc: string, frgsrc: string): void => {
    const prm = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as [number, number];
    renderSpec.pointSize = { min: prm[0], max: prm[1] };
  
    const shader = createShader(
      gl,
      vtxsrc,
      frgsrc,
      ['uProjection', 'uModelview', 'uResolution', 'uOffset', 'uDOF', 'uFade'],
      ['aPosition', 'aEuler', 'aMisc']
    );
    pointFlower.program = shader ?? undefined; // Convert null to undefined
  
    if (!pointFlower.program) {
      console.error('Failed to create point flower shader program. Aborting.');
      return;
    }
  
    activateShader(gl, pointFlower.program);
    pointFlower.offset = new Float32Array([0.0, 0.0, 0.0]);
    pointFlower.fader = Vector3.create(0.0, 10.0, 0.0);
    pointFlower.numFlowers = 1600;
    pointFlower.particles = new Array(pointFlower.numFlowers);
    pointFlower.dataArray = new Float32Array(pointFlower.numFlowers * (3 + 3 + 2));
    pointFlower.positionArrayOffset = 0;
    pointFlower.eulerArrayOffset = pointFlower.numFlowers * 3;
    pointFlower.miscArrayOffset = pointFlower.numFlowers * 6;
    pointFlower.buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    deactivateShader(gl, pointFlower.program);
  
    for (let i = 0; i < pointFlower.numFlowers; i++) {
      pointFlower.particles[i] = new BlossomParticle();
    }
  };
  
  const initPointFlowers = (): void => {
    pointFlower.area = Vector3.create(20.0, 20.0, 20.0);
    pointFlower.area.x = pointFlower.area.y * renderSpec.aspect;
    pointFlower.fader!.x = 10.0;
    pointFlower.fader!.y = pointFlower.area.z;
    pointFlower.fader!.z = 0.1;
    const PI2 = Math.PI * 2.0;
    const tmpv3 = Vector3.create(0, 0, 0);
    const symmetryrand = () => Math.random() * 2.0 - 1.0;
    for (let i = 0; i < pointFlower.numFlowers!; i++) {
      const tmpprtcl = pointFlower.particles![i];
      tmpv3.x = symmetryrand() * 0.3 + 0.8;
      tmpv3.y = symmetryrand() * 0.2 - 1.0;
      tmpv3.z = symmetryrand() * 0.3 + 0.5;
      Vector3.normalize(tmpv3);
      const tmpv = 2.0 + Math.random() * 1.0;
      tmpprtcl.setVelocity(tmpv3.x * tmpv, tmpv3.y * tmpv, tmpv3.z * tmpv);
      tmpprtcl.setRotation(symmetryrand() * PI2 * 0.5, symmetryrand() * PI2 * 0.5, symmetryrand() * PI2 * 0.5);
      tmpprtcl.setPosition(
        symmetryrand() * pointFlower.area.x,
        symmetryrand() * pointFlower.area.y,
        symmetryrand() * pointFlower.area.z
      );
      tmpprtcl.setEulerAngles(Math.random() * PI2, Math.random() * PI2, Math.random() * PI2);
      tmpprtcl.setSize(0.9 + Math.random() * 0.1);
    }
  };
  
  const renderPointFlowers = (gl: WebGLRenderingContext): void => {
    const PI2 = Math.PI * 2.0;
    const repeatPos = (prt: IBlossomParticle, cmp: number, limit: number): void => {
      if (Math.abs(prt.position[cmp]) - prt.size * 0.5 > limit) {
        prt.position[cmp] += prt.position[cmp] > 0 ? -limit * 2.0 : limit * 2.0;
      }
    };
    const repeatEuler = (prt: IBlossomParticle, cmp: number): void => {
      prt.euler[cmp] = prt.euler[cmp] % PI2;
      if (prt.euler[cmp] < 0.0) prt.euler[cmp] += PI2;
    };
    for (let i = 0; i < pointFlower.numFlowers!; i++) {
      const prtcl = pointFlower.particles![i];
      prtcl.update(timeInfo.delta);
      repeatPos(prtcl, 0, pointFlower.area!.x);
      repeatPos(prtcl, 1, pointFlower.area!.y);
      repeatPos(prtcl, 2, pointFlower.area!.z);
      repeatEuler(prtcl, 0);
      repeatEuler(prtcl, 1);
      repeatEuler(prtcl, 2);
      prtcl.alpha = 1.0;
      prtcl.zkey =
        camera.matrix[2] * prtcl.position[0] +
        camera.matrix[6] * prtcl.position[1] +
        camera.matrix[10] * prtcl.position[2] +
        camera.matrix[14];
    }
    pointFlower.particles!.sort((p0, p1) => p0.zkey - p1.zkey);
    let ipos = pointFlower.positionArrayOffset!;
    let ieuler = pointFlower.eulerArrayOffset!;
    let imisc = pointFlower.miscArrayOffset!;
    for (let i = 0; i < pointFlower.numFlowers!; i++) {
      const prtcl = pointFlower.particles![i];
      pointFlower.dataArray![ipos] = prtcl.position[0];
      pointFlower.dataArray![ipos + 1] = prtcl.position[1];
      pointFlower.dataArray![ipos + 2] = prtcl.position[2];
      ipos += 3;
      pointFlower.dataArray![ieuler] = prtcl.euler[0];
      pointFlower.dataArray![ieuler + 1] = prtcl.euler[1];
      pointFlower.dataArray![ieuler + 2] = prtcl.euler[2];
      ieuler += 3;
      pointFlower.dataArray![imisc] = prtcl.size;
      pointFlower.dataArray![imisc + 1] = prtcl.alpha;
      imisc += 2;
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const prog = pointFlower.program!;
    activateShader(gl, prog);
    gl.uniformMatrix4fv(prog.uniforms.uProjection, false, projection.matrix);
    gl.uniformMatrix4fv(prog.uniforms.uModelview, false, camera.matrix);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
    gl.uniform3fv(prog.uniforms.uDOF, Vector3.arrayForm(camera.dof));
    gl.uniform3fv(prog.uniforms.uFade, Vector3.arrayForm(pointFlower.fader!));
    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer!);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray!, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(
      prog.attributes.aPosition,
      3,
      gl.FLOAT,
      false,
      0,
      pointFlower.positionArrayOffset! * Float32Array.BYTES_PER_ELEMENT
    );
    gl.vertexAttribPointer(
      prog.attributes.aEuler,
      3,
      gl.FLOAT,
      false,
      0,
      pointFlower.eulerArrayOffset! * Float32Array.BYTES_PER_ELEMENT
    );
    gl.vertexAttribPointer(
      prog.attributes.aMisc,
      2,
      gl.FLOAT,
      false,
      0,
      pointFlower.miscArrayOffset! * Float32Array.BYTES_PER_ELEMENT
    );
    for (let i = 1; i < 2; i++) {
      const zpos = i * -2.0;
      pointFlower.offset![0] = pointFlower.area!.x * -1.0;
      pointFlower.offset![1] = pointFlower.area!.y * -1.0;
      pointFlower.offset![2] = pointFlower.area!.z * zpos;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset!);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers!);
      pointFlower.offset![0] = pointFlower.area!.x * -1.0;
      pointFlower.offset![1] = pointFlower.area!.y * 1.0;
      pointFlower.offset![2] = pointFlower.area!.z * zpos;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset!);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers!);
      pointFlower.offset![0] = pointFlower.area!.x * 1.0;
      pointFlower.offset![1] = pointFlower.area!.y * -1.0;
      pointFlower.offset![2] = pointFlower.area!.z * zpos;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset!);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers!);
      pointFlower.offset![0] = pointFlower.area!.x * 1.0;
      pointFlower.offset![1] = pointFlower.area!.y * 1.0;
      pointFlower.offset![2] = pointFlower.area!.z * zpos;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset!);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers!);
    }
    pointFlower.offset![0] = 0.0;
    pointFlower.offset![1] = 0.0;
    pointFlower.offset![2] = 0.0;
    gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset!);
    gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers!);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    deactivateShader(gl, prog);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
  };
  
  // Effects
  interface Effect {
    program: ShaderProgram;
    dataArray: Float32Array;
    buffer: WebGLBuffer;
  }
  
  const effectLib: {
    sceneBg?: Effect | null; // Allow null
    mkBrightBuf?: Effect | null;
    dirBlur?: Effect | null;
    finalComp?: Effect | null;
  } = {};
  
  const createEffectProgram = (
    gl: WebGLRenderingContext,
    vtxsrc: string,
    frgsrc: string,
    exunifs: string[] | null,
    exattrs: string[] | null
  ): Effect | undefined => {
    const unifs = ['uResolution', 'uSrc', 'uDelta'].concat(exunifs || []);
    const attrs = ['aPosition'].concat(exattrs || []);
    const program = createShader(gl, vtxsrc, frgsrc, unifs, attrs);
    if (!program) {
      console.error('Failed to create effect shader program');
      return undefined; // Changed from null
    }
    const ret: Effect = {
      program,
      dataArray: new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]),
      buffer: gl.createBuffer()!,
    };
    activateShader(gl, ret.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    deactivateShader(gl, ret.program);
    return ret;
  };
  
  const activateEffect = (gl: WebGLRenderingContext, fxobj: Effect, srctex: RenderTarget | null): void => {
    const prog = fxobj.program;
    activateShader(gl, prog);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
    if (srctex) {
      gl.uniform2fv(prog.uniforms.uDelta, srctex.dtxArray);
      gl.uniform1i(prog.uniforms.uSrc, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srctex.texture);
    }
  };
  
  const drawEffect = (gl: WebGLRenderingContext, fxobj: Effect): void => {
    gl.bindBuffer(gl.ARRAY_BUFFER, fxobj.buffer);
    gl.vertexAttribPointer(fxobj.program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  
  const deactivateEffect = (gl: WebGLRenderingContext, fxobj: Effect): void => {
    deactivateShader(gl, fxobj.program);
  };
  const createEffectLib = (
    gl: WebGLRenderingContext,
    cmnvtxsrc: string,
    bgFsh: string,
    brightbufFsh: string,
    dirblurFsh: string,
    finalVsh: string,
    finalFsh: string
  ): void => {
    effectLib.sceneBg = createEffectProgram(gl, cmnvtxsrc, bgFsh, ['uTimes'], null) ?? undefined;
    if (!effectLib.sceneBg) {
      console.error('Failed to create sceneBg effect');
      return;
    }
  
    effectLib.mkBrightBuf = createEffectProgram(gl, cmnvtxsrc, brightbufFsh, null, null) ?? undefined;
    if (!effectLib.mkBrightBuf) {
      console.error('Failed to create mkBrightBuf effect');
      return;
    }
  
    effectLib.dirBlur = createEffectProgram(gl, cmnvtxsrc, dirblurFsh, ['uBlurDir'], null) ?? undefined;
    if (!effectLib.dirBlur) {
      console.error('Failed to create dirBlur effect');
      return;
    }
  
    effectLib.finalComp = createEffectProgram(gl, finalVsh, finalFsh, ['uBloom'], null) ?? undefined;
    if (!effectLib.finalComp) {
      console.error('Failed to create finalComp effect');
      return;
    }
  };
  const renderBackground = (gl: WebGLRenderingContext, elapsed: number, delta: number): void => {
    gl.disable(gl.DEPTH_TEST);
    activateEffect(gl, effectLib.sceneBg!, null);
    gl.uniform2f(effectLib.sceneBg!.program.uniforms.uTimes, elapsed, delta);
    drawEffect(gl, effectLib.sceneBg!);
    deactivateEffect(gl, effectLib.sceneBg!);
    gl.enable(gl.DEPTH_TEST);
  };
  
  const renderPostProcess = (gl: WebGLRenderingContext): void => {
    gl.disable(gl.DEPTH_TEST);
    const bindRT = (rt: RenderTarget, isclear: boolean): void => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, rt.frameBuffer);
      gl.viewport(0, 0, rt.width, rt.height);
      if (isclear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }
    };
    bindRT(renderSpec.renderTargets.wHalfRT0!, true);
    activateEffect(gl, effectLib.mkBrightBuf!, renderSpec.renderTargets.mainRT!);
    drawEffect(gl, effectLib.mkBrightBuf!);
    deactivateEffect(gl, effectLib.mkBrightBuf!);
    for (let i = 0; i < 2; i++) {
      const p = 1.5 + 1 * i;
      const s = 2.0 + 1 * i;
      bindRT(renderSpec.renderTargets.wHalfRT1!, true);
      activateEffect(gl, effectLib.dirBlur!, renderSpec.renderTargets.wHalfRT0!);
      gl.uniform4f(effectLib.dirBlur!.program.uniforms.uBlurDir, p, 0.0, s, 0.0);
      drawEffect(gl, effectLib.dirBlur!);
      deactivateEffect(gl, effectLib.dirBlur!);
      bindRT(renderSpec.renderTargets.wHalfRT0!, true);
      activateEffect(gl, effectLib.dirBlur!, renderSpec.renderTargets.wHalfRT1!);
      gl.uniform4f(effectLib.dirBlur!.program.uniforms.uBlurDir, 0.0, p, 0.0, s);
      drawEffect(gl, effectLib.dirBlur!);
      deactivateEffect(gl, effectLib.dirBlur!);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    activateEffect(gl, effectLib.finalComp!, renderSpec.renderTargets.mainRT!);
    gl.uniform1i(effectLib.finalComp!.program.uniforms.uBloom, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, renderSpec.renderTargets.wHalfRT0!.texture);
    drawEffect(gl, effectLib.finalComp!);
    deactivateEffect(gl, effectLib.finalComp!);
    gl.enable(gl.DEPTH_TEST);
  };

  const createScene = (
    gl: WebGLRenderingContext,
    cmnvtxsrc: string,
    bgFsh: string,
    brightbufFsh: string,
    dirblurFsh: string,
    finalVsh: string,
    finalFsh: string,
    vtxsrc: string,
    frgsrc: string
  ): void => {
    createEffectLib(gl, cmnvtxsrc, bgFsh, brightbufFsh, dirblurFsh, finalVsh, finalFsh);
    if (!effectLib.sceneBg || !effectLib.mkBrightBuf || !effectLib.dirBlur || !effectLib.finalComp) {
      console.error('Effect library creation failed. Aborting scene creation.');
      return;
    }
  
    createPointFlowers(gl, vtxsrc, frgsrc);
    if (!pointFlower.program) {
      console.error('Point flowers creation failed. Aborting scene creation.');
      return;
    }
  
   
  };
  
    const initScene = (): void => {
      initPointFlowers();
      camera.position.z = pointFlower.area!.z + projection.nearfar[0];
      projection.angle =
        (Math.atan2(pointFlower.area!.y, camera.position.z + pointFlower.area!.z) * 180.0 * 2.0) / Math.PI;
      Matrix44.loadProjection(projection.matrix, renderSpec.aspect, projection.angle, projection.nearfar[0], projection.nearfar[1]);
    };
  
  const renderScene = (gl: WebGLRenderingContext, elapsed: number, delta: number): void => {
    Matrix44.loadLookAt(camera.matrix, camera.position, camera.lookat, camera.up);
    gl.enable(gl.DEPTH_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderSpec.renderTargets.mainRT!.frameBuffer);
    gl.viewport(0, 0, renderSpec.renderTargets.mainRT!.width, renderSpec.renderTargets.mainRT!.height);
    gl.clearColor(0.005, 0, 0.05, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderBackground(gl, elapsed, delta);
    renderPointFlowers(gl);
    renderPostProcess(gl);
  };
  
  const setViewports = (gl: WebGLRenderingContext, canvas: HTMLCanvasElement): void => {
    renderSpec.setSize(canvas.width, canvas.height);
    gl.clearColor(0.2, 0.2, 0.5, 1.0);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);
    const rtfunc = (rtname: string, rtw: number, rth: number): void => {
      const rt = renderSpec.renderTargets[rtname];
      if (rt) deleteRenderTarget(gl, rt);
      renderSpec.renderTargets[rtname] = createRenderTarget(gl, rtw, rth);
    };
    rtfunc('mainRT', renderSpec.width, renderSpec.height);
    rtfunc('wFullRT0', renderSpec.width, renderSpec.height);
    rtfunc('wFullRT1', renderSpec.width, renderSpec.height);
    rtfunc('wHalfRT0', renderSpec.halfWidth, renderSpec.halfHeight);
    rtfunc('wHalfRT1', renderSpec.halfWidth, renderSpec.halfHeight);
  };

  const makeCanvasFullScreen = (canvas: HTMLCanvasElement): void => {
    const b = document.body;
    const d = document.documentElement;
    const fullw = Math.max(b.clientWidth, b.scrollWidth, d.scrollWidth, d.clientWidth);
    const fullh = Math.max(b.clientHeight, b.scrollHeight, d.scrollHeight, d.clientHeight);
    canvas.width = fullw;
    canvas.height = fullh;
  };
  
  const animate = (
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    vtxsrc: string,
    frgsrc: string,
    cmnvtxsrc: string,
    bgFsh: string,
    brightbufFsh: string,
    dirblurFsh: string,
    finalVsh: string,
    finalFsh: string
  ): () => void => {
    let animating = true;
    const render = () => {
      renderScene(gl, timeInfo.elapsed, timeInfo.delta);
    };
    const step = () => {
      const curdate = new Date();
      timeInfo.elapsed = (curdate.getTime() - timeInfo.start) / 1000.0;
      timeInfo.delta = (curdate.getTime() - timeInfo.prev) / 1000.0;
      timeInfo.prev = curdate.getTime();
      if (animating) requestAnimationFrame(step);
      render();
    };
    makeCanvasFullScreen(canvas);
    setViewports(gl, canvas);
    createScene(gl, cmnvtxsrc, bgFsh, brightbufFsh, dirblurFsh, finalVsh, finalFsh, vtxsrc, frgsrc);
    initScene();
    timeInfo.start = new Date().getTime();
    timeInfo.prev = timeInfo.start;
    step();
    return () => {
      animating = false;
    };
  };
  
  export { animate, makeCanvasFullScreen, setViewports };
