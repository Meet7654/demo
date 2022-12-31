import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class LoaderService {
  private loaderSubject: BehaviorSubject<boolean>;
  public loader$: Observable<boolean>;

  constructor() {
    this.loaderSubject = new BehaviorSubject<boolean>(false);
    this.loader$ = this.loaderSubject.asObservable();
  }

  show() {
    this.loaderSubject.next(true);
  }

  hide() {
    this.loaderSubject.next(false);
  }

  getErrorMessage(error: any, def: string = 'Something went wrong') {
    if (error.error) {
      if (error.error.msg) {
        def = error.error.msg;
      } else if (error.error.message) {
        def = error.error.message;
      } else if (error.error.err) {
        if (error.error.err.message) {
          def = error.error.err.message;
        }
      }
    } else if (error.msg) {
      def = error.msg;
    } else if (error.message) {
      def = error.message;
    }
    if (def === 'jwt expired' || def === 'Social Error') {
      def = '';
    }
    return def;
  }
}
