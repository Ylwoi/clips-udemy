import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  isVisible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = []

  constructor() { }

  register(id: string): void {
    this.modals.push({
      id,
      isVisible: false
    })
  }

  unregister(id: string): void {
    this.modals = this.modals.filter(element => element.id !== id)
  }

  isModalOpen(id: string): boolean {
    return !!this.modals.find(element => element.id === id)?.isVisible
  }

  toggleModal(id: string): void {
    const modal: IModal | undefined = this.modals.find(element => element.id === id)
    
    if (modal) {
      modal.isVisible = !modal.isVisible
    }
  }
}
