import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import fireBase from 'firebase/compat/app'

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: fireBase.firestore.FieldValue) {
    const date = (value as fireBase.firestore.Timestamp).toDate()
    
    return this.datePipe.transform(date, 'mediumDate')
  }

}
