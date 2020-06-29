
export const BASE_UNITS = {
	///////Units Of Length///////
    "m": { "base": "m", "conversion": 1 }, //meter - base unit for distance
    "mm": { "base": "m", "conversion": 0.001 }, //milimeter
    "in": { "base": "m", "conversion": 0.0254 }, //inch
    "ft": { "base": "m", "conversion": 0.3048 }, //foot
    ///////Units Of Area///////
    "m2": { "base": "m2", "conversion": 1 }, //meter square - base unit for area
    "mm2": { "base": "m2", "conversion": 0.000001 }, //milimeter square
    "in2": { "base": "m2", "conversion": 0.00064516 }, //inch
    "ft2": { "base": "m2", "conversion": 0.092903 }, //foot square
    ///////Units Of Volume///////
    "l": { "base": "l", "conversion": 1 }, //litre - base unit for volume
    "dm3": { "base": "l", "conversion": 1 }, //cubic decimeter - litre
    "m3": { "base": "l", "conversion": 1000 }, //meters cubed - kilolitre
    "ft3": { "base": "l", "conversion": 28.316846592 }, //cubic feet
    "in3": { "base": "l", "conversion": 0.016387064 }, //cubic inches
    ///////Units Of Weight///////
    "kg": { "base": "kg", "conversion": 1 }, //kilogram - base unit for weight
    "g": { "base": "kg", "conversion": 0.001 }, //gram
    "mg": { "base": "kg", "conversion": 0.000001 }, //miligram
    // "N": { "base": "kg", "conversion": 1 / 9.80665002863885 }, //Newton (based on earth gravity }
    "st": { "base": "kg", "conversion": 6.35029 }, //stone
    "lb": { "base": "kg", "conversion": 0.453592 }, //pound
    "oz": { "base": "kg", "conversion": 0.0283495 }, //ounce
    ///////Units Of Rotation///////
    "deg": { "base": "deg", "conversion": 1 }, //degrees - base unit for rotation
    "rad": { "base": "deg", "conversion": 57.2958 }, //radian
    ///////Units Of Pressure///////
    "pa": { "base": "Pa", "conversion": 1 }, //Pascal - base unit for Pressure
    "psf": { "base": "Pa", "conversion": 47.8803 }, //pound-force per square foot
    "psi": { "base": "Pa", "conversion": 6894.76 }, //pound-force per square inch

    "N": { "base": "N", "conversion": 1 },
    "lbf": { "base": "N", "conversion": 4.44822 },

    ///////Units Of Power///////
    // Energy is foot-pound, ft-lb
    "j": { "base": "j", "conversion": 1 }, //joule - base unit for energy
    // Moment of a force; torque newton meter (N.m , lb-ft } pound-foot
    "Nm": { "base": "j", "conversion": 1 }, //newton meter Ktt, ktp, kpt, kpp
    "ftlb": { "base": "j", "conversion": 1.35582 }, //foot pound
    "inlb": { "base": "j", "conversion": 0.112985 }, //inch pound
    
    // surface tension
    // Force per unit length (Intensity of force } (N/m , lb/ft }
    "N_m": { "base": "N_m", "conversion": 1 }, //newton meter Kxx, kxz, kzx, kzz
    "lb_ft": { "base": "N_m", "conversion": 14.5939 },
    "lb_in": { "base": "N_m", "conversion": 175.127 },

    // viscosity
    "Ns_m": { "base": "Ns_m", "conversion": 1 }, //newton meter Cxx, Cxz, Czx, Czz
    "lbs_ft": { "base": "Ns_m", "conversion": 0.737562 }, //newton meter Cxx, Cxz, Czx, Czz

    // viscosity
    "Nsm": { "base": "Nsm", "conversion": 1 }, //newton meter Cxx, Cxz, Czx, Czz
    "lbsft": { "base": "Nsm", "conversion": 0.737562 }, //newton meter Cxx, Cxz, Czx, Czz

    ///////Units of Density ///////
    "kg_m3": { "base": "kg_m3", "conversion": 1 }, //base unit for density
    "slug_ft3": { "base": "kg_m3", "conversion": 515.379 }, 

    // moment of inertia kgm2 ,slug-ft2
    "kgm2": { "base": "kgm2", "conversion": 1 }, //base unit for moment of inertia
    "slugft2": { "base": "kgm2", "conversion": 1.35582 }
};