import { Component,AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit {


    ngAfterViewInit(): void {
    const text = "RockEye Engineering";
    const target = document.getElementById("text")!;
    const consoleEl = document.getElementById("console")!;
    let index = 0;
    let increment = 1;
    let visible = true;

    function typeWriter() {
      target.innerText = text.substring(0, index);
      index += increment;

      if (index === text.length + 1) {
        increment = -1;
        setTimeout(typeWriter, 2000); 
      } else if (index === 0) {
        increment = 1; 
        setTimeout(typeWriter, 1000); 
      } else {
        setTimeout(typeWriter, 120);
      }
    }

    setInterval(() => {
      if (visible) {
        consoleEl.classList.add("opacity-0");
      } else {
        consoleEl.classList.remove("opacity-0");
      }
      visible = !visible;
    }, 400);

    typeWriter();
  }
}
