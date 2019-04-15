import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'jfsc-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  exportToCsv() {}

  exportToPdf() {}

  exportToXls() {}
}
