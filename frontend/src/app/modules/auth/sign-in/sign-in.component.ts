import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { GaService } from '../../../services/ga.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: 'auth-sign-in',
	templateUrl: './sign-in.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
	@ViewChild('signInNgForm') signInNgForm: NgForm;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: ''
	};
	signInForm: FormGroup;
	showAlert: boolean = false;

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private gaService: GaService,
		private _formBuilder: FormBuilder,
		private _router: Router,
		private spinner: NgxSpinnerService
	) {
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Create the form
		this.signInForm = this._formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Sign in
	 */
	signIn = () => {
		this.spinner.show();
		if (this.signInForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Ingresa usuario y contraseña',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.spinner.hide();
			return;
		};

		const data = {
			usuario: this.signInForm.controls.email.value,
			pass: this.signInForm.controls.password.value
		};

		this.signInForm.disable();
		this.signInForm.reset();

		this.gaService.postService(`login/loginUser`, data).subscribe((res: any) => {
			if (res.err) {
				this.spinner.hide();
				console.log('errorRes', res.err)
			} else {
				if (res[0][0].success === 1) {
					this.spinner.hide();
					localStorage.setItem('user', JSON.stringify(res[1][0]));
					this._router.navigateByUrl('/beneficiario/dashboard');
				} else {
					this.spinner.hide();
					this.signInForm.enable();
					Swal.fire({
						title: '¡Error!',
						text: 'Usuario y/o contraseña incorrecta.',
						icon: 'error',
						confirmButtonText: 'Cerrar'
					});
				};
			};
		}, (error: any) => {
			console.log('errorCatch', error)
		});
	};
};
