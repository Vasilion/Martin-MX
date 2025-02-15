import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-print-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './print-list.component.html',
    styleUrl: './print-list.component.css'
})
export class PrintListComponent implements OnInit {
    public riders: any;
    constructor(private apiServivce: ApiService) {}

    public ngOnInit(): void {
        this.apiServivce.getRiderList().subscribe(res => {
            this.riders = res;
        });
    }
    public printRiderList(): void {
        window.print();
    }
}
