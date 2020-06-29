import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';

import { Project, Machine, Sections, Ribs, Discs, RollerBearings, JournalBearings, Foundations, VES, ABS } from '../../../@core/models/shaft';
import { UIElement, Nodes, NodeInfo, NodeArea, NodeBorder } from '../../../@core/models/shaft';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';

interface ProjectSvg {
  rects: UIElement[],
  paths: UIElement[],
  halters: UIElement[],
  /*supports: UIElement[],
  fundations: UIElement[],
  elements: UIElement[]*/
}

interface Point {
  x: number;
  y: number;
}

interface GridSize {
  path: string;
  bw: number;
  bh: number;
  spath: string;
  sw: number;
  sh: number;
}

@Component({
  selector: 'twoviewer',
  templateUrl: './twoviewer.component.html',
  styleUrls: ['./twoviewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoViewerComponent implements OnInit {
  // @ViewChild('mouse') mouse: ElementRef;
  _project: Project;
  _originalName: string;

  @Input()
  set model(value: Project) {
    if(value) this._originalName = value.name;
    this._project = Object.assign({}, value);
    this.onChange();
  }

  // @Output() saved = new EventEmitter();
  // @Output() cancelled = new EventEmitter();
  @Output() select: EventEmitter<UIElement> = new EventEmitter();

  selectedNode: null;
  sortedNodes = [];

  isIE = !!(navigator.userAgent.match(/Trident/)
         || navigator.userAgent.match(/MSIE/)
         || navigator.userAgent.match(/Edge/));
  isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;

  initialized: boolean = false;

  nodeId = 0;
  nodeSvg: ProjectSvg;

  length = 0;
  numSections = 0;
  posY: any = [];
  xaxis:any = [];

  ratio = 1;

  center: Point = {x:0, y:0};
  size: Point = {x:621, y:421};
  half: Point = {x:320, y:220};

  relSize: Point = {x:621, y:421};
  relHalf: Point = {x:320, y:220};

  currentMax: Point = {x:0,y:0};

  viewBox = '0 0 621 421'; // 640x440
  viewX = -300;
  viewY = 0;

  /*mouseX = 0;
  mouseY = 0;*/

  svg: any;

  grid: GridSize = {
    path:"M 50 0 L 0 0 M 20 0 L 20 50",
    bw:50,
    bh:50,
    sw:10,
    sh:10,
    spath: "M 10 0 L 0 0 0 10"
  };

  constructor(elementRef: ElementRef) {
    this.newObject();
    this.svg = elementRef;
    
  }

  ngOnInit() {
    // let el = document.body.querySelector('svg');
    let el = this.svg.nativeElement;
    // console.log(this.mouse);
    /*Observable.fromEvent(el, 'mousemove').subscribe(e => {
      let pt = { x: 0, y:0 };
      // pt.x = e.clientX;
      // pt.y = e.clientY;
      // this.mouseX = e.pageX;
      // this.mouseY = e.pageY;
      // console.log(pt);
    });*/
  }

  onChange() {
    if(!this._project)
      return;

    let model = this._project.machine;
    // console.log(model);
    this.calc_aux(model);
    this.initialized = true;

    if(model.sections) {
      this.addSession(model.sections);
    }

    if(model.discs) {
      this.addDisc(model.discs);
    }

    if(model.rollerbearings) {
      this.addBearing(model.rollerbearings, model.sections);
    }

    if(model.journalbearings) {
      this.addJournal(model.journalbearings, model.sections);
    }

    if(model.foundations) {
      this.addFoundations(model.foundations);
    }

    if(model.ves) {
      this.addVes(model.ves);
    }

    this.checkResults();

    this.sortNodes();
  }

  checkResults() {
    let model = this._project.projectsetting;

    if(model.resultconstant) {
      this.addConstant(model.resultconstant);
    }

    if(model.resultunbalance) {
      this.addUnbalance(model.resultunbalance);
    }

    if(model.resulttorsional) {
      this.addTorsional(model.resulttorsional);
    }
  }

  addConstant(data) {
    let count = 0;
    for(let cte of data) {
      for(let force of cte.forces) {
        if (+cte.steps == 0) {
          return;
        }

        // console.log('adding unbalance ... ');
        force['nodeId'] = this.nodeId;
        force['group'] = "constant";
        force['groupId'] = count++;
        force['info'] = <NodeInfo>{ text: "Constant ", x: force.force, y:10, color: 'pink' };

        let factor = this.length / 1150;
        let dx = 5*factor;
        let dy = 200*factor;
        let l1 = 5*factor;
        let x = force.position;
        let y = 0

        force['area'] = <NodeArea>{ d: `M${x},${-dy} l${-dx},${dx} l${dx},${dx} l${dx},${-dx} l${-dx},${-dx} l0,${dy*2} l${dx},${-dx} l${-dx},${-dx} l${-dx},${dx} l${dx},${dx} Z` };
        force['border'] = <NodeBorder>{ x: x-dx/2, y: y-dy, w: dx, h: dy*2 };

        this.nodeId++;
        this.nodeSvg.halters.push(force);
      }
    }
  }

  addUnbalance(data) {
    let count = 0;
    for(let unb of data) {
      for(let phase of unb.phases) {
        if (+unb.steps == 0) {
          return;
        }

        // console.log('adding unbalance ... ');
        phase['nodeId'] = this.nodeId;
        phase['group'] = "unbalance";
        phase['groupId'] = count++;
        phase['info'] = <NodeInfo>{ text: "Unbalance ", x: phase.unbalance, y:10, color: 'orange' };
        let factor = this.length / 1150;
        let dx = 5*factor;
        let dy = 200*factor;
        let l1 = 5*factor;
        let x = phase.position;
        let y = 0

        phase['area'] = <NodeArea>{ d: `M${x},${-dy} l${-dx},${dx} l${dx},${dx} l${dx},${-dx} l${-dx},${-dx} l0,${dy*2} l${dx},${-dx} l${-dx},${-dx} l${-dx},${dx} l${dx},${dx} Z` };
        phase['border'] = <NodeBorder>{ x: x-dx/2, y: y-dy, w: dx, h: dy*2 };

        this.nodeId++;
        this.nodeSvg.halters.push(phase);
      }
    }
  }

  addTorsional(data) {
    let count = 0;
    for(let tor of data) {
      for(let phase of tor.phases) {
        if (+tor.steps == 0) {
          return;
        }

        // console.log('adding torsional ... ');
        phase['nodeId'] = this.nodeId;
        phase['group'] = "torsional";
        phase['groupId'] = count++;
        phase['info'] = <NodeInfo>{ text: "Torsional ", x: phase.tork, y:10, color: 'aqua' };
        let factor = this.length / 1150;
        let dx = 5*factor;
        let dy = 200*factor;
        let l1 = 5*factor;
        let x = phase.position;
        let y = 0

        phase['area'] = <NodeArea>{ d: `M${x},${-dy} l${-dx},${dx} l${dx},${dx} l${dx},${-dx} l${-dx},${-dx} l0,${dy*2} l${dx},${-dx} l${-dx},${-dx} l${-dx},${dx} l${dx},${dx} Z` };
        phase['border'] = <NodeBorder>{ x: x-dx/2, y: y-dy, w: dx, h: dy*2 };
        this.nodeId++;
        this.nodeSvg.halters.push(phase);
      }
    }
  }

  calc_aux(model: Machine) {

    this.numSections = model.sections.length;
    this.posY = [0,0]
    if(this.numSections <= 0)
      return;

    let ldRatio = +model.ldratio;

    let sessionPositions = model.sections.map((item) => {
      return +item.position;
    });
    let sessionDiameters = model.sections.map((item) => {
      return +item.externalDiameter;
    });

    let discPositions = model.discs.map((item) => {
      return +item.position;
    });
    let discDiameters = model.discs.map((item) => {
      return +item.externalDiameter;
    });

    let rollerPositions = model.rollerbearings.map((item) => {
      return +item.position;
    });

    let journalPositions = model.journalbearings.map((item) => {
      return +item.position;
    });

    let settings = this._project.projectsetting;

    let cte = settings.resultconstant.map((ct) => {
      return ct.forces.map((c) => {
        return +c.position;
      })
    });
    cte = [].concat(...cte);

    let unb = settings.resultunbalance.map((un) => {
      return un.phases.map((u) => {
        return +u.position;
      })
    });
    unb = [].concat(...unb);

    let tor = settings.resulttorsional.map((tr) => {
      return tr.phases.map((t) => {
        return +t.position;
      })
    });
    tor = [].concat(...tor);

    let sup = [].concat([...sessionPositions, ...discPositions, ...rollerPositions, ...journalPositions, ...cte, ...unb, ...tor]);
    sup = sup.sort((n1,n2) => n1 - n2);

    let pp = sup.filter((elem,pos,arr) => {
      return (pos == arr.indexOf(elem));
    });

    let p = pp.filter((item, idx, arr) => {
      if(Math.abs(item - arr[idx+1]) > 0.001)
        return item;
    });

    // p = [p, ...pp[pp.length - 1]];
    p.push(pp[pp.length - 1]);

    if (+p[0] != 0)
      p = [0, ...p];

    /* CALCULATE HEIGHT & WIDTH */
    this.length = +model.sections[this.numSections-1].position;
    let diams = [...sessionDiameters, ...discDiameters];
    let h = Math.max(...diams);

    // this.setMax({x:this.length, y: h});
    this.setRatio({x:this.length, y: h});
    this.grid.bw = this.uRel(50);
    this.grid.bh = this.uRel(50);
    this.grid.path = `M${this.uRel(50)} 0 L 0 0 M 20 0 L 20 ${this.uRel(50)}`;
    this.grid.sw = this.uRel(10);
    this.grid.sh = this.uRel(10);
    let sfix = this.grid.sw;
    if(this.ratio > 1)
      sfix = 20-this.grid.sw;
    this.grid.spath = `M${this.uRel(10)} 0 L 0 0 M ${sfix} 0 L ${sfix} ${this.uRel(10)}`;
    /* ./CALCULATE HEIGHT & WIDTH */

    let diameters = [];
    let c = 0;
    let s1 = sessionDiameters[0];
    for(let j = 0; j < p.length - 1; j++) {
        if (p[j] == sessionPositions[c]) {
          c++;
          s1 = sessionDiameters[c];
        }
        
        diameters.push(s1);
    }

    let n = []
    let dely = []

    for(let i = 0; i < p.length - 1; i++) {
      let c = 1;
      let s1 = 50;
      n.push(0);
      dely.push(0);
      while(s1 > ldRatio || c > 50) {
        n[i] = c;
        dely[i] = +(p[i+1] - p[i]) / c;
        s1 = dely[i] / diameters[i];
        c++;
      }
    }

    this.posY = [0];
    for(let i = 0; i < p.length - 1; i++) {
      let lin = this.linspace(p[i]+dely[i], p[i+1],  n[i], true);
      this.posY = [...this.posY, ...lin];
    }
    // console.log(this.posY);

    let last = this.posY[this.posY.length - 1];
    // this.posY.push(last);
    this.length = last;
  }

  newObject() {
    this.nodeSvg = {
      rects: [],
      paths: [],
      halters: [],
    };
    this.nodeId = 0;
  }

  setRatio(p: Point) {
    // p length, height
    this.currentMax = p;

    // 600
    let totalWidth = this.size.x - 40;
    let totalHeight = this.size.y - 40;

    this.ratio = (totalWidth / this.length);
    // console.log('ratio', this.ratio);
  }

  uRel(unit) {
    return this.ratio * unit;
  }

  cRel(rel) {
    return rel / this.ratio;
  }

  setMax(p: Point) {
    this.currentMax = p;

    let ratio = this.size.x / this.size.y;

    // let height = (this.size.y / this.size.x) * desiredWidth
    let desiredWidth = this.currentMax.x + 80;
    let desiredHeight = desiredWidth/ratio;

    if(desiredHeight < this.currentMax.y + 80) {
      desiredHeight = this.currentMax.y + 80;
      desiredWidth = desiredHeight*ratio;
    }

    let val = [(-desiredWidth/2), (-desiredHeight/2), desiredWidth, desiredHeight];
    this.viewBox = val.join(' ');
    this.viewX = ((-desiredWidth/2)+40);
    this.viewY = 0;
    this.size = {x:desiredWidth,y:desiredHeight};
    this.half = {x:desiredWidth/2,y:desiredHeight/2};
  }

  addSession(sections: Array<Sections>) {
    this.newObject();

    let count = 0;
    let rcount = 0;
    for(let section of sections) {
      if (+section.position == 0)
        return;

      // console.log('adding section ... ');
      section.nodeId = this.nodeId;
      section.group = "sections";
      section.groupId = count++;
      this.nodeId++;
      this.nodeSvg.rects.push(section);

      if(section.ribs && section.ribs.length > 0)
        this.addRibs(section, rcount++);
    }
  }

  addRibs(sec: Sections, count) {
    // ribs
    let ribs: Ribs = sec.ribs[0];
    if (+ribs.number == 0)
      return;

    // console.log('adding ribs ... ');
    ribs.nodeId = this.nodeId;
    ribs.group = "ribs";
    ribs.groupId = count;
    this.nodeId++;
    this.nodeSvg.rects.push(ribs);
  }

  addDisc(discs: Array<Discs>) {
    let count = 0;
    for(let disc of discs) {
      // inertia
      if (+disc.externalDiameter == 0) {
        this.addInertia(disc, count++);
        continue;
      }

      // console.log('adding disc ... ');
      disc.nodeId = this.nodeId;
      disc.group = "discs";
      disc.groupId = count++;
      this.nodeId++;
      this.nodeSvg.rects.push(disc);
    }
  }

  addInertia(inertia: Discs, count) {
    // inertia
    if (+inertia.mass == 0)
      return;

    // console.log('adding inertia ... ');
    inertia.nodeId = this.nodeId;
    inertia.group = "inertias";
    inertia.groupId = count++;
    this.nodeId++;
    this.nodeSvg.rects.push(inertia);
  }

  addBearing(bearings: Array<RollerBearings>, sections: Array<Sections>) {
    let count = 0;
    for(let bearing of bearings) {
      if (!bearing.group) // || sections[i].length == 0
        continue;

      // console.log('adding rollerbearing ... ');
      bearing.nodeId = this.nodeId;
      bearing.group = "rollerbearings";
      bearing.groupId = count++;
      this.nodeId++;
      this.nodeSvg.paths.push(bearing);
    }
  }

  addJournal(bearings: Array<JournalBearings>, sections: Array<Sections>) {
    let count = 0;
    for(let bearing of bearings) {
      if (!bearing.group) // || sections[i].length == 0
        continue;

      // console.log('adding journalbearing ... ');
      bearing.nodeId = this.nodeId;
      bearing.group = "journalbearings";
      bearing.groupId = count++;
      this.nodeId++;
      this.nodeSvg.paths.push(bearing);
    }
  }

  addFoundations(funds: Array<Foundations>) {
    let count = 0;
    for(let fund of funds) {
      if (!fund.group)
        continue;

      // console.log('adding foundation ... ');
      fund.nodeId = this.nodeId;
      fund.group = "foundations";
      fund.groupId = count++;
      this.nodeId++;
      this.nodeSvg.paths.push(fund);
    }
  }

  addVes(ves: Array<VES>) {
    // console.log(ves);
    let count = 0;
    for(let sve of ves) {
      if (!sve.group)
        continue;

      // console.log('adding ves ... ');
      sve.nodeId = this.nodeId;
      sve.group = "ves";
      sve.groupId = count++;
      this.nodeId++;
      this.nodeSvg.paths.push(sve);
    }
  }

  sortNodes() {
    this.sortedNodes = this.nodeSvg.rects.slice(0).sort((a, b) => {
      if (a.nodeId === this.selectedNode) {
        return 1;
      }
      if (b.nodeId === this.selectedNode) {
        return -1;
      }
      return 0;
    });
  }

  selectNode(node) {
    this.select.emit(node);
    if(node != null)
      this.selectedNode = node.nodeId;
    else
      this.selectedNode = null;
    this.sortNodes();
  }

  linspace(startValue, stopValue, cardinality, endi=true) {
    if(typeof cardinality === "undefined") cardinality = Math.max(Math.round(stopValue-startValue)+1, 1);
    if(cardinality < 2) { return cardinality === 1 ? [startValue] : []; }
    let end = cardinality;
    if(!endi)
      end-=1;

    var arr = [];
    var currValue = startValue;
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < end; i++) {
      arr.push(currValue + (step * i));
      // arr.push(parseFloat((currValue + (step * i)).toFixed(3)));
    }
    return arr;
  }
}
