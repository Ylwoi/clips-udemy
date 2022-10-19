import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard'

import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  { 
    path: 'manage', component: ManageComponent, 
    data: { 
      authOnly: true,
      authGuardPipe: () => redirectUnauthorizedTo('/')
    },
    canActivate: [AngularFireAuthGuard] 
  },
  { path: 'manage-clips', redirectTo: 'manage'},
  { 
    path: 'upload', 
    component: UploadComponent, 
    data: { 
      authOnly: true,
      authGuardPipe: () => redirectUnauthorizedTo('/')
    },
    canActivate: [AngularFireAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
