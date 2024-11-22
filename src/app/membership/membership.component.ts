import { CommonModule } from '@angular/common';
import {
    Component,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    selector: 'app-membership',
    templateUrl: 'membership.component.html',
    styleUrls: ['membership.component.css'],
})
export class MembershipComponent {
    public form: FormGroup;
    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            firstName: [''],
            lastName: [''],
            email: [''],
            acceptTerms: [false, [Validators.requiredTrue]],
        });
    }
    public save() {
        console.log(this.form.value);
    }
}
