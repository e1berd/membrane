import 'package:flutter/material.dart';
import 'package:membrane/layouts/iam_layout.dart';
import 'package:reactive_forms/reactive_forms.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final form = FormGroup({
    'email': FormControl<String>(validators: [Validators.required, Validators.email]),
    'password': FormControl<String>(validators: [Validators.required, Validators.minLength(8)]),
  });

  void submit() {
    if (form.valid) {
      print(form.value);
    }
  }

  @override
  Widget build(BuildContext context) {
    return IamLayout(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 400),
        child: ReactiveForm(
          formGroup: form,
          child: Padding(
            padding: const .all(16),
            child: Column(
              mainAxisSize: .min,
              children: [
                ReactiveTextField<String>(
                  formControlName: 'email',
                  textInputAction: .next,
                  decoration: const InputDecoration(filled: true),
                  autofocus: true,
                ),
                const SizedBox(height: 16),
                ReactiveTextField<String>(
                  formControlName: 'password',
                  obscureText: true,
                  decoration: const InputDecoration(filled: true),
                  textInputAction: .done,
                  onSubmitted: (_) => submit(),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: submit,
                          child: const Text('Sign In'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: TextButton(
                          onPressed: () {},
                          child: const Text('Sign Up'),
                        ),
                      ),
                    ],
                  ),
                ),
              ]
            ),
          ),
        ),
      ),
    );
  }
}
