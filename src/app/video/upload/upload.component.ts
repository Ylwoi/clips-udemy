import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, finalize, forkJoin, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import fireBase from 'firebase/compat/app'
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from '../../services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  isDragOver = false
  file: File | null = null
  nextStep = false
  inSubmission = false
  isAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your clip is being uploaded.'
  percentage = 0
  showPercentage = false
  user: fireBase.User | null = null
  task?: AngularFireUploadTask
  screenshotTask?: AngularFireUploadTask
  screenshots: string[] = []
  selectedScreenshot: string = ''

  title: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)])
  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    public ffmpegService: FfmpegService,
    private route: Router
    ) { 
      auth.user.subscribe(user => this.user = user)
      ffmpegService.init()
  }

  ngOnDestroy(): void {

  }

  async storeFile(event: Event) {
    if (this.ffmpegService.isRunning) {
      return
    }

    this.isDragOver = false

    this.file = (event as DragEvent).dataTransfer ?
    (event as DragEvent).dataTransfer?.files.item(0) ?? null :
    (event.target as HTMLInputElement).files?.item(0) ?? null

    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)

    this.selectedScreenshot = this.screenshots[0]

    this.title.setValue(this.file?.name.split('.')[0])

    this.nextStep = true
  }

  async uploadFile() {
    this.uploadForm.disable()

    this.inSubmission = true
    this.isAlert = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    const clipRef = this.storage.ref(clipPath)

    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot)
    const screenshotPath = `screenshots/${clipFileName}.png`
    const screenshotRef = this.storage.ref(screenshotPath)

    this.task = this.storage.upload(clipPath, this.file)
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob)

    combineLatest(
      [
        this.task.percentageChanges(),
        this.screenshotTask.percentageChanges()
      ]
      ).pipe(
      finalize(() => this.showPercentage = false)
    ).subscribe((values) => {
      const [videoPercentage, screenshotPercentage] = values

      if (!videoPercentage || !screenshotPercentage) {
        return
      }

      const total = videoPercentage + screenshotPercentage

      this.percentage = total as number / 200
    })

    forkJoin(
      [
        this.task.snapshotChanges(),
        this.screenshotTask.snapshotChanges()
      ]
      ).pipe(
      switchMap(() => forkJoin(
        [
          clipRef.getDownloadURL(),
          screenshotRef.getDownloadURL()
        ]
        ))
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls

        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: fireBase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocumentRef = await this.clipService.createClip(clip)

        this.alertColor = 'green'
        this.alertMsg = 'Video uploaded successfully!'

        setTimeout(() => {
          this.route.navigate(['clip', clipDocumentRef.id])
        }, 1000)
      },
      error: (error) => {
        this.uploadForm.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Error! Upload failed'
        this.inSubmission = false
      }
    })

  }

}
