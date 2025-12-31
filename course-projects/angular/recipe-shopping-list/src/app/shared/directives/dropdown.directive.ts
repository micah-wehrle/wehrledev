import { Directive, HostBinding, HostListener, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {

  dropdownOpenToggle: boolean = false;

  @HostListener('click') onDropdownClick() {
    this.dropdownOpenToggle = !this.dropdownOpenToggle;
    this.updateDropdown();
  }

  @HostBinding('class') dropDownClass: string;

  constructor() {}

  ngOnInit(): void {
    this.dropDownClass = '';
  }

  private updateDropdown(): void {
    this.dropDownClass = this.dropdownOpenToggle ? 'open' : '';
  }


  /*
  // How to make it close when you click anywhere:

  @HostBinding('class.open') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  constructor(private elRef: ElementRef) {}
  
  */


}
