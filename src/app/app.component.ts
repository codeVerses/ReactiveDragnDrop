import { Component } from "@angular/core";
import { mergeMap, map, takeUntil, tap } from "rxjs/operators";
import { fromEvent, Observable } from "rxjs";
import { boxes, Ibox } from "./data/boxes";

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
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public boxes = boxes;
  public dragIndex;
  title = "Drag and Drop";
  position = 0;
  positiony = 0;
  counter = 0;
  counter2 = 0;
  md: mdObj;

  ngOnInit() {
    console.log("READY", boxes);
  }

  ngAfterViewInit() {
    const targets = document.querySelectorAll(".box") as NodeListOf<
      HTMLElement
    >;
    targets.forEach((target) => {
      // const target = document.querySelectorAll(".box") as HTMLElement;

      const mousemove = fromEvent(document, "mousemove");
      const mousedown = fromEvent(target, "mousedown");
      const mouseup = fromEvent(target, "mouseup");

      const mousedrag: Observable<positionInt> = mousedown.pipe(
        tap((md: MouseEvent) => {
          console.log("ind", (md.target as HTMLElement).dataset.index);
          this.dragIndex = (md.target as HTMLElement).dataset.index;
        }),
        mergeMap((md: MouseEvent) => {
          let startX = md.clientX + window.scrollX,
            startY = md.clientY + window.scrollY,
            startLeft =
              parseInt((md.target as HTMLElement).style.left, 10) || 0,
            startTop = parseInt((<HTMLElement>md.target).style.top, 10) || 0;
          return mousemove.pipe(
            map((mm: MouseEvent) => {
              mm.preventDefault();
              return {
                left: startLeft + mm["clientX"] - startX,
                top: startTop + mm["clientY"] - startY,
              };
            }),
            takeUntil(mouseup)
          );
        })
      );

      mousedrag.subscribe((pos) => {
        target.style.top = pos.top + "px";
        target.style.left = pos.left + "px";
      });
    });

    // mousemove.subscribe((pos) => {
    //   this.position = pos["pageX"];
    //   this.positiony = pos["pageY"];
    // });

    // mousedown.subscribe((e) => {
    //   this.counter++;
    // });

    // mouseup.subscribe((e) => {
    //   this.counter2++;
    // });
  }
  isDragged(index: number) {
    return index == this.dragIndex;
  }
}
