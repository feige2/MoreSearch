import {Component, Input, OnInit} from '@angular/core';
import {MSServiceService} from '../../msservice.service';
import {BaseView} from '../../base-view';
import {DomSanitizer} from '@angular/platform-browser';

interface IViewData {
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
    this.viewData.inputDefineURL = url ? url : this.defineURL;
    this.defineURL = this.viewData.inputDefineURL;
  }

  onSearch(inputText: string) {
    if (this.defineURL) {
      this.viewData.isLoading = true;
      this.viewData.isShowFrame = true;
      const url = this.defineURL.replace(`{query}`, inputText);
      this.urlGO = encodeURI(url);
      this.msService.httpClient.get(this.urlGO, {responseType: 'text'})
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
        });
      // this.viewData.url = this.ds.bypassSecurityTrustResourceUrl(this.urlGO);
    }
  }

  onLoad() {
    this.viewData.isLoading = false;
  }

  onError() {
    this.onLoad();
  }

  onClick_config() {
    this.viewData.isShowDialog = true;
  }

  onClick_ok() {
    this.defineURL = this.viewData.inputDefineURL;
    this.viewData.isShowDialog = false;
    this.msService.saveDefineURL(this.scrnIndexID, this.defineURL);
  }

  onClick_go() {
    if (this.urlGO) {
      window.open(this.urlGO);
    }
  }
}
