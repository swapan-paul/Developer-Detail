import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProjectServiceService } from 'src/app/services/project-service/project-service.service';
import { forkJoin } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm: FormGroup;
  selectedImages: File[] = [];
  showImages: any[] = [];
  selectedProject: any = '';
  hasChanges: boolean = false;

  constructor(
    private fb: FormBuilder,
    private proService: ProjectServiceService,
    private activeModal: NgbActiveModal,
    private loaderService: LoadingService,
  ) { }

  ngOnInit(): void {
    console.log('selectedProject==========', this.selectedProject);

    this.projectForm = this.fb.group({
      title: [this.selectedProject?.title || '', Validators.required],
      description: [this.selectedProject?.description || '', Validators.required],
      demoLink: [this.selectedProject?.demoLink || ''],
      technologies: this.fb.array([]),
      imgs: this.fb.array([])
    });

    this.populateTechnologies();
    this.populateImages();

    this.projectForm.valueChanges.subscribe(() => {
      this.hasChanges = this.isFormEdited() || this.selectedImages.length > 0 || this.hasImageChanges();
    });
  }

  populateTechnologies() {
    if (this.selectedProject && this.selectedProject.technologies) {
      this.selectedProject.technologies.forEach((tech: string) => {
        this.technologies.push(this.createTechnologyControl(tech));
      });
    } else {
      this.technologies.push(this.createTechnologyControl());
    }
  }

  populateImages() {
    if (this.selectedProject && this.selectedProject.imgs) {
      this.selectedProject.imgs.forEach((imgs: string) => {
        this.showImages.push(imgs);
      });
    }
  }

  isFormEdited(): boolean {
    return (
      this.projectForm.get('title')?.value !== this.selectedProject.title ||
      this.projectForm.get('description')?.value !== this.selectedProject.description ||
      this.projectForm.get('demoLink')?.value !== this.selectedProject.demoLink ||
      !this.areTechnologiesSame()
    );
  }



  hasImageChanges(): boolean {
    const imgsArray = this.projectForm.get('imgs') as FormArray;
    if (imgsArray.length !== this.selectedProject.imgs.length) {
      return true;
    }
    for (let i = 0; i < imgsArray.length; i++) {
      if (imgsArray.at(i).value !== this.selectedProject.imgs[i]) {
        return true;
      }
    }
    return false;
  }


  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedImages.push(files[i]);
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.showImages.push(e.target.result);
        };

        reader.readAsDataURL(file);
      }
      this.hasChanges = true;
    }
  }


  removeImage(index: number) {
    this.showImages.splice(index, 1);
    this.selectedProject.imgs.splice(index, 1);
    const imgsArray = this.projectForm.get('imgs') as FormArray;
    imgsArray.removeAt(index);
    this.hasChanges = true;
  }



  createTechnologyControl(name: string = ''): FormGroup {
    return this.fb.group({
      name: [name, Validators.required]
    });
  }

  get technologies(): FormArray {
    return this.projectForm.get('technologies') as FormArray;
  }

  addTechnology() {
    this.technologies.push(this.createTechnologyControl());
  }

  removeTechnology(index: number) {
    this.technologies.removeAt(index);
    this.hasChanges = this.isFormEdited() || this.selectedImages.length > 0 || this.hasImageChanges();
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  editProject() {
    // console.log('this.projectForm--------->>', this.projectForm.value);

    const isFormChanged = this.isFormEdited();
    const isImageChanged = this.hasImageChanges();

    if ((this.projectForm.valid && (isFormChanged || isImageChanged)) || this.selectedImages.length >= 0) {
      const uploadObservables = [];

      this.loaderService.show(); 

      // console.log('this.selectedImages________', this.selectedImages);

      if (this.selectedImages.length > 0) {

        this.selectedImages.forEach((file) => {
          const filePath = `project_images/${file.name}_${new Date().getTime()}`;
          const upload$ = this.proService.uploadImage(file, filePath);
          uploadObservables.push(upload$);
        });

        forkJoin(uploadObservables).subscribe((imageUrls: string[]) => {
          const imgsArray = this.projectForm.get('imgs') as FormArray;
          if (this.selectedProject.imgs) {
            this.selectedProject.imgs.forEach((existingImgUrl: string) => {
              imgsArray.push(this.fb.control(existingImgUrl));
            });
          }
          imageUrls.forEach(url => {
            imgsArray.push(this.fb.control(url));
          });

          const technologies = this.technologies.value.map((tech: any) => tech.name);
          const formData = {
            ...this.projectForm.value,
            technologies,
            imgs: imgsArray.value
          };

          // console.log('formData--------->>', formData);

          this.proService.updateProject(this.selectedProject.id, formData).then(
            () => console.log('Project updated successfully'),
            error => console.error('Error while updating project:', error)
          );
          this.loaderService.hide();

          this.closeModal();
        });
      } else {
        const technologies = this.technologies.value.map((tech: any) => tech.name);
        const formData = {
          ...this.projectForm.value,
          technologies,
          imgs: this.selectedProject.imgs
        };

        // console.log('formData--------->>', formData);

        this.proService.updateProject(this.selectedProject.id, formData).then(
          () => console.log('Project updated successfully without new images'),
          error => console.error('Error while updating project:', error)
        );

        this.loaderService.hide();
        this.closeModal();
      }
    } else {
      console.log('No changes detected or form is invalid');
    }
  }




  onSubmit() {
    if (this.projectForm.valid) {
      this.loaderService.show();

      const uploadObservables = [];

      if (this.selectedImages.length > 0) {
        this.selectedImages.forEach((file) => {
          const filePath = `project_images/${file.name}_${new Date().getTime()}`;
          const upload$ = this.proService.uploadImage(file, filePath);
          uploadObservables.push(upload$);
        });
      }

      forkJoin(uploadObservables).subscribe((imageUrls: string[]) => {
        const imgsArray = this.projectForm.get('imgs') as FormArray;

        if (this.selectedProject.imgs) {
          this.selectedProject.imgs.forEach((existingImgUrl: string) => {
            imgsArray.push(this.fb.control(existingImgUrl));
          });
        }

        imageUrls.forEach(url => {
          imgsArray.push(this.fb.control(url));
        });

        const technologies = this.technologies.value.map((tech: any) => tech.name);
        const formData = {
          ...this.projectForm.value,
          technologies,
          imgs: imgsArray.value
        };

        this.proService.addProject(formData).subscribe(
          response => console.log('Project added successfully:', response),
          error => console.error('Error while adding project:', error)
        );
        this.loaderService.hide();

        this.closeModal();
      });
    } else {
      console.log('Form is invalid');
    }
  }


  areTechnologiesSame(): boolean {
    const formTechnologies = this.technologies.value.map((tech: any) => tech.name);
    const originalTechnologies = this.selectedProject.technologies;

    if (formTechnologies.length !== originalTechnologies.length) {
      return false;
    }

    for (let i = 0; i < formTechnologies.length; i++) {
      if (formTechnologies[i] !== originalTechnologies[i]) {
        return false;
      }
    }

    return true;
  }
}

