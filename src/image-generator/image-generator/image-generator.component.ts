import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Canvas2Video } from 'canvas2video';
@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ImageGeneratorComponent implements AfterViewInit {
  @ViewChild('myCanvas', { static: true })
  myCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('player', { static: true })
  player!: ElementRef<HTMLVideoElement>;

  canvasWidth = 720;
  canvasHeight = 1334;
  imageBloackSize = 50;
  textBloackSize = 50;

  videoTime = 5;

  fontSize = 30;
  textOnTop = 'Can you find the diffrent one?';
  textOnBottom = 'Subscribe and Like ';

  constructor() {}

  ngAfterViewInit() {
    const ctx = this.getContext();
    if(ctx){
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);
    }
  }

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
    this.addTextOnTop(this.textOnTop, this.fontSize, 'red');
    this.addTextOnBottom(this.textOnBottom, this.fontSize, 'yellow');
  }

  chunks: any = [];
  getMdeiaStreeam(time: number) {
    const videoStream = this.getCanvas().captureStream(30);

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

    return mediaRecorder;
  }

  startRecording(time = 5000) {
   
    const mediaRecorder = this.getMdeiaStreeam(time);
    mediaRecorder.start();
    
    setTimeout(() => {
      mediaRecorder.stop();
    }, time);
  }

  generateOptions(
    gridWidth = this.canvasWidth,
    gridHeight = this.canvasHeight,
    imageBloackSize = this.imageBloackSize
  ) {
    const options = [];
    for (let height = this.textBloackSize ; height < gridHeight - this.textBloackSize; height += imageBloackSize) {
      for (let width = 0; width <= gridWidth; width += imageBloackSize) {
        // if(height >)
        // console.log('height  '+height + ' width  '+ width)
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

  addTextOnTop(
    string: string,
    fontSize: number = this.fontSize,
    color: string
  ) {
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }
    ctx.fillStyle = '#222';

    ctx.font = fontSize.toString() + 'px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    ctx.fillRect(0, 0, this.canvasWidth, this.textBloackSize);
    ctx.fillStyle = color;
    ctx.fillText(string, this.getCanvas().width / 2, fontSize);
  }

  addTextOnBottom(
    string: string,
    fontSize: number = this.fontSize,
    color: string
  ) {
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }
    ctx.fillStyle = '#222';

    ctx.font = fontSize.toString() + 'px monospace';
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'center';

    ctx.fillRect(
      0,
      this.canvasHeight - this.textBloackSize,
      this.canvasWidth,
      this.textBloackSize
    );
    ctx.fillStyle = color;

    ctx.fillText(
      string,
      this.canvasWidth / 2,
      this.canvasHeight - (this.fontSize/3)
    );
  }
}
