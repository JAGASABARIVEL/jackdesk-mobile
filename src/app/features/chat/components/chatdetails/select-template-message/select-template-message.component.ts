import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TemplateMessageComponent } from '../template-message/template-message.component';
import { PlatformManagerService } from 'src/app/shared/services/platform.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-select-template-message',
  templateUrl: './select-template-message.component.html',
  styleUrls: ['./select-template-message.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, TemplateMessageComponent]
})
export class SelectTemplateMessageComponent  implements OnInit {

  private destroy$ = new Subject<void>();
  constructor(private platformService: PlatformManagerService) {}

  ngOnInit() {}

  _selectedPlatform: any;
  @Output() selectTemplate: EventEmitter<any> = new EventEmitter();

  templates !: any;
  selectedTemplate !: any;

  @Input()
  set selectedPlatform(value: string) {
    this._selectedPlatform = value;
    this.handleSelectedPlatformChange(value);
  }

  get selectedPlatform(): string {
    return this._selectedPlatform;
  }

  handleSelectedPlatformChange(newValue: any) {
    this.platformService.get_templates(newValue?.id).pipe(takeUntil(this.destroy$)).subscribe((templates_list: any) => {
      // At this moment we support only whatsapp
      this.templates = templates_list["whatsapp"];
      //this.templates.unshift(
      //  {
      //    name: 'None'
      //  }
      //)
    })
  }

  onTemplateSelect(templateName: string) {
    this.selectedTemplate = this.templates.find((t: any) => t.name === templateName);
    if (!this.selectedTemplate || this.selectedTemplate?.name === 'None' ) {
      this.selectedTemplate = undefined;
    }
    this.selectTemplate.emit(this.selectedTemplate);
  }

  ngOnDestroy() {
    this.destroy$.next();      // 🛑 Triggers teardown of subscriptions in *this component*
    this.destroy$.complete();
  }

}
