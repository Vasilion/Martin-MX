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

    constructor(private route: ActivatedRoute, private http: HttpClient) {}

    public ngAfterViewInit(): void {
        this.route.queryParams
            .pipe(
                take(1),
                switchMap((params: Params): Observable<any> => {
                    let classParam = params['class'];
                    let is2 = false;
                    const riderName = localStorage.getItem('riderName');
                    const date1 = localStorage.getItem('openPracticeDate1');
                    const date2 = localStorage.getItem('openPracticeDate2');
                    const dropdownValue = localStorage.getItem('dropdown');
                    if (!riderName) {
                        return of(null);
                    }
                    if (this.isValidClassType(classParam)) {
                        // Modify classParam if needed before setting selectedClass
                        if (date1 && date2 && dropdownValue) {
                            // Extract the date part after the hyphen and trim
                            const selectedDate = dropdownValue
                                .split('-')[1]
                                .trim();
                            // Format dates for comparison
                            const formattedSelectedDate = new Date(
                                selectedDate
                            ).toLocaleDateString();
                            const formattedDate1 = new Date(
                                date1 + 'T12:00:00'
                            ).toLocaleDateString();
                            const formattedDate2 = new Date(
                                date2 + 'T12:00:00'
                            ).toLocaleDateString();

                            if (formattedSelectedDate === formattedDate2) {
                                is2 = true;
                            }
                        }

                        this.selectedClass = classParam as ClassType;
                        this.writeRiderDataToStrapi();
                        if (is2) {
                            if (this.selectedClass === 'A/B') {
                                return this.http.post(
                                    CLASSES['AB'].strapiEndpoint + '2',
                                    {}
                                );
                            } else {
                                return this.http.post(
                                    CLASSES[this.selectedClass].strapiEndpoint +
                                        '2',
                                    {}
                                );
                            }
                        } else {
                            if (this.selectedClass === 'A/B') {
                                return this.http.post(
                                    CLASSES['AB'].strapiEndpoint,
                                    {}
                                );
                            } else {
                                return this.http.post(
                                    CLASSES[this.selectedClass].strapiEndpoint,
                                    {}
                                );
                            }
                        }
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
        let isMinor = false;

        if (!riderName) {
            console.log('No rider found');
            return;
        }

        const minorCheck = localStorage.getItem('minorCheck');
        console.log(minorCheck);

        if (minorCheck === 'Minor') {
            isMinor = true;
            console.log(isMinor);
        }

        const payload = {
            data: {
                Name: localStorage.getItem('riderName'),
                Date: new Date(date),
                Class: riderClass,
                Number: localStorage.getItem('riderNumber'),
                Email: localStorage.getItem('email'),
                Size: localStorage.getItem('bikeSize'),
                isMinor: isMinor
            }
        };

        this.http
            .post(
                environment.strapiBaseUrl + '/martin-rider-sign-up-lists',
                payload
            )
            .subscribe((): void => {
                // localStorage.clear();
            });
    }
}
