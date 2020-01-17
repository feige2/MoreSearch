import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {BaseView} from '../../base-view';
import hotkeys, {HotkeysEvent} from 'hotkeys-js';

interface IViewData {
  inputText: string;
  searchBtnText: string;
}

@Component({
  selector: 'ms-search-box',
  templateUrl: './mssearch-box.component.html',
  styleUrls: ['./mssearch-box.component.scss']
})
export class MSSearchBoxComponent extends BaseView<IViewData> implements OnInit {

  @Output() onClick_Search: EventEmitter<string> = new EventEmitter<string>();
  @Input() inputText;

  constructor() {
    super({
      searchBtnText: '猫搜一下',
      inputText: ''
    })
    ;
  }

  ngOnInit(): void {
    hotkeys('enter', {
      scope: 'input',
      element: document.getElementById('input-search')
    }, (keyEvent: KeyboardEvent, hkevent: HotkeysEvent) => {
      this.onClick_search();
    });
    if(this.inputText){
      this.viewData.inputText = this.inputText;
    }
  }

  onClick_search() {
    this.onClick_Search.emit(this.viewData.inputText);
  }
}
