import en from './en';
import ar from './ar';
import fr from './fr';
import { viewEn, viewFr, viewAr } from './view';

const resources = {
  en: {
    translation: {
      ...en,
      view: viewEn
    }
  },
  ar: {
    translation: {
      ...ar,
      view: viewAr
    }
  },
  fr: {
    translation: {
      ...fr,
      view: viewFr
    }
  }
};

export default resources; 