import {Injectable} from '@angular/core';
import {MSIframeComponent} from './components/msiframe/msiframe.component';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MSServiceService {
  private browsers: MSIframeComponent[] = [];

  constructor(public httpClient: HttpClient) {
  }

  search(inputText: string) {
    this.browsers.forEach(async (browser) => {
      browser.onSearch(inputText);
    });
  }

  addBrowser(browser: MSIframeComponent) {
    this.browsers.push(browser);
  }

  saveDefineURL(scrnIndexID: string, defineURL: string) {
    localStorage.setItem(scrnIndexID, defineURL);
  }

  getDefineURL(scrnIndexID: string) {
    return localStorage.getItem(scrnIndexID);
  }
}
