import {
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  WebGLRenderer,
  PlaneGeometry,
<<<<<<< HEAD
  // GridHelper,
  // AxesHelper,
  MeshLambertMaterial,
  // MeshPhongMaterial,
  DoubleSide,
  Mesh,
  Float32BufferAttribute,
  // MeshBasicMaterial,
  Color,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Detector from './vendor/Detector';
import * as d3 from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';

class Application {
  constructor(opts = {}) {
    this.canvas =
      opts.canvas ||
      document.getElementById('canvas-container') ||
      document.getElementById('visualizationContainer');
=======
  GridHelper,
  AxesHelper,
  MeshLambertMaterial,
  DoubleSide,
  Mesh,
  Float32BufferAttribute,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Detector from './vendor/Detector';

class Application {
  constructor(opts = {}) {
    this.canvas = opts.canvas || document.getElementById('canvas-container');
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.demFile = opts.demdata;

    if (opts.container) {
      this.container = opts.container;
    } else {
      const div = Application.createContainer();
      document.body.appendChild(div);
      this.container = div;
    }

    if (Detector.webgl) {
      this.init();
      this.render();
    } else {
      console.log('WebGL NOT supported in your browser!');
      const warning = Detector.getWebGLErrorMessage();
      this.container.appendChild(warning);
    }
  }

  init() {
    this.scene = new Scene();
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLight();
    this.setupTerrainModel();
<<<<<<< HEAD
    // this.setupHelpers();
=======
    this.setupHelpers();
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1

    window.addEventListener('resize', () => {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  static createContainer() {
    const div = document.createElement('div');
    div.setAttribute('id', 'canvas-container');
    div.setAttribute('class', 'container');
    return div;
  }

  setupRenderer() {
<<<<<<< HEAD
    this.renderer = new WebGLRenderer({ antialias: false });
    this.renderer.setClearColor(0xd3d3d3);
    this.renderer.setPixelRatio(window.devicePixelRatio);
=======
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xd3d3d3);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    const fov = 75;
    const aspect = this.width / this.height;
    const near = 0.1;
    const far = 10000;
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
<<<<<<< HEAD
    this.camera.position.set(300, 300, 300);
=======
    this.camera.position.set(1000, 1000, 1000);
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
    this.camera.lookAt(this.scene.position);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    this.controls.autoRotate = false;
  }

  setupLight() {
    this.DirectionalLight1 = new DirectionalLight(0xffffff, 0.5);
    this.DirectionalLight1.position.set(500, 1000, 250);
    this.scene.add(this.DirectionalLight1);

    this.DirectionalLight2 = new DirectionalLight(0xffffff, 0.5);
    this.DirectionalLight2.position.set(-500, 1000, 250);
    this.scene.add(this.DirectionalLight2);

    this.AmbientLight1 = new AmbientLight(0xffffff, 0.2);
    this.scene.add(this.AmbientLight1);
  }

  setupTerrainModel() {
    const readGeoTif = async () => {
      try {
        const rawTiff = await GeoTIFF.fromArrayBuffer(this.demFile);
        const tifImage = await rawTiff.getImage();

        if (!tifImage) {
          throw new Error('Failed to parse the DEM file.');
        }

        const image = {
          width: tifImage.getWidth(),
          height: tifImage.getHeight(),
        };

        const geometry = new PlaneGeometry(
          image.width,
          image.height,
          image.width - 1,
          image.height - 1
        );

        const data = await tifImage.readRasters({ interleave: true });
        if (!data || data.length === 0) {
          throw new Error('The DEM file contains no data.');
        }

        console.time('parseGeom');
        const arr1 = new Array(geometry.attributes.position.count);
        const arr = arr1.fill(1);
        arr.forEach((a, index) => {
<<<<<<< HEAD
          geometry.attributes.position.setZ(index, (data[index] / 50) * -1);
=======
          geometry.attributes.position.setZ(index, (data[index] / 10) * -1);
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
        });
        console.timeEnd('parseGeom');

        const material = new MeshLambertMaterial({
          vertexColors: true,
          wireframe: false,
          side: DoubleSide,
        });

        const positions = geometry.attributes.position.array;
        let minZ = Infinity;
        let maxZ = -Infinity;

        for (let i = 2; i < positions.length; i += 3) {
          const z = positions[i];
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        }

<<<<<<< HEAD
        const colorScale = scaleSequential(d3.interpolateMagma); // Magma 컬러맵 설정
=======
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
        const colorArray = new Float32Array(geometry.attributes.position.count * 3);

        for (let i = 0; i < geometry.attributes.position.count; i++) {
          const z = geometry.attributes.position.getZ(i);
<<<<<<< HEAD
          const t = Math.pow((z - minZ) / (maxZ - minZ), 2); // 0~1로 정규화 후 제곱

          const colorString = colorScale(t); // d3.interpolateMagma에서 색상 문자열 반환
          const color = new Color(colorString); // Three.js Color 객체로 변환

          colorArray[i * 3] = color.r; // R 값
          colorArray[i * 3 + 1] = color.g; // G 값
          colorArray[i * 3 + 2] = color.b; // B 값
=======
          const t = Math.pow((z - minZ) / (maxZ - minZ), 2);
          colorArray[i * 3] = t;
          colorArray[i * 3 + 1] = t;
          colorArray[i * 3 + 2] = t;
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
        }

        geometry.setAttribute('color', new Float32BufferAttribute(colorArray, 3));
        geometry.attributes.color.needsUpdate = true;

        const mountain = new Mesh(geometry, material);
        mountain.position.y = 0;
        mountain.rotation.x = Math.PI / 2;

        this.scene.add(mountain);

        this.displayErrorMessage(''); // Clear any error message if DEM loads successfully
      } catch (error) {
        console.error('Error loading DEM file:', error);
        this.displayErrorMessage(`Error loading DEM file: ${error.message}`);
      }
    };

    readGeoTif();
  }
<<<<<<< HEAD
=======

>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
  // Error message display function
  displayErrorMessage(message) {
    let errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.setAttribute('id', 'error-container');
      errorContainer.style.color = 'red';
      errorContainer.style.position = 'absolute';
      errorContainer.style.top = '10px';
      errorContainer.style.left = '10px';
      errorContainer.style.zIndex = '1000';
      document.body.appendChild(errorContainer);
    }
    errorContainer.innerHTML = `<p>${message}</p>`;
  }

<<<<<<< HEAD
  // setupHelpers() {
  //   const gridHelper = new GridHelper(1000, 40);
  //   this.scene.add(gridHelper);
  //   console.log('The X axis is red. The Y axis is green. The Z axis is blue.');
  //   const axesHelper = new AxesHelper(500);
  //   this.scene.add(axesHelper);
  // }
=======
  setupHelpers() {
    const gridHelper = new GridHelper(1000, 40);
    this.scene.add(gridHelper);
    console.log('The X axis is red. The Y axis is green. The Z axis is blue.');
    const axesHelper = new AxesHelper(500);
    this.scene.add(axesHelper);
  }
>>>>>>> 5be8de7378fee68e4201df46117893c8351a1fe1
}

export default Application;
