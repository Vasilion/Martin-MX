import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    selector: 'app-contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css'],
})
export class ContactComponent {
    public contactForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            name: [''],
            email: [''],
            message: [''],
        });
    }

    public submit(): void {
        console.log(this.contactForm.value);
    }
}
