import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  @ViewChild('hiddenCanvas', { static: true })
  hiddenCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('player', { static: true })
  player!: ElementRef<HTMLVideoElement>;
  @ViewChild('audio', { static: true })
  audio!: ElementRef<HTMLVideoElement>;

  canvasWidth = 720;
  canvasHeight = 1334;
  imageBloackSize = 100;
  textBloackSize = 50;

  videoTime = 8;

  fontSize = 30;
  textOnTop = 'CAN YOUT FIND THE ODD ONE OUT?';
  textOnBottom = 'SUBSCRIBE and LIKE ';
  audiopath =
  './Tick Tock - Jimmy Fontanez_Media Right Productions.mp3';
  constructor() {}

  ngAfterViewInit() {
    const ctx = this.getContext();
    if (ctx) {
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);
    }

    this.audio.nativeElement.src= this.audiopath;
  }

  gethiddenCanvas() {
    return this.hiddenCanvas.nativeElement;
  }
  getCanvas() {
    return this.myCanvas.nativeElement;
  }
  getContext() {
    return this.myCanvas.nativeElement.getContext('2d');
  }
  gethiddenCanvasContext() {
    return this.hiddenCanvas.nativeElement.getContext('2d');
  }

  img!: any;
  rotatedImage!: any;
  // Here, I created a function to draw image.
  onFileSelected(e: any) {
    this.optons = this.generateOptions();
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

  optons: any = [];
  renderImage() {
    const ctx = this.getContext();
    this.optons.forEach((option: any) => {
      if (option.rotateImage) {
        this.drawRotate(true, option);
      } else {
        ctx?.drawImage(this.img, option.x, option.y, option.sw, option.sh);
      }
    });
    this.addTextOnTop(this.textOnTop, this.fontSize, 'yellow');
    this.addTextOnBottom(this.textOnBottom, this.fontSize, 'yellow');
  }

  drawRotate(clockwise: boolean = true, option: any) {
    const degrees = clockwise == true ? 90 : -90;
    let canvas = this.gethiddenCanvas();

    const iw = this.img.naturalWidth;
    const ih = this.img.naturalHeight;

    canvas.width = this.imageBloackSize;
    canvas.height = this.imageBloackSize;

    let ctx = canvas.getContext('2d');

    ctx?.rotate(Math.PI);
    ctx?.drawImage(
      this.img,
      -this.imageBloackSize,
      -this.imageBloackSize,
      option.sw,
      option.sh
    );
    const sourceImageData = canvas?.toDataURL();
    const destinationImage = new Image();
    destinationImage.onload = () => {
      this.getContext()?.drawImage(
        destinationImage,
        option.x,
        option.y,
        option.sw,
        option.sh
      );
    };
    destinationImage.src = sourceImageData;
  }

  chunks: any = [];
  getMdeiaStreeam(time: number) {
    const videoStream = this.getCanvas().captureStream(30);
    const audioCtx = new AudioContext();
   
    const mp3 = new Audio(this.audiopath);

    
    // const stream = (mp3 as any).captureStream();
    this.audio.nativeElement.play();

    const destination = audioCtx.createMediaStreamDestination();
    const audioSource = audioCtx.createMediaElementSource(this.audio.nativeElement);
    // const source2 = audioCtx.createMediaStreamSource(remoteStream);

    audioSource.connect(destination);
    // source2.connect(destination);

    const outputStream = new MediaStream();
    outputStream.addTrack(videoStream.getVideoTracks()[0]);
    outputStream.addTrack(destination.stream.getAudioTracks()[0]);
    // outputStream.addTrack(destination.stream.getAudioTracks()[0]);

    const mediaRecorder = new MediaRecorder(outputStream);

    mediaRecorder.onstop = (e) => {
      var blob = new Blob(this.chunks, { type: 'video/mp4' });
      this.chunks = [];
      var videoURL = URL.createObjectURL(blob);
      console.log(this.player);
      this.player.nativeElement.src = videoURL;

      var url = URL.createObjectURL(blob);
      var a = document.createElement('a') as any;
      document.body.appendChild(a);
      (a.style as any) = 'display: none';
      a.href = url;
      a.download = 'Can you Find It ? #shorts .mp4';
      a.click();
      window.URL.revokeObjectURL(url);
    };
    mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    return mediaRecorder;
  }

  startRecording(time = this.videoTime * 1000) {
    const mediaRecorder = this.getMdeiaStreeam(time);
    setInterval(() => this.renderImage(), 300);
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, time);
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  generateOptions(
    gridWidth = this.canvasWidth,
    gridHeight = this.canvasHeight,
    imageBloackSize = this.imageBloackSize
  ) {
    const options = [];
    let count = 0;
    let widthCount = Math.floor(gridWidth / imageBloackSize);
    let widthOfset = (gridWidth % imageBloackSize) / 2;
    let heightCount = Math.floor(
      (gridHeight - this.textBloackSize * 2) / imageBloackSize
    );
    const randomImageNumber = this.randomIntFromInterval(
      0,
      widthCount * heightCount
    );
    console.log(randomImageNumber);
    console.log('widthCount' + widthCount);
    console.log('heightCount' + heightCount);
    let xPosition = widthOfset;
    let yPosition = imageBloackSize - widthOfset;
    for (let height = 0; height < heightCount; height++) {
      for (let width = 0; width < widthCount; width++) {
        count += 1;
        options.push({
          x: xPosition,
          y: yPosition,
          sw: imageBloackSize,
          sh: imageBloackSize,
          rotateImage: count === randomImageNumber,
        });
        xPosition = xPosition + imageBloackSize;
      }
      xPosition = widthOfset;
      yPosition = yPosition + imageBloackSize;
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
      this.canvasHeight - this.fontSize / 4
    );
  }
}
