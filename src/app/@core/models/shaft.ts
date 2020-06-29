
export class Machine {
    machineId: string;
    projectId: string;
    ldratio: number;
    sections: Sections[];
    discs: Discs[];
    rollerbearings: RollerBearings[];
    journalbearings: JournalBearings[];
    foundations: Foundations[];
    ves: VES[];
    abs: ABS[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    public static Create(values): Machine {
        let last = 0;
        for(let i = 0; i < values.sections.length; i++) {
            let sec = new Sections(<Sections>values.sections[i], last);
            last = sec.position;
            values.sections[i] = sec;
        }
        for(let i = 0; i < values.discs.length; i++) {
            let sec = new Discs(<Discs>values.discs[i], values.sections);
            values.discs[i] = sec;
        }
        for(let i = 0; i < values.rollerbearings.length; i++) {
            let sec = new RollerBearings(<RollerBearings>values.rollerbearings[i], values.sections);
            values.rollerbearings[i] = sec;
        }
        for(let i = 0; i < values.journalbearings.length; i++) {
            let sec = new JournalBearings(<JournalBearings>values.journalbearings[i], values.sections);
            values.journalbearings[i] = sec;
        }
        for(let i = 0; i < values.ves.length; i++) {
            let sec = new VES(<VES>values.ves[i], values.sections);
            values.ves[i] = sec;
        }
        for(let i = 0; i < values.abs.length; i++) {
            let sec = new ABS(<ABS>values.abs[i], values.sections);
            values.abs[i] = sec;
        }
        for(let i = 0; i < values.foundations.length; i++) {
            let sec = new Foundations(<Foundations>values.foundations[i], values.sections);
            values.foundations[i] = sec;
        }
        return new Machine(values);
    }
}

export class UIElement {
    nodeId: number;
    groupId: number;
    group: string;
    info: NodeInfo;
    area: NodeArea;
    border: NodeBorder;
    constructor() {}
}

export class Sections extends UIElement {
    position: number;
    externalDiameter: number;
    internalDiameter: number;
    young: number;
    poisson: number;
    density: number;
    axialForce: number;
    magneticForce: number;
    ribs: Ribs[];

    constructor(values: Object = {}, last = 0) {
        super();
        Object.assign(this, values);
        let length = this.position-last;
        let x = +last;
        let d = +this.externalDiameter;
        let y = -d/2;
        this.group = 'sections';
        this.info = <NodeInfo>{ text: "Section ", x: 10, y:10, color: 'green' };
        this.area = <NodeArea>{ d: `M${x},${y} v${d} h${length} v${-d} Z` };
        this.border = <NodeBorder>{ x: x, y: y, w: length, h: d };

        if (values['ribs']) {
            for(let i = 0; i < values['ribs'].length; i++) {
                this.ribs[i] = new Ribs(<Ribs>values['ribs'][i], this, length);
            }
        }
    }
}

export class Ribs extends UIElement {
    position: number;
    number: number;
    webThickness: number;
    webDepth: number;
    flangeWidth: number;
    flangeThick: number;

    constructor(values: Object = {}, section: Sections = null, length = 0) {
        super();
        Object.assign(this, values);
        this.position = section.position;

        let x = this.position - length;
        let d = +this.webDepth;
        let secd = section.externalDiameter/2 + 2;
        let y = d;

        let df = +this.flangeThick;

        this.group = "ribs";
        this.info = <NodeInfo>{ text: "Rib ", x: 10, y:10, color: 'yellow' };
        // this.area = <NodeArea>{ d: `M${x},${y} v${-(y+secd)} h${length} v${(y+secd)} Z M ${x},${secd} v${-(y+secd)} h${length} v${(y+secd)} Z` };
        this.area = <NodeArea>{ d: `M${x},${-(y+secd)} v${-df} h${length} v${df} Z v${d} h${length} v${-d} Z M${x},${(y+secd)} v${df} h${length} v${-df} Z v${-d} h${length} v${d} Z` };
        // M10,-40 l0,30 l100,0 l0-30 Z l0,-50 l100,0 l0,50 Z
        this.border = <NodeBorder>{ x: x, y: y, w: length, h: d };
    }
}

// Discs and Inertias
export class Discs extends UIElement {
    position: number;
    externalDiameter: number;
    internalDiameter: number;
    density: number;
    thickness: number;
    mass: number;
    length: number;
    ix: number;
    iy: number;
    iz: number;

    constructor(values: Object = {}, sections: Sections[] = []) {
        super();
        Object.assign(this, values);
        let length = +this.thickness
        let d = +this.externalDiameter;
        
        // internalDiameter
        let di = +this.internalDiameter;

        let col = 'blue';
        if (+this.thickness == 0 || +this.externalDiameter == 0) {
            let section = sections.find(x => x.position >= this.position);
            di = (section ? +section.externalDiameter : 25);

            col = "cyan";
            d = Math.sqrt(2*(+this.iy)/(+this.mass)-Math.pow(di/1000, 2))*1000;
            length = +this.length;
        }

        let x = this.position-length/2;
        let y = -d/2;

        let secd = di/2 + 2;
        this.group = 'discs';
        this.info = <NodeInfo>{ text: "Disc ", x: 10, y:10, color: col };
        // this.area = <NodeArea>{ d: `M${x},${y} v${d} h${length} v${-d} Z` };
        this.area = <NodeArea>{ d: `M${x},${y} v${-(y+secd)} h${length} v${(y+secd)} Z M ${x},${secd} v${-(y+secd)} h${length} v${(y+secd)} Z` };

        // "M10,-150 v135.5 h80 v-135.5 Z M 10,14.5 v135.5 h80 v-135.5 Z"
        this.border = <NodeBorder>{ x: x, y: y, w: length, h: d };
    }
}

export class RollerBearings extends UIElement {
    position: number;
    inertia: number;
    mass: number;
    kxx: number;
    kxz: number;
    kzz: number;
    kzx: number;
    cxx: number;
    cxz: number;
    czz: number;
    czx: number;
    ktt: number;
    ktp: number;
    kpp: number;
    kpt: number;
    ctt: number;
    ctp: number;
    cpp: number;
    cpt: number;

    constructor(values: Object = {}, sections: Sections[] = []) {
        super();
        Object.assign(this, values);

        let section = sections.find(x => x.position >= this.position);
        let len = sections[sections.length-1]['position'];
        let factor = len / 1150;
        let t1 = 20 * factor;
        let t2 = 24 * factor;
        let x = this.position-(10*factor);
        let y = (-26*factor)-(section ? section.externalDiameter/2 : (26*factor));

        this.group = "rollerbearings";
        this.info = <NodeInfo>{ text: "RollerBearing ", x: 10, y:10, color: 'red' };
        // this.area = <NodeArea>{ d: `M${x-10},${y} l${t1},${t2} l${t1},${-t2} Z M${x-10},${-y} l${t1},${-t2} l${t1},${t2} Z` };
        this.area = <NodeArea>{ d: `M${x-10*factor},${y} l${t1},${t2} l${t1},${-t2} Z M${x-10*factor},${-y} l${t1},${-t2} l${t1},${t2} Z` };
        this.border = <NodeBorder>{ x: x, y: y, w: t1, h: t1 };
    }
}

export class JournalRotations {
    speed: number;
    kxx: number;
    kxz: number;
    kzz: number;
    kzx: number;
    cxx: number;
    cxz: number;
    czz: number;
    czx: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class JournalOptimization {
    initialSpin: number;
    finalSpin: number;
    steps: number;
    status: string;
    viscosity: number;
    diameter: number;
    length: number;
    radio: number;
    load?: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class JournalBearings extends UIElement {
    position: number;
    mode: number; // 1 direct; 2 optimization
    rotations?: JournalRotations[];
    optimization?: JournalOptimization[];

    constructor(values: Object = {}, sections: Sections[] = []) {
        super();
        Object.assign(this, values);

        let section = sections.find(x => x.position >= this.position);
        let len = sections[sections.length-1]['position'];
        let factor = len / 1150;
        let t1 = 20 * factor;
        let t2 = 24 * factor;
        let x = this.position-(10*factor);
        let y = (-26*factor)-(section ? section.externalDiameter/2 : (26*factor));

        this.group = "journalbearings";
        this.info = <NodeInfo>{ text: "JournalBearing ", x: 10, y:10, color: 'orange' };
        this.area = <NodeArea>{ d: `M${x-10*factor},${y} l${t1},${t2} l${t1},${-t2} Z M${x-10*factor},${-y} l${t1},${-t2} l${t1},${t2} Z` };
        this.border = <NodeBorder>{ x: x, y: y, w: t1, h: t1 };
    }
}

export class SheetMaterials {
    go: number;
    goo: number;
    beta: number;
    b1: number;
    theta1: number;
    theta2: number;
    temperature: number;
    temperatureRef: number;
}

export class SheetRotations {
    thickness: number;
    meanRadius: number;
    radius: number;
    inertia?: number;
}

export class SheetTranslations {
    segments: number;
    thickness: number;
    diameter: number;
    mass?: number;
}

export class Sheet {
    sheetId: string;
    vesId: string;
    simple: boolean;
    single: boolean;
    type: string;
    mass: number;
    inertia: number;

    materials: SheetMaterials[];
    rotations: SheetRotations[];
    translations: SheetTranslations[];
}

export class VES extends UIElement {
    // vesId: string;
    // machineId: string;
    position: number;

    sheet: Sheet;   
    rollerbearings: RollerBearings[];

    constructor(values: Object = {}, sections: Sections[] = []) {
        super();
        Object.assign(this, values);

        let section = sections.find(x => x.position >= this.position);
        let y = -26-(section ? section.externalDiameter/2 : 26);
        let x = this.position-10;

        this.group = "ves";
        this.info = <NodeInfo>{ text: "VES ", x: 10, y:10, color: 'purple' },
        this.area = <NodeArea>{ d: `M${x-10},${y} l20,24 l20,-24 Z M${x-10},${-y} l20,-24 l20,24 Z` };
        this.border = <NodeBorder>{ x: x, y: y, w: 20, h: 20 };
    }
}

export class ABS extends UIElement {
    position: number;
    
    sheet: Sheet;
    // absrollerBearings: ABSRollerBearings[];

    constructor(values: Object = {}, sections: Sections[] = []) {
        super();
        Object.assign(this, values);
        let x = this.position-10;
        let section = sections.find(x => x.position >= this.position);
        let y = -26-(section ? section.externalDiameter/2 : 26);
        this.group = "abs";
        this.info = <NodeInfo>{ text: "ABS ", x: 10, y:10, color: 'pink' },
        this.area = <NodeArea>{ d: `M${x-10},${y} l20,24 l20,-24 Z M${x-10},${-y} l20,-24 l20,24 Z` };
        this.border = <NodeBorder>{ x: x, y: y, w: 20, h: 20 };
    }
}

export class Foundations extends UIElement {
    position: number;
    kxx: number;
    kzz: number;
    cxx: number;
    czz: number;
    mass: number;

    constructor(values: Object = {}, sections: Sections[] = []) {
        super();
        Object.assign(this, values);
        
        let section = sections.find(x => x.position >= this.position);
        let len = sections[sections.length-1]['position'];
        let factor = len / 1150;
        let t1 = 20* factor;
        let t2 = 24* factor;
        let x = this.position-(10*factor);
        let y = (-26*factor)-(section ? section.externalDiameter/2 : (26*factor))-(26*factor);

        this.group = "foundations";
        this.info = <NodeInfo>{ text: "Foundation ", x: 10, y:10, color: 'maroon' };
        this.area = <NodeArea>{ d: `M${x-10*factor},${y} l${t1},${t2} l${t1},${-t2} Z M${x-10*factor},${-y} l${t1},${-t2} l${t1},${t2} Z` };
        this.border = <NodeBorder>{ x: x, y: y, w: t1, h: t1 };
    }
}

export interface ResultCampbell {
    initialSpin: number;
    finalSpin: number;
    steps: number;
    frequencies: number;
}

export interface ResultStiffness {
    initialStiffness: number;
    initialSpeed: number;
    finalSpeed: number;
    decades: number;
    frequencies: number;
}

export interface ResultModes {
    modes: number;
    maxFrequency: number;
}

export interface ResultResponseModel {
    position: number;
    coord: number;
}

export interface ResultForceModel {
    position: number;
    coord: number;
    force: number;
}

export interface ResultPhaseModel {
    position: number;
    unbalance: number;
    phase: number;
}

export interface ResultTorkPhaseModel {
    position: number;
    tork: number;
    phase: number;
}

export interface ResultConstant {
    initialFrequency: number;
    finalFrequency: number;
    modes: number;
    steps: number;
    speed: number;
    responses: ResultResponseModel[];
    forces: ResultForceModel[];
}

export interface ResultUnbalance {
    initialSpin: number;
    finalSpin: number;
    modes: number;
    steps: number;
    responses: ResultResponseModel[];
    phases: ResultPhaseModel[];
}

export interface ResultTorsional {
    initialFrequency: number;
    finalFrequency: number;
    modes: number;
    steps: number;
    responses: ResultResponseModel[];
    phases: ResultTorkPhaseModel[];
}

export interface ResultTime {
    initialSpin: number;
    finalSpin: number;
    modes: number;
    steps: number;
    phases: ResultPhaseModel[];
}

export class Material {
    materialId: string;
    name: string;
    young: string;
    poisson: string;
    density: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Project {
    projectId: string;
    userId: string;
    name: string;
    status: string;

    machine: Machine;
    projectsetting: ProjectSetting;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    public static Create(values:Project): Project {
        values.machine = Machine.Create(values.machine);
        return new Project(values);
    }
}

export interface DisplaySetting {
    label: string;
    value: string;
    iconClass: string;
    type: string;
    selected: boolean;
}


export class ProjectSetting {
    id:number;
    projectId:string;
    systemoptions: SystemOptions;
    resultoptions: ResultOptions;

    resultcampbell: ResultCampbell[];
    resultstiffness: ResultStiffness[];
    resultmodes: ResultModes[];
    resultconstant: ResultConstant[];
    resultunbalance: ResultUnbalance[];
    resulttorsional: ResultTorsional[];
    resulttime: ResultTime[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    public static Create(values, settings_separated=true): ProjectSetting {
        
        for(let i = 0; i < values.resultcampbell.length; i++) {
            let sec = <ResultCampbell>values.resultcampbell[i];
            values.resultcampbell[i] = sec;
        }
        for(let i = 0; i < values.resultstiffness.length; i++) {
            let sec = <ResultStiffness>values.resultstiffness[i];
            values.resultstiffness[i] = sec;
        }
        for(let i = 0; i < values.resultmodes.length; i++) {
            let sec = <ResultModes>values.resultmodes[i];
            values.resultmodes[i] = sec;
        }
        for(let i = 0; i < values.resultconstant.length; i++) {
            let sec = <ResultConstant>values.resultconstant[i];
            values.resultconstant[i] = sec;
        }
        for(let i = 0; i < values.resultunbalance.length; i++) {
            let sec = <ResultUnbalance>values.resultunbalance[i];
            values.resultunbalance[i] = sec;
        }
        for(let i = 0; i < values.resulttorsional.length; i++) {
            let sec = <ResultTorsional>values.resulttorsional[i];
            values.resulttorsional[i] = sec;
        }
        for(let i = 0; i < values.resulttime.length; i++) {
            let sec = <ResultTime>values.resulttime[i];
            values.resulttime[i] = sec;
        }

        if(settings_separated) {
            values.systemoptions = new SystemOptions(values.systemoptions);
            values.resultoptions = new ResultOptions(values.resultoptions);
        } else {
            values.systemoptions = new SystemOptions(values.settings.settings);
            values.resultoptions = new ResultOptions(values.settings.results);
        }

        return new ProjectSetting(values);
    }
}

export class SystemOptions {
    rollerbearing: boolean;
    journalbearing: boolean;
    foundation: boolean;
    ves: boolean;
    abs: boolean;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class ResultOptions {
    staticLine: boolean;
    fatigue: boolean;
    campbell: boolean;
    modes: boolean;
    criticalMap: boolean;
    unbalanceResponse: boolean;
    constantResponse: boolean;
    timeResponse: boolean;
    torsional: boolean;
    balanceOptimization: boolean;
    vesOptimization: boolean;
    absOptimization: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export interface MachineError {
    code: number;
    name: string;
    message: string;
    projectId?: string;
    url?: string;
}

export interface NodeInfo {
    text: string;
    color: string;
    x: number;
    y: number;
}

export interface NodeArea {
    d: string;
    total: number;
}

export interface NodeBorder {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Nodes {
    id: number;
    groupId: number;
    group: string;
    name: NodeInfo;
    area: NodeArea;
    border: NodeBorder;
}