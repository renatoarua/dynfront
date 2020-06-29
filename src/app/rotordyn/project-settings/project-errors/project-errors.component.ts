import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { ProjectService } from '../../../@core/services/project.service';
import { ProjectDataService } from '../../../@core/services/project-data.service';
import { MachineError, Project, Machine, ProjectSetting, DisplaySetting } from '../../../@core/models/shaft';

import { Observable, Subscription } from "rxjs/Rx";

interface ConsoleTxt {
  msg:string;
  type?:string;
  idx?:number;
}

@Component({
  selector: 'project-errors',
  templateUrl: './project-errors.component.html',
  styleUrls: ['./project-errors.component.scss'],
})
export class ProjectErrorsComponent implements OnInit, OnDestroy {
  dialogue: ConsoleTxt[] = [];
  buffer: Array<ConsoleTxt> = []
  display: string = "";
  _errors: MachineError[];

  fn: Subscription;

  @Input('errors')
  set errors(values: MachineError[]) {
    this.buffer.push({msg:'./validate-model -now', type:'cmd'});
    if (typeof values[0] !== "undefined") {
      this._errors = values;
      for (var i = 0; i < values.length; i++) {
        this.buffer.push({msg:values[i].message,type:'error',idx:i});
      }
      /*values.each((item, idx) => {
        this.buffer.push({msg:item.message,type:'error'});
      });*/

    } else {
      this.buffer.push({msg:'no errors found. model ready',type:'success'});
    }

    // check size of dialogue - keep a little more than the overflow
    // this.dialogue.splice(0, 2);
  }

  @Input('terminal')
  set command(value:ConsoleTxt) {
    this.buffer.push(value);
  }

  @Output('fixthis') fixthis$: EventEmitter<MachineError> = new EventEmitter<MachineError>();


  constructor() {
    this.dialogue.push({msg:"______      _            ______"});
    this.dialogue.push({msg:"| ___ \\    | |           |  _  \\"});
    this.dialogue.push({msg:"| |_/ /___ | |_ ___  _ __| | | |_   _ _ __"});
    this.dialogue.push({msg:"|    // _ \\| __/ _ \\| '__| | | | | | | '_ \\"});
    this.dialogue.push({msg:"| |\\ \\ (_) | || (_) | |  | |/ /| |_| | | | |"});
    this.dialogue.push({msg:"\\_| \\_\\___/ \\__\\___/|_|  |___/  \\__, |_| |_|"});
    this.dialogue.push({msg:"                                 __/ |"});
    this.dialogue.push({msg:"                                |___/"});

    this.buffer.push({msg:'all systems ready! WELCOME',type:'text'});
  }

  ngOnInit() {
    this.fn = Observable.interval(20)
      .subscribe((val) => {
        this.typingCallback(this);
      });
  }

  ngOnDestroy() {
    this.fn.unsubscribe();
  }

  typingCallback(that) {
    if(typeof that.buffer[0] !== "undefined") {
      let total_length = that.buffer[0].msg.length;
      let current_length = that.display.length;
      if (current_length < total_length) {
        that.display += that.buffer[0].msg[current_length];
      } else {
        that.display = "";
        that.dialogue.push(that.buffer[0]);
        that.clearDialogue();
        that.buffer.splice(0,1);
      }
    }
    // setTimeout(that.typingCallback, 20, that);
  }

  clearDialogue() {
    if (this.dialogue.length > 16) {
      let x = this.dialogue.length - 16;
      this.dialogue.splice(0,x);
    }
  }

  fix(idx:number) {
    let err = this._errors[idx];
    this.fixthis$.emit(err);
  }
}