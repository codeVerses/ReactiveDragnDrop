import { Component } from "@angular/core";
import { mergeMap, map, takeUntil } from "rxjs/operators";
import { fromEvent, Observable } from "rxjs";

interface mdObj {
  clientX: number;
  clientY: number;
  target: {
    style: {
      top: string;
      left: string;
    };
  };
}

interface positionInt {
  top: number;
  left: number;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Drag and Drop";
  position = 0;
  positiony = 0;
  counter = 0;
  counter2 = 0;
  md: mdObj;

  ngOnInit() {
    const target = <HTMLElement>document.querySelector(".box");

    const mousemove = fromEvent(document, "mousemove");
    const mousedown = fromEvent(target, "mousedown");
    const mouseup = fromEvent(target, "mouseup");

    const mousedrag: Observable<positionInt> = mousedown.pipe(
      mergeMap((md: mdObj) => {
        let startX = md.clientX + window.scrollX,
          startY = md.clientY + window.scrollY,
          startLeft = parseInt(md.target.style.left, 10) || 0,
          startTop = parseInt(md.target.style.top, 10) || 0;
        return mousemove.pipe(
          map((mm: Event) => {
            mm.preventDefault();
            return {
              left: startLeft + mm["clientX"] - startX,
              top: startTop + mm["clientY"] - startY
            };
          }),
          takeUntil(mouseup)
        );
      })
    );

    mousedrag.subscribe(pos => {
      target.style.top = pos.top + "px";
      target.style.left = pos.left + "px";
    });

    mousemove.subscribe(pos => {
      this.position = pos["pageX"];
      this.positiony = pos["pageY"];
    });

    mousedown.subscribe(e => {
      this.counter++;
    });

    mouseup.subscribe(e => {
      this.counter2++;
    });
  }
}
