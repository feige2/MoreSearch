import {Component} from '@angular/core';
import {MSServiceService} from './msservice.service';
import {BaseView} from './base-view';
import {MSConfig} from './MSConfig';
import hotkeys from 'hotkeys-js';

interface IScreen {
  isShow: boolean;
  index: number;
  defineURL1: string;
  defineURL2: string;
  defineURL3: string;
  defineURL4: string;
}

interface IViewData {
  screens: IScreen[];
}

@Component({
  selector: 'MS-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseView<IViewData> {
  title = 'MoreSearch';

  constructor(public msService: MSServiceService) {
    super({
      screens: [/*{
        isShow: false,
        index: 4,
        defineURL1: '',
        defineURL2: '',
        defineURL3: '',
        defineURL4: ''
      }, {
        isShow: false,
        index: 3,
        defineURL1: '',
        defineURL2: '',
        defineURL3: '',
        defineURL4: ''
      },*/ {
        isShow: false,
        index: 2,
        defineURL1: '',
        defineURL2: '',
        defineURL3: '',
        defineURL4: ''
      }, {
        isShow: true,
        index: 1,
        defineURL1: MSConfig.google,
        defineURL2: MSConfig.baidu,
        defineURL3: MSConfig.v2ex,
        defineURL4: MSConfig.zhihu
      }]
    });

    hotkeys.filter = function (event) {
      const eventTarget: any = event.target || event.srcElement;
      const tagName = eventTarget.tagName;
      const contenteditable = (tagName.isContentEditable || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
      hotkeys.setScope(contenteditable ? 'input' : 'other');
      return true;
    };
  }

  onClick_Search(inputText: string) {
    this.msService.search(inputText);
  }

  onClick_Screen_Select(event, scrn: IScreen) {
    event.stopPropagation();
    event.preventDefault();
    this.viewData.screens.forEach(item => {
      if (item.index === scrn.index) {
        item.isShow = true;
      } else {
        item.isShow = false;
      }
    });
  }

  onClick_addScreen() {
    this.viewData.screens.unshift({
      isShow: false,
      index: this.viewData.screens.length + 1,
      defineURL1: '',
      defineURL2: '',
      defineURL3: '',
      defineURL4: ''
    });
  }

  removeScreen(index: number) {
    if (this.viewData.screens.length > 1) {
      this.viewData.screens.splice(this.viewData.screens.findIndex(item => item.index === index), 1);
    }
  }

  onClick_open_github() {
    window.open('https://github.com/xuefengnice/MoreSearch');
  }
}
