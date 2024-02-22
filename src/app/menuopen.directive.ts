import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMenuopen]'
})
export class MenuopenDirective {

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    this.el.nativeElement.classList.add('menu-open');
  }


}
