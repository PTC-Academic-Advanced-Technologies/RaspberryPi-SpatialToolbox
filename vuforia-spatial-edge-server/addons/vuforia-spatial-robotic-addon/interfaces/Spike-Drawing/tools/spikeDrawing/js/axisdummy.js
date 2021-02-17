import * as THREE from 'three';

export class AxisDummy extends THREE.Group {
    constructor() {

        super();

        // Robot dummy for Object Target
        const geometrycube = new THREE.BoxGeometry( 20, 20, 20 );
        const materialcube = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        let robotDummy = new THREE.Mesh( geometrycube, materialcube );
        robotDummy.position.set(0,0,0);
        this.add( robotDummy );
        
    }
}
