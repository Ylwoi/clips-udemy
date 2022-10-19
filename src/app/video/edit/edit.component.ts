import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null
  @Output() update = new EventEmitter()

  title = new FormControl('', [Validators.required, Validators.minLength(3)])
  clipID = new FormControl('', [Validators.required])

  editForm = new FormGroup({
    title: this.title,
    clipID: this.clipID
  })

  inSubmission = false
  isAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your clip is being updated.'

  constructor(
    private clipService: ClipService,
    private modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register('edit')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return
    }

    this.inSubmission = false
    this.isAlert = false

    this.title.setValue(this.activeClip.title)
    this.clipID.setValue(this.activeClip.docID ?? null)
  }

  ngOnDestroy(): void {
    this.modal.unregister('edit')
  }

  async submit() {
    this.editForm.disable()
    this.inSubmission = true
    this.isAlert = true
    this.alertColor = 'blue'

    try {
      await this.clipService.updateClip((this.clipID.value as string), (this.title.value as string))
    } catch (error) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Error! Something went wrong.'
      this.editForm.enable()
    }

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'

    this.update.emit(this.editForm.value)

  }

}
