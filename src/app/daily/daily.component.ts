import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    selector: 'app-daily',
    templateUrl: 'daily.component.html',
    styleUrls: ['daily.component.css']
})
export class DailyComponent {
    public form: FormGroup;
    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            firstName: [''],
            lastName: [''],
            email: [''],
            acceptTerms: [false, [Validators.requiredTrue]]
        });
    }
    public save() {}
}
