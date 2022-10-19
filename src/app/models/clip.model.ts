import fireBase from 'firebase/compat/app'


export default interface IClip {
    docID?: string,
    uid: string,
    displayName: string,
    title: string,
    fileName: string,
    url: string,
    screenshotURL: string,
    screenshotFileName: string,
    timestamp: fireBase.firestore.FieldValue
}