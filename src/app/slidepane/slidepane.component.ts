import { Component,
         Input,
         ChangeDetectionStrategy
        } from '@angular/core';

import {
         animate, style, state, transition, trigger
        } from '@angular/animations';

type PaneType = 'results' | 'details';

@Component({
    selector: 'app-slidepane',
    templateUrl: './slidepane.component.html',
    styleUrls: ['./slidepane.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slide', [state('results', style({transform: 'translateX(0)'})),
                          state('details', style({transform: 'translateX(-50%)'})),
                          transition('* => *', animate(300))])
    ]
})

export class SlidepaneComponent {
    @Input() activePane: PaneType = 'results';
}

