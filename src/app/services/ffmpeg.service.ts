import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning = false
  isReady = false
  private ffmpeg

  constructor() {
    this.ffmpeg = createFFmpeg({log: true})
  }

  async init() {
    if (this.isReady) {
      return
    }

    await this.ffmpeg.load()

    this.isReady = true
  }

  async getScreenshots(file: File) {
    this.isRunning = true

    const data = await fetchFile(file)

    this.ffmpeg.FS('writeFile', file.name, data)

    const seconds = [1,2,3]
    const commands: string[] = []

    seconds.forEach((second, index) => {
      commands.push(
        // Input
        '-i', file.name,
        // Output options
        '-ss', `00:00:0${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=500:-1',
        // Output
        `output_0${index}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands
    )

    const screenshots: string[] = []

    seconds.forEach((second, index) => {
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${index}.png`)

      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
          type: 'img/png'
        }
      )

      const screenshotUrl = URL.createObjectURL(screenshotBlob)

      screenshots.push(screenshotUrl)
    })

    this.isRunning = false

    return screenshots
  }

  async blobFromURL(url: string) {
    const response = await fetch(url)

    const blob = await response.blob()

    return blob
  }
}
