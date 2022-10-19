import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { ManageComponent } from './manage/manage.component';
import { EditComponent } from './edit/edit.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SafeURLPipe } from './pipes/safe-url.pipe';
import { UploadComponent } from './upload/upload.component';


@NgModule({
  declarations: [
    ManageComponent,
    EditComponent,
    UploadComponent,
    SafeURLPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    VideoRoutingModule
  ]
})
export class VideoModule { }
