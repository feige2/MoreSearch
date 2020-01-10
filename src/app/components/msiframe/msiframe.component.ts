import {Component, Input, OnInit} from '@angular/core';
import {MSServiceService} from '../../msservice.service';
import {BaseView} from '../../base-view';
import {DomSanitizer} from '@angular/platform-browser';
import {MSConfig} from '../../MSConfig';

interface IViewData {
  selectItems: { name: string, queryURL: string }[];
  isShowSelect: boolean;
  isError: boolean;
  isShowFrame: boolean;
  inputDefineURL: string;
  isShowDialog: boolean;
  url: any;
  isLoading: boolean;
}

@Component({
  selector: 'ms-iframe-box',
  templateUrl: './msiframe.component.html',
  styleUrls: ['./msiframe.component.scss']
})
export class MSIframeComponent extends BaseView<IViewData> implements OnInit {
  @Input() defineURL: string;
  @Input() scrnIndexID: string;
  private urlGO: string;

  constructor(public msService: MSServiceService,
              public ds: DomSanitizer) {
    super({
      selectItems: [
        {name: 'Google', queryURL: MSConfig.google},
        {name: '百度', queryURL: MSConfig.baidu},
        {name: 'V2EX', queryURL: MSConfig.v2ex},
        {name: '知乎', queryURL: MSConfig.zhihu},
        {name: '掘金', queryURL: MSConfig.juejin},
      ],
      isShowSelect: false,
      isError: false,
      isShowFrame: false,
      isLoading: false,
      url: ds.bypassSecurityTrustResourceUrl(''),
      isShowDialog: false,
      inputDefineURL: ''
    });
  }

  ngOnInit() {
    this.msService.addBrowser(this);
    const url = this.msService.getDefineURL(this.scrnIndexID);
    this.viewData.inputDefineURL = (url || url === '') ? url : this.defineURL;
    this.defineURL = this.viewData.inputDefineURL;
  }

  onSearch(inputText: string) {
    if (this.defineURL) {
      this.viewData.isLoading = true;
      this.viewData.isShowFrame = true;
      this.viewData.isError = false;
      const url = this.defineURL.replace(`{query}`, inputText);
      this.urlGO = encodeURI(url);
      /*this.msService.httpClient.get(this.urlGO, {responseType: 'text'})
              .subscribe(value => {
                const iframe: any = document.getElementById(this.scrnIndexID);
                const iframedoc: any = iframe.contentDocument || iframe.contentWindow.document;
                iframedoc.children[0].innerHTML = value; // 事先拿到的html
                let index = 0;
                let isFind = false;
                while (index < this.defineURL.length) {
                  const number = this.defineURL.indexOf('/', index);
                  if (number - 1 >= 0 && url.charAt(number - 1) !== ':' && url.charAt(number - 1) !== '/') {
                    isFind = true;
                    index = number;
                    break;
                  } else {
                    index = number + 1;
                  }
                }
                const htmlBaseElement = document.createElement('base');
                htmlBaseElement.href = isFind ? this.defineURL.substring(0, index + 1) : '/';
                htmlBaseElement.target = '_blank';
                iframedoc.children[0].children[0].appendChild(htmlBaseElement);
                this.onLoad();
              }, error => {
                this.onLoad();
              });*/
      this.viewData.url = this.ds.bypassSecurityTrustResourceUrl(this.urlGO);
    }
  }

  onLoad() {
    this.viewData.isLoading = false;
    /*try {
      // const iframe: any = window.frames[this.scrnIndexID];
      // const iframedoc: any = iframe.contentDocument || iframe.contentWindow.document;
    } catch (err) {
      this.viewData.isError = true;
    }*/
  }

  onError() {
    this.onLoad();
  }

  onClick_config() {
    this.setIsShowDialog(true);
  }

  onClick_ok() {
    this.defineURL = this.viewData.inputDefineURL;
    this.setIsShowDialog(false, true);
  }

  onClick_go() {
    if (this.urlGO) {
      window.open(this.urlGO);
    }
  }

  setIsShowDialog(isShow: boolean, isSave?: boolean) {
    this.viewData.isShowDialog = isShow;
    this.viewData.isShowSelect = false;
    if (isSave) {
      this.msService.saveDefineURL(this.scrnIndexID, this.defineURL);
    } else {
      this.viewData.inputDefineURL = this.defineURL;
    }
  }

  onClick_select_item(event: Event, item: { name: string; queryURL: string }) {
    event.stopPropagation();
    this.viewData.inputDefineURL = item.queryURL;
    this.viewData.isShowSelect = false;
  }

  onDialogContentClick(event: Event) {
    this.viewData.isShowSelect = false;
    event.stopPropagation();
  }

  onClick_show_select(event: Event) {
    event.stopPropagation();
    this.viewData.isShowSelect = !this.viewData.isShowSelect;
  }
}
