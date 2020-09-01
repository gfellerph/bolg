import { ValidationProvider, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'Die Aagab bruchemer.',
});

extend('email', {
  ...email,
  message: 'Bisch sicher dass dis Email stimmt?',
});

export default ValidationProvider;
