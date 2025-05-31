import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-template-message',
  templateUrl: './template-message.component.html',
  styleUrls: ['./template-message.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class TemplateMessageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

   _selectedTemplateForPreview !: any;

  @Input()
set selectedTemplateForPreview(value: any) {  
  if (typeof value === 'string') {
    try {
      const onceParsed = JSON.parse(value);
      // Check if it’s still a string (i.e. double-stringified JSON)
      if (typeof onceParsed === 'string') {
        const twiceParsed = JSON.parse(onceParsed);
        this._selectedTemplateForPreview = twiceParsed;
      } else {
        this._selectedTemplateForPreview = onceParsed;
      }
    } catch (e) {
      console.error("Failed to parse selectedTemplateForPreview", e);
      this._selectedTemplateForPreview = value;
    }
  } else {
    this._selectedTemplateForPreview = value;
  }
}

  
    get selectedTemplateForPreview(): any {
      return this._selectedTemplateForPreview;
    }


}
