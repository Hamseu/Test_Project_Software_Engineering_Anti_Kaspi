import {Component} from '@angular/core';
import {Header} from './header/header'
import { RouterOutlet } from '@angular/router';
import { NavigationPanel } from './navigation-panel/navigation-panel';
@Component({
  selector: 'app-root',
  template: `<app-header> </app-header> 
             <app-navigation-panel /> 
             <router-outlet/>
 `,
  imports: [Header, RouterOutlet, NavigationPanel],
})
export class App {
}
