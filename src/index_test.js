//import React from 'react';
//import ReactDOM from 'react-dom';
//import App from './App';

//ReactDOM.render(<App/>, document.getElementById('hero-canvas'));

import 'styles/index.scss';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import modelIcon from '../public/models/logo_icon.glb';
import modelPhoneBody from '../public/models/phone_2_body.glb';
import modelPhoneScreen from '../public/models/phone_2_screen.glb';
import bg1TextureSrc from '../public/textures/back_city.jpg';


let container;
let camera, scene, renderer, light, light2 ;
let video, videoTexture, videoMat, phoneBodyMat, iconRig;
let stats;

init();

function init() {

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	//renderer.outputEncoding = THREE.sRGBEncoding;
	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 3, -15 );
	camera.lookAt(0,8,100);

	scene = new THREE.Scene();

	RectAreaLightUniformsLib.init();

	const rectLight1 = new THREE.RectAreaLight( 0xffffff, 5, 4, 10 );
	rectLight1.position.set( - 5, 5, 5 );
	scene.add( rectLight1 );

	const rectLight2 = new THREE.RectAreaLight( 0xffffff, 5, 4, 10 );
	rectLight2.position.set( 0, 5, 5 );
	scene.add( rectLight2 );

	const rectLight3 = new THREE.RectAreaLight( 0xffffff, 5, 4, 10 );
	rectLight3.position.set( 5, 5, 5 );
	scene.add( rectLight3 );

	scene.add( new RectAreaLightHelper( rectLight1 ) );
	scene.add( new RectAreaLightHelper( rectLight2 ) );
	scene.add( new RectAreaLightHelper( rectLight3 ) );
	
	light = new THREE.PointLight( 0xffffff, 0.1, 1000 );
	light.position.set(-0.5 ,0 ,-20);
	light2 = new THREE.PointLight( 0xffffff, 2, 1000 );
    light2.position.set(2 ,8 ,10);
	scene.add(light);
	//scene.add(light2);
	

	const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
	const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x202020, roughness: 0.5, metalness: 0 } );
	const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
	scene.add( mshStdFloor );

	// Background
	let ang_rad = camera.fov * Math.PI / 180;
    let fov_y = (camera.position.z + 10) * Math.tan(ang_rad / 2) * 2;	
	const textureLoader = new THREE.TextureLoader();
	const bg1Texture = textureLoader.load(bg1TextureSrc);
	const bg1Geometry = new THREE.PlaneGeometry(fov_y * camera.aspect, fov_y);
	const bg1Material = new THREE.MeshBasicMaterial({ 
		map: bg1Texture
	});

	const bg1Mesh = new THREE.Mesh(bg1Geometry, bg1Material);	
	bg1Mesh.scale.set(3.4, 3.4, 1);		
	bg1Mesh.position.set(0, 0, -40);
	//scene.add(bg1Mesh);

	

	//const controls = new OrbitControls( camera, renderer.domElement );
	//controls.target.copy( meshKnot.position );
	//controls.update();

	// Icon Mesh
    iconRig = new THREE.Object3D();
    const loader = new GLTFLoader();

    loader.load( modelIcon, function ( gltf ) {
        const iconScene = gltf.scene;
        iconRig.add(iconScene);
    });

    iconRig.position.set(0, 2, 0);
	iconRig.rotation.set(0, 3, 0);
	scene.add(iconRig);
	
	//

	window.addEventListener( 'resize', onWindowResize );


}

function onWindowResize() {

	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = ( window.innerWidth / window.innerHeight );
	camera.updateProjectionMatrix();

}

function animation( time ) {

	//const mesh = scene.getObjectByName( 'meshKnot' );
	//mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}