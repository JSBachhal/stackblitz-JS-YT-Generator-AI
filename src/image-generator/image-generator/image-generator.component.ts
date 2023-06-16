import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Canvas2Video } from "canvas2video";
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

  constructor() { }

  ngAfterViewInit() {
    this.imgs.forEach(this.depict);
  }

  getContext() {
    return this.myCanvas.nativeElement.getContext('2d');
  }
  // It's better to use async image loading.
  loadImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`load ${url} fail`));
      img.src = url;
    });
  };

  // Here, I created a function to draw image.
  depict = (options: any) => {
    const ctx = this.getContext();
    // And this is the key to this solution
    // Always remember to make a copy of original object, then it just works :)
    const myOptions = Object.assign({}, options);
    return this.loadImage(myOptions.uri).then((img: any) => {
      ctx?.drawImage(img, myOptions.x, myOptions.y, myOptions.sw, myOptions.sh);
    });
  };


  chunks: any = [];
  getMdeiaStreeam() {
    const videoStream = this.myCanvas.nativeElement.captureStream(30);
    const mediaRecorder = new MediaRecorder(videoStream);
    mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    }
    mediaRecorder.onstop = (e) => {
      var blob = new Blob(this.chunks, { 'type': 'video/mp4' });
      this.chunks = [];
      var videoURL = URL.createObjectURL(blob);
      this.chunks.src = videoURL;
    };
    mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    return mediaRecorder;
  }

  startRecording(){
    this.getMdeiaStreeam().start();
  }
  
  imgs = [
    {
      uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgifer.com%2Fen%2FFRWy&psig=AOvVaw0Vj8IZdFhkiNMeJjyv6tyS&ust=1687037757276000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDU5MPfyP8CFQAAAAAdAAAAABAE',
      x: 15,
      y: 15,
      sw: 50,
      sh: 50,
    },
    {
      uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgifer.com%2Fen%2FFRWy&psig=AOvVaw0Vj8IZdFhkiNMeJjyv6tyS&ust=1687037757276000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDU5MPfyP8CFQAAAAAdAAAAABAEY',
      x: 15,
      y: 80,
      sw: 50,
      sh: 50,
    },
    {
      uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgifer.com%2Fen%2FFRWy&psig=AOvVaw0Vj8IZdFhkiNMeJjyv6tyS&ust=1687037757276000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDU5MPfyP8CFQAAAAAdAAAAABAE',
      x: 15,
      y: 145,
      sw: 50,
      sh: 50,
    },
  ];
}
