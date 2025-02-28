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
        const printContent = document.getElementById('riders-table');
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write(
                    '<html><head><title>Rider List</title>'
                );
                // Add Bootstrap CSS for table styling
                printWindow.document.write(
                    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">'
                );
                printWindow.document.write('<style>');
                printWindow.document.write(`
                    table { width: 100%; margin: 20px 0; }
                    th, td { padding: 8px; text-align: left; }
                    th { background-color: #f8f9fa; }
                    @media print {
                        table { border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; }
                    }
                `);
                printWindow.document.write('</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(printContent.outerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();

                // Wait for resources to load before printing
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            }
        }
    }
}
