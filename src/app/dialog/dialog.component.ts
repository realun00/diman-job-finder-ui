import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  dynamicComponentContainer!: ViewContainerRef;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    if (this.data.body) {
      this.loadDynamicComponent(this.data.body, this.data.dialogData);
    }
  }

  loadDynamicComponent(component: any, dialogData: any): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.dynamicComponentContainer.clear();
    const componentRef: ComponentRef<any> = this.dynamicComponentContainer.createComponent(componentFactory);

    // Pass data to the dynamically loaded component
    if (componentRef.instance && dialogData) {
      (componentRef.instance as any).job = dialogData; // Ensure type safety if necessary
      (componentRef.instance as any).dialogRef = this.dialogRef; // Pass dialog reference if needed
      (componentRef.instance as any).formName = this.data.formName; // Pass the formName to the child component
      (componentRef.instance as any).emitter = this?.data?.emitter; // Pass the emitter to the child component
      (componentRef.instance as any).bodyText = this?.data?.bodyText; // Pass the bodyText to the child component
      (componentRef.instance as any).loading = this?.data?.loading; // Pass the loading to the child component
    }
  }

  onActionClick(action: string): void {
    if (action === 'cancel') {
      this.dialogRef.close(action);
    }
  }
}
