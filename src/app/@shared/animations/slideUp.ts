import { trigger, transition, animate, style } from "@angular/animations";

export const slideUp = trigger('slideUp', [
  transition(':leave', [animate(300, style({ height: 0 }))]),
]);
