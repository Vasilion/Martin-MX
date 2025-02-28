import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

interface Rider {
    Name: string;
    Number: string;
    Class: string;
    Size: number;
    Date: string;
    isMinor: boolean;
}

interface GroupedRiders {
    [key: string]: Rider[];
}

@Component({
    selector: 'app-print-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './print-list.component.html',
    styleUrl: './print-list.component.css'
})
export class PrintListComponent implements OnInit {
    public groupedRiders: GroupedRiders = {};

    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {
        this.apiService.getRiderList().subscribe(res => {
            // Group riders by date and sort by name within each group
            this.groupedRiders = this.groupRidersByDate(res);
        });
    }

    private groupRidersByDate(riders: Rider[]): GroupedRiders {
        const grouped = riders.reduce((acc: GroupedRiders, rider: Rider) => {
            const date = new Date(rider.Date).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(rider);
            return acc;
        }, {});

        // Sort riders by name within each date group
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => a.Name.localeCompare(b.Name));
        });

        return grouped;
    }

    public printRiderList(date: string): void {
        const printContent = document.getElementById(`riders-table-${date}`);
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write(
                    '<html><head><title>Rider List</title>'
                );
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

                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            }
        }
    }
}
