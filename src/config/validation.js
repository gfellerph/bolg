import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

const dictionary = {
  'de-CH': {
    messages: {
      required: () => 'Die Aagab bruchemer.',
      email: () => 'Bisch sicher dass dis Email stimmt?',
    },
  },
};

VeeValidate.Validator.updateDictionary(dictionary);
VeeValidate.Validator.setLocale('de-CH');

export default Vue;
