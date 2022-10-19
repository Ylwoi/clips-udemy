import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.scss'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() isScrollable = true

  constructor(public clipService: ClipService) {
    clipService.getClips()
  }

  ngOnInit(): void {
    if (this.isScrollable) {
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  ngOnDestroy(): void {
    if (this.isScrollable) {
      window.removeEventListener('scroll', this.handleScroll)
    }

    this.clipService.pageClips = []
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement
    const { innerHeight } = window

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

    if (bottomOfWindow) {
      this.clipService.getClips()
    }
  }

}
