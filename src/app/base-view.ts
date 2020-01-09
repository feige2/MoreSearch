export abstract class BaseView<VD> {
  public viewData: VD;

  protected constructor(viewData: VD) {
    this.viewData = viewData;
  }

}
