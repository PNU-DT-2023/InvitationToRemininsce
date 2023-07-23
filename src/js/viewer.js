import * as THREE from '../../node_modules/three/build/three.module.js';

let camera, scene, renderer;

let isUserInteracting = false,
    onPointerDownMouseX = 0, onPointerDownMouseY = 0,
    lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0,
    phi = 0, theta = 0;

function init() {

    const container = document.querySelector( '.content-wrapper' ); 

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );

    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale( - 1, 1, 1 );

    const texture = new THREE.TextureLoader().load( '../../src/img/pano_test.png' );
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial( { map: texture } );

    const mesh = new THREE.Mesh( geometry, material );

    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.useLegacyLights = false;
    container.appendChild( renderer.domElement );
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.zIndex = '99';
    container.style.touchAction = 'none';
    container.addEventListener( 'pointerdown', onPointerDown );

    document.addEventListener( 'wheel', onDocumentMouseWheel );

    //

    document.addEventListener( 'dragover', function ( event ) {

        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

    } );

    document.addEventListener( 'dragenter', function () {

        document.body.style.opacity = 0.5;

    } );

    document.addEventListener( 'dragleave', function () {

        document.body.style.opacity = 1;

    } );

    document.addEventListener( 'drop', function ( event ) {

        event.preventDefault();

        const reader = new FileReader();
        reader.addEventListener( 'load', function ( event ) {

            material.map.image.src = event.target.result;
            material.map.needsUpdate = true;

        } );
        reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

        document.body.style.opacity = 1;

    } );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerDown( event ) {

    if ( event.isPrimary === false ) return;

    isUserInteracting = true;

    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    document.addEventListener( 'pointermove', onPointerMove );
    document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    lon = ( onPointerDownMouseX - event.clientX ) * 0.1 + onPointerDownLon;
    lat = ( event.clientY - onPointerDownMouseY ) * 0.1 + onPointerDownLat;

}

function onPointerUp() {

    if ( event.isPrimary === false ) return;

    isUserInteracting = false;

    document.removeEventListener( 'pointermove', onPointerMove );
    document.removeEventListener( 'pointerup', onPointerUp );

}

function onDocumentMouseWheel( event ) {

    const fov = camera.fov + event.deltaY * 0.05;

    camera.fov = THREE.MathUtils.clamp( fov, 10, 75 );

    camera.updateProjectionMatrix();

}

function animate() {

    requestAnimationFrame( animate );
    update();

}

function update() {

    if ( isUserInteracting === false ) {

        lon += 0.03;

    }

    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.MathUtils.degToRad( 90 - lat );
    theta = THREE.MathUtils.degToRad( lon );

    const x = 500 * Math.sin( phi ) * Math.cos( theta );
    const y = 500 * Math.cos( phi );
    const z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( x, y, z );

    renderer.render( scene, camera );

}

export { init, animate, update };