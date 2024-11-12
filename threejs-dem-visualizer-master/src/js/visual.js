import {
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  WebGLRenderer,
  PlaneGeometry,
  GridHelper,
  AxesHelper,
  // Color,
  // TextureLoader,
  MeshLambertMaterial,
  DoubleSide,
  Mesh,
  Float32BufferAttribute,
} from 'three'; // import min because three.js is not tree-shakable for now
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Detector from './vendor/Detector';
// TODO: Major performance problems on reading big images
// import terrain from '../textures/agri-medium-dem.tif';
// import mountainImage from '../textures/agri-medium-autumn.jpg';

// import terrain from '../textures/agri-small-dem.tif';
// import mountainImage from '../textures/agri-small-autumn.jpg';

require('../sass/visual.sass');

class Application {
  constructor(opts = {}) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.demFile = opts.terrainFile;

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
      // TODO: style warning message
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
    this.setupHelpers();

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    // when render is invoked via requestAnimationFrame(this.render) there is
    // no 'this', so either we bind it explicitly or use an es6 arrow function.
    // requestAnimationFrame(this.render.bind(this));
    requestAnimationFrame(() => this.render());
  }

  static createContainer() {
    const div = document.createElement('div');
    div.setAttribute('id', 'canvas-container');
    div.setAttribute('class', 'container');
    return div;
  }

  setupRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xd3d3d3); // it's a dark gray
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
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
    this.camera.position.set(1000, 1000, 1000);
    this.camera.lookAt(this.scene.position);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    // 자동 회전 막아둠...
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
    // dem 파일 불러오기
    const readGeoTif = async () => {
      const rawTiff = await GeoTIFF.fromUrl(this.demFile);
      const tifImage = await rawTiff.getImage();
      const image = {
        width: tifImage.getWidth(),
        height: tifImage.getHeight(),
      };

      /* 
      The third and fourth parameter are image segments and we are subtracting one from each,
       otherwise our 3D model goes crazy.
       https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js#L57
       */
      const geometry = new PlaneGeometry(
        image.width,
        image.height,
        image.width - 1,
        image.height - 1
      );

      const data = await tifImage.readRasters({ interleave: true });
      console.time('parseGeom');
      const arr1 = new Array(geometry.attributes.position.count);
      //z축 설정
      const arr = arr1.fill(1);
      arr.forEach((a, index) => {
        geometry.attributes.position.setZ(index, (data[index] / 10) * -1);
      });
      console.timeEnd('parseGeom');

      // const texture = new TextureLoader().load(mountainImage);
      const material = new MeshLambertMaterial({
        // color: 0x8b4513,
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

      const colorArray = new Float32Array(geometry.attributes.position.count * 3);

      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const z = geometry.attributes.position.getZ(i);
        const t = Math.pow((z - minZ) / (maxZ - minZ), 2);

        // const color = new Color();
        // color.setHSL(0.7 - t * 0.7, 1, 0.5);

        colorArray[i * 3] = t;
        colorArray[i * 3 + 1] = t;
        colorArray[i * 3 + 2] = t;
      }

      geometry.setAttribute('color', new Float32BufferAttribute(colorArray, 3));
      geometry.attributes.color.needsUpdate = true;

      const mountain = new Mesh(geometry, material);
      mountain.position.y = 0;
      mountain.rotation.x = Math.PI / 2;

      this.scene.add(mountain);

      const loader = document.getElementById('loader');
      loader.style.opacity = '-1';

      // After a proper animation on opacity, hide element to make canvas clickable again
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1500);
    };

    readGeoTif();
  }

  setupHelpers() {
    const gridHelper = new GridHelper(1000, 40);
    this.scene.add(gridHelper);
    console.log('The X axis is red. The Y axis is green. The Z axis is blue.');
    const axesHelper = new AxesHelper(500);
    this.scene.add(axesHelper);
  }
}

export function visualizeDEMfile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    new Application({
      container: document.getElementById('canvas-container'),
      demFile: reader.result,
    });
  };
  reader.readAsArrayBuffer(file);
}

// (() => {
//   const app = new Application({
//     container: document.getElementById('canvas-container'),
//   });
//   console.log(app);
// })();
