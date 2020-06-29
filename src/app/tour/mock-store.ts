import { Project } from '../@core/models/shaft';

export const MOCK_PROJECT = {
  projectId: 'uaUAbHcRRv0M5k8pl5xnX',
  userId: '1',
  name: 'Tour Project',
  status: 'ACT',
  machine: {
    machineId: 'HJOal02S817NbwqmM0Pnt',
    projectId: 'uaUAbHcRRv0M5k8pl5xnX',
    ldratio: 2.136190e+0,
    sections: [
      {
        position: 5.000000e+1,
        externalDiameter: 2.500000e+1,
        internalDiameter: 0.000000e+0,
        young: 2.100000e+11,
        poisson: 3.000000e-1,
        density: 7.850000e+3,
        axialForce: 0.000000e+0,
        magneticForce: 0.000000e+0,
        group: 'sections',
        nodeId: 0,
        groupId: 0,
        info: {
          text: 'Section ',
          x: 10,
          y: 10,
          color: 'green'
        },
        area: {
          d: 'M0,-12.5 v25 h50 v-25 Z',
          total: 0
        },
        border: {
          x: 0,
          y: -12.5,
          w: 50,
          h: 25
        },
        ribs: []
      },
      {
        position: 1.500000e+2,
        externalDiameter: 3.500000e+1,
        internalDiameter: 0.000000e+0,
        young: 2.100000e+11,
        poisson: 3.000000e-1,
        density: 7.850000e+3,
        axialForce: 0.000000e+0,
        magneticForce: 0.000000e+0,
        group: 'sections',
        nodeId: 1,
        groupId: 1,
        info: {
          text: 'Section ',
          x: 10,
          y: 10,
          color: 'green'
        },
        area: {
          d: 'M50,-17.5 v35 h100 v-35 Z',
          total: 0
        },
        border: {
          x: 50,
          y: -17.5,
          w: 100,
          h: 35
        },
        ribs: []
      },
      {
        position: 3.000000e+2,
        externalDiameter: 4.500000e+1,
        internalDiameter: 0.000000e+0,
        young: 2.100000e+11,
        poisson: 3.000000e-1,
        density: 7.850000e+3,
        axialForce: 0.000000e+0,
        magneticForce: 0.000000e+0,
        group: 'sections',
        nodeId: 2,
        groupId: 2,
        info: {
          text: 'Section ',
          x: 10,
          y: 10,
          color: 'green'
        },
        area: {
          d: 'M150,-22.5 v45 h150 v-45 Z',
          total: 0
        },
        border: {
          x: 150,
          y: -22.5,
          w: 150,
          h: 45
        },
        ribs: [{
          position: 3.000000e+3,
          number: 6.000000e+0,
          webThickness: 6.000000e+0,
          webDepth: 6.000000e+1,
          flangeWidth: 3.000000e+1,
          flangeThick: 4.000000e+0,
          group: 'ribs',
          nodeId: 5,
          groupId: 0,
          info: {
            text: 'Rib ',
            x: 10,
            y: 10,
            color: 'yellow'
          },
          area: {
            d: 'M2980,-40 l20,-24 l20,24 Z',
            total: 0
          },
          border: {
            x: 2990,
            y: -40,
            w: 20,
            h: 20
          }
        }]
      },
      {
        position: 4.000000e+2,
        externalDiameter: 3.500000e+1,
        internalDiameter: 0.000000e+0,
        young: 2.100000e+11,
        poisson: 3.000000e-1,
        density: 7.850000e+3,
        axialForce: 0.000000e+0,
        magneticForce: 0.000000e+0,
        group: 'sections',
        nodeId: 3,
        groupId: 3,
        info: {
          text: 'Section ',
          x: 10,
          y: 10,
          color: 'green'
        },
        area: {
          d: 'M300,-17.5 v35 h100 v-35 Z',
          total: 0
        },
        border: {
          x: 300,
          y: -17.5,
          w: 100,
          h: 35
        },
        ribs: []
      },
      {
        position: 4.500000e+2,
        externalDiameter: 2.500000e+1,
        internalDiameter: 0.000000e+0,
        young: 2.100000e+11,
        poisson: 3.000000e-1,
        density: 7.850000e+3,
        axialForce: 0.000000e+0,
        magneticForce: 0.000000e+0,
        group: 'sections',
        nodeId: 4,
        groupId: 4,
        info: {
          text: 'Section ',
          x: 10,
          y: 10,
          color: 'green'
        },
        area: {
          d: 'M400,-12.5 v25 h50 v-25 Z',
          total: 0
        },
        border: {
          x: 400,
          y: -12.5,
          w: 50,
          h: 25
        },
        ribs: []
      }
    ],
    discs: [
      {
        materialId: '2',
        position: 3.000000e+2,
        externalDiameter: 3.500000e+2,
        internalDiameter: 1.700000e+2,
        thickness: 2.000000e+1,
        density: 7.850000e+3,
        ix: 0.000000e+0,
        iy: 0.000000e+0,
        iz: 0.000000e+0,
        length: 0.000000e+0,
        mass: 0.000000e+0,
        group: 'discs',
        nodeId: 6,
        groupId: 0,
        info: {
          text: 'Disc ',
          x: 10,
          y: 10,
          color: 'blue'
        },
        area: {
          d: 'M290,-175 v350 h20 v-350 Z',
          total: 0
        },
        border: {
          x: 290,
          y: -175,
          w: 20,
          h: 350
        }
      }
    ],
    rollerbearings: [
      {
        position: 0.000000e+0,
        mass: 5.000000e-1,
        inertia: 0.000000e+0,
        kxx: 1.000000e+7,
        kxz: 0.000000e+0,
        kzx: 0.000000e+0,
        kzz: 1.000000e+7,
        cxx: 6.000000e+2,
        cxz: 0.000000e+0,
        czx: 0.000000e+0,
        czz: 6.000000e+2,
        ktt: 0.000000e+0,
        ktp: 0.000000e+0,
        kpp: 0.000000e+0,
        kpt: 0.000000e+0,
        ctt: 0.000000e+0,
        ctp: 0.000000e+0,
        cpp: 0.000000e+0,
        cpt: 0.000000e+0,
        group: 'rollerbearings',
        nodeId: 7,
        groupId: 0,
        info: {
          text: 'RollerBearing ',
          x: 10,
          y: 10,
          color: 'red'
        },
        area: {
          d: 'M-20,-45 l20,24 l20,-24 Z',
          total: 0
        },
        border: {
          x: -10,
          y: -45,
          w: 20,
          h: 20
        }
      },
      {
        position: 4.500000e+2,
        mass: 5.000000e-1,
        inertia: 0.000000e+0,
        kxx: 1.000000e+7,
        kxz: 0.000000e+0,
        kzx: 0.000000e+0,
        kzz: 1.000000e+7,
        cxx: 6.000000e+2,
        cxz: 0.000000e+0,
        czx: 0.000000e+0,
        czz: 6.000000e+2,
        ktt: 0.000000e+0,
        ktp: 0.000000e+0,
        kpp: 0.000000e+0,
        kpt: 0.000000e+0,
        ctt: 0.000000e+0,
        ctp: 0.000000e+0,
        cpp: 0.000000e+0,
        cpt: 0.000000e+0,
        group: 'rollerbearings',
        nodeId: 8,
        groupId: 1,
        info: {
          text: 'RollerBearing ',
          x: 10,
          y: 10,
          color: 'red'
        },
        area: {
          d: 'M430,-45 l20,24 l20,-24 Z',
          total: 0
        },
        border: {
          x: 440,
          y: -45,
          w: 20,
          h: 20
        }
      }
    ],
    journalbearings: [],
    ves: [],
    abs: [],
    foundations: [
      {
        position: 0.000000e+0,
        kxx: 1.000000e+7,
        kzz: 1.000000e+7,
        cxx: 0.000000e+0,
        czz: 0.000000e+0,
        mass: 2.000000e+0,
        group: 'foundations',
        nodeId: 9,
        groupId: 0,
        info: {
          text: 'Foundation ',
          x: 10,
          y: 10,
          color: 'maroon'
        },
        area: {
          d: 'M-20,-74 l20,24 l20,-24 Z',
          total: 0
        },
        border: {
          x: -10,
          y: -74,
          w: 20,
          h: 20
        }
      },
      {
        position: 4.500000e+2,
        kxx: 1.000000e+7,
        kzz: 1.000000e+7,
        cxx: 0.000000e+0,
        czz: 0.000000e+0,
        mass: 2.000000e+0,
        group: 'foundations',
        nodeId: 10,
        groupId: 1,
        info: {
          text: 'Foundation ',
          x: 10,
          y: 10,
          color: 'maroon'
        },
        area: {
          d: 'M430,-74 l20,24 l20,-24 Z',
          total: 0
        },
        border: {
          x: 440,
          y: -74,
          w: 20,
          h: 20
        }
      }
    ]
  },
  projectsetting: {
    id: 8,
    projectId: 'uaUAbHcRRv0M5k8pl5xnX',
    systemoptions: {
      rollerbearing: true,
      journalbearing: false,
      foundation: true,
      ves: false,
      abs: false
    },
    resultoptions: {
      staticLine: true,
      fatigue: false,
      campbell: true,
      modes: true,
      criticalMap: false,
      unbalanceResponse: true,
      constantResponse: true,
      timeResponse: true,
      torsional: true,
      balanceOptimization: false,
      vesOptimization: false,
      absOptimization: false
    },
    resultcampbell: [
      {
        initialSpin: 2.000000e+2,
        finalSpin: 2.500000e+4,
        steps: 3.000000e+2,
        frequencies: 8.000000e+0
      }
    ],
    resultstiffness: [],
    resultmodes: [
      {
        maxFrequency: 1.500000e+5,
        modes: 6.000000e+0
      }
    ],
    resultconstant: [
      {
        initialFrequency: 1.000000e+0,
        finalFrequency: 5.000000e+2,
        steps: 5.000000e+2,
        modes: 2.000000e+1,
        speed: 3.000000e+3,
        responses: [
          {
            position: 3.000000e-1,
            coord: 1.000000e+0
          }
        ],
        forces: [
          {
            position: 3.000000e-1,
            coord: 1.000000e+0,
            force: 1.000000e+1
          }
        ]
      }
    ],
    resultunbalance: [
      {
        initialSpin: 1.000000e+3,
        finalSpin: 3.000000e+4,
        steps: 3.500000e+2,
        modes: 2.000000e+1,
        responses: [
          {
            position: 2.500000e-1,
            coord: 1.000000e+0
          }
        ],
        phases: [
          {
            position: 2.500000e-1,
            unbalance: 5.000000e-5,
            phase: 1.000000e+0
          }
        ]
      }
    ],
    resulttorsional: [
      {
        initialFrequency: 1.000000e+0,
        finalFrequency: 5.000000e+2,
        steps: 5.000000e+2,
        modes: 2.000000e+1,
        responses: [
          {
            position: 3.000000e-1,
            coord: 0.000000e+0
          }
        ],
        phases: [
          {
            position: 3.000000e-1,
            tork: 6.000000e+1,
            phase: 1.000000e+1
          }
        ]
      }
    ],
    resulttime: []
  }  
};