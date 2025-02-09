import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CLASSES } from '../interfaces/responses';
import { Observable, of, switchMap, take } from 'rxjs';

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
export class PaymentSuccessComponent implements AfterViewInit {
    public selectedClass: ClassType | null = null;
    public loading = true;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {}

    public ngAfterViewInit(): void {
        this.route.queryParams
            .pipe(
                take(1),
                switchMap((params: Params): Observable<any> => {
                    const classParam = params['class'];
                    if (this.isValidClassType(classParam)) {
                        this.selectedClass = classParam as ClassType;
                        return this.http.post(
                            CLASSES[this.selectedClass].strapiEndpoint,
                            {}
                        );
                    }
                    return of(null);
                })
            )
            .subscribe({
                next: (response: any): void => {
                    console.log('response:', response);
                    this.loading = false;
                },
                error: (error: any): void => {
                    console.error('Error:', error);
                    this.loading = false;
                }
            });
    }

    private isValidClassType(classType: string): boolean {
        return Object.values(ClassType).includes(classType as ClassType);
    }
}
