import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SendData {
    title: string;
    urlGet: string;
}

@Component({
    selector: 'app-showDocumento',
    templateUrl: 'showDocumento.component.html',
    styleUrls: ['./showDocumento.component.scss']
})

export class ShowDocumentoComponent implements OnInit {
    title: string;
    urlGet: string;
    public thumbnail: SafeResourceUrl;

    retornarValores = { success: 0, data: {} };

    constructor(private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<ShowDocumentoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) {
        this.title = data.title;
        this.urlGet = data.urlGet;
    };

    ngOnInit() {
        this.showDocumentoFn();
    };

    showDocumentoFn = () => {
        this.thumbnail = '';
        this.thumbnail = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGet);
    };

    aprobarRechazarDocumento = accion => {

    };

};