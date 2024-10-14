import { Injectable } from '@angular/core';
import { finalize, from, map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  addProject(projectData: any): Observable<any> {
    console.log('projectData------', projectData);
    return new Observable(observer => {
      // Add server timestamp and any other metadata
      const projectPayload = {
        ...projectData,
        createdAt: new Date() // Replace with serverTimestamp() if you prefer Firestore's server timestamp
      };

      // Add the project to the 'Projects' collection
      this.db.collection('Projects').add(projectPayload)
        .then(docRef => {
          console.log('Project added successfully with ID:', docRef.id);
          observer.next({
            status: 200,
            message: 'Project added successfully',
            id: docRef.id // Return the generated document ID
          });
          observer.complete();
        })
        .catch(error => {
          console.error('Error adding project:', error);
          observer.error({
            status: 400,
            message: 'Error adding project',
            error: error
          });
        });
    });
  }


  // Upload image to Firebase Storage and return the download URL
  uploadImage(file: File, filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Observable(observer => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          // Get the download URL after the upload is complete
          fileRef.getDownloadURL().subscribe(downloadURL => {
            observer.next(downloadURL);  // Emit the download URL
            observer.complete();
          });
        })
      ).subscribe();
    });
  }


  public getProjects(): Observable<any[]> {
    return this.db.collection('Projects')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...(typeof data === 'object' && data !== null ? data : {}) };
        }))
      );
  }

public deleteProject(projectId: string): Observable<void> {
  return from(this.db.collection('Projects').doc(projectId).delete());
}

  updateProject(projectId: string, formData: any): Promise<void> {
    return this.db.collection('Projects').doc(projectId).update(formData);
  }
}
