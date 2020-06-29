import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators/takeWhile';

// TODO: move layouts into the framework
@Component({
  selector: 'dyn-editor-layout',
  styleUrls: ['./editor.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <ngx-header [editor]="true"></ngx-header>
      </nb-layout-header>

      <nb-sidebar state="compacted" class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <div class="row">
          <div class="col-sm-9">
            <ng-content select="router-outlet"></ng-content>
          </div>
          <div class="col-sm-3">
            <ng-content select=".toolbar"></ng-content>
          </div>
        </div>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class EditorLayoutComponent implements OnDestroy {

  private alive = true;

  currentTheme: string;

  constructor(protected themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
