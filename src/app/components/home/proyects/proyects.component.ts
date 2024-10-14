import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { AddProjectComponent } from '../../add-project/add-project.component';
import { ProjectServiceService } from 'src/app/services/project-service/project-service.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit {
  @ViewChild('actionModalTemplate') actionModalTemplate;
  selectedProject: any;
  private modalRef: NgbModalRef;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 700,
    items: 1,
    autoplay: true,
    autoplayTimeout:3000
  }

  @ViewChild('imgContainer') imgContainer: ElementRef;
  projects: any[];
  FeatureProjectsData: any[] = [];


  constructor(
    public analyticsService: AnalyticsService,
    private ngbModal: NgbModal,
    private proService: ProjectServiceService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.proService.getProjects().subscribe((projects) => {
      this.FeatureProjectsData = projects || [];
      console.log('Fetched Projects:', this.FeatureProjectsData);
    });
  }

debug(){

  this.imgContainer.nativeElement.scroll({
    top: this.imgContainer.nativeElement.scrollHeight,
    left: 0,
    behavior: 'smooth',    
  });
}

  addProject(selectedProject?:any): void {

    const modalRef = this.ngbModal.open(AddProjectComponent, {
      centered: true,
      size: null,
      scrollable: false,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'custom-modal'
    });
    const addProjectComponentInstance: AddProjectComponent = modalRef.componentInstance;
    if (selectedProject) {
      addProjectComponentInstance.selectedProject = selectedProject;
    }

    modalRef.result.then((result: any) => {
      if (result) {
        // Handle success
      } else {
        // Handle cancel
      }
    });
  }



  // Function to open the action modal
  openActionModal(project: any) {
    this.selectedProject = project;  // Store the selected project
    this.modalRef = this.modalService.open(this.actionModalTemplate, { centered: true, windowClass: 'custom-modal' }); // Open the modal
  }

  // Function to edit project
  editProject() {
    this.modalRef.close();  // Close the action modal
    // You can now open another modal for editing, similar to how you handle project addition

    this.addProject(this.selectedProject);
  }


  // Function to delete project
  deleteProject() {
    this.modalRef.close(); // Close the action modal
    if (confirm('Are you sure you want to delete this project?')) {
      this.proService.deleteProject(this.selectedProject.id).subscribe(
        response => {
          console.log('Project deleted successfully');
          // Refresh or update your list of projects after delete
        },
        error => {
          console.error('Error while deleting project:', error);
        }
      );
    }
  }
  


}



