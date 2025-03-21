import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    selector: 'app-unlimited-success',
    templateUrl: 'unlimited-success.component.html',
    styleUrls: ['unlimited-success.component.css']
})
export class UnlimitedPaymentSuccessComponent {
    public loading = true;

    constructor(private route: ActivatedRoute, private http: HttpClient) {
        this.sendMartinEmail();
    }

    private sendMartinEmail() {
        this.http
            .post(
                environment.strapiBaseUrl + '/martin-unlimited-emailer/send',
                {
                    email: 'martinmxpark@gmail.com',
                    subject:
                        'NEW MEMBER! - Martin Unlimited Membership Created',
                    text: 'You have a new member! Check stripe <a href="https://dashboard.stripe.com/payments?amount[gt]=15000" target="_blank" rel="noopener noreferrer">here</a>!'
                }
            )
            .subscribe({
                next: response => {
                    console.log('Success:', response);
                    this.loading = false;
                },
                error: error => {
                    console.error('Error Details:', error);

                    this.loading = false;
                }
            });
    }
}
