import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CLASSES } from '../interfaces/responses';

enum ClassType {
    AB = 'AB',
    C = 'C',
    MINI = 'MINI'
}

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-success',
    templateUrl: 'success.component.html',
    styleUrls: ['success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
    public selectedClass: ClassType | null = null;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {}

    public ngOnInit() {
        // TODO this is running twice,
        // because of the subscribe inside of subscribe
        // this could be refactored to use a switchMap
        // and it might work with a takeOne operator
        this.route.queryParams.subscribe(params => {
            const classParam = params['class'];
            if (this.isValidClassType(classParam)) {
                this.selectedClass = classParam as ClassType;
                this.decrementSpotsLeft(this.selectedClass);
            }
        });
    }

    private isValidClassType(classType: string): boolean {
        return Object.values(ClassType).includes(classType as ClassType);
    }

    private decrementSpotsLeft(classType: ClassType) {
        const endpoint = CLASSES[classType].strapiEndpoint;
        this.http.post(endpoint, {}).subscribe((response: any): void => {
            console.log(
                'Successfully decremented spots left for class:',
                classType
            );
            console.log('Response:', response);
        });
    }
}
