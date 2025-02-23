import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CLASSES } from '../interfaces/responses';
import { Observable, of, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';

enum ClassType {
    AB = 'A/B',
    C = 'C',
    MINI = 'MINI',
    JR = 'JR'
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
                    const riderName = localStorage.getItem('riderName');
                    if (!riderName) {
                        return of(null);
                    }
                    if (this.isValidClassType(classParam)) {
                        this.selectedClass = classParam as ClassType;
                        this.writeRiderDataToStrapi();
                        return this.http.post(
                            CLASSES[this.selectedClass].strapiEndpoint,
                            {}
                        );
                    }
                    return of(null);
                })
            )
            .subscribe({
                next: (): void => {
                    this.loading = false;
                },
                error: (): void => {
                    this.loading = false;
                }
            });
    }

    private isValidClassType(classType: string): boolean {
        return Object.values(ClassType).includes(classType as ClassType);
    }

    private writeRiderDataToStrapi(): void {
        const dropdownValue = localStorage.getItem('dropdown') || '';
        const [riderClass, date] = dropdownValue.split(' - ');
        const riderName = localStorage.getItem('riderName');

        if (!riderName) {
            console.log('No rider found');
            return;
        }

        const payload = {
            data: {
                Name: localStorage.getItem('riderName'),
                Date: new Date(date),
                Class: riderClass,
                Number: localStorage.getItem('riderNumber')
            }
        };

        this.http
            .post(
                environment.strapiBaseUrl + '/martin-rider-sign-up-lists',
                payload
            )
            .subscribe((): void => {
                localStorage.clear();
            });
    }
}
