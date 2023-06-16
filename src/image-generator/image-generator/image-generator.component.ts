import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Canvas2Video } from 'canvas2video';
@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ImageGeneratorComponent implements AfterViewInit {
  @ViewChild('myCanvas', { static: true })
  myCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('player', { static: true })
  player!: ElementRef<HTMLVideoElement>;

  constructor() {}

  ngAfterViewInit() {}

  getCanvas() {
    return this.myCanvas.nativeElement;
  }
  getContext() {
    return this.myCanvas.nativeElement.getContext('2d');
  }

  img!: any;
  // Here, I created a function to draw image.
  onFileSelected(e: any) {
    const reader = new FileReader();
    const file = e.target.files[0];
    // load to image to get it's width/height
    const img = new Image();
    img.onload = () => {
      this.img = img;
      this.renderImage();
    };

    // this is to setup loading the image
    reader.onloadend = function () {
      img.src = reader.result as any;
    };
    // this is to read the file
    reader.readAsDataURL(file);
  }

  renderImage() {
    const ctx = this.getContext();
    this.generateOptions().forEach((option) =>
      ctx?.drawImage(this.img, option.x, option.y, option.sw, option.sh)
    );
  }

  chunks: any = [];
  getMdeiaStreeam(time: number) {
    const videoStream = this.getCanvas().captureStream(30);
    console.log(videoStream);
    const mediaRecorder = new MediaRecorder(videoStream);

    mediaRecorder.onstop = (e) => {
      var blob = new Blob(this.chunks, { type: 'video/mp4' });
      this.chunks = [];
      var videoURL = URL.createObjectURL(blob);
      console.log(this.player);
      this.player.nativeElement.src = videoURL;
    };
    mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    // setInterval(()=>this.draw(), 300);
    setInterval(() => this.renderImage(), 300);

    return mediaRecorder;
  }

  startRecording(time = 5000) {
    const mediaRecorder = this.getMdeiaStreeam(time);
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, time);
  }

  generateOptions(gridWidth = 720, gridHeight = 1334, imageBloackSize = 50) {
    const options = [];
    for (let height = 0; height <= gridHeight; height += imageBloackSize) {
      for (let width = 0; width <= gridWidth; width += imageBloackSize) {
        options.push({
          x: width,
          y: height,
          sw: imageBloackSize,
          sh: imageBloackSize,
        });
      }
    }

    return options;
  }

  draw() {
    const colors = [
      'red',
      'blue',
      'yellow',
      'orange',
      'black',
      'white',
      'green',
    ];
    const ctx = this.getContext();
    if (ctx) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(0, 0, 240, 480);
    }
  }
}
