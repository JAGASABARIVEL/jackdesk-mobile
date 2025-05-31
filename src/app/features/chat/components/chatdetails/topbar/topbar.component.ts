import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-chatdetails-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [IonicModule, CommonModule ], // Required here
})
export class TopbarComponent  implements OnInit {

  @Input() userAvatar:any = "";
  @Input() userName: any = "";

  constructor() { }

  ngOnInit() {}

}
