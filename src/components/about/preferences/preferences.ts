import { languages } from './_languages.json';
import { infrastructure } from './_infrastructure.json';

export type TechnologyPreferenceCategory =
  | 'language, frameworks, & ecosystems'
  | 'databases & hosting platforms'
  | 'infrastructure & devops';

export type TechnologyPreference = {
  name: string;
  icon: string;
  href: string;
};

export function getPreferencesForCategory(
  category: TechnologyPreferenceCategory
): TechnologyPreference[] {
  switch (category) {
    case 'infrastructure & devops':
      return infrastructure;
    default:
      return languages;
  }
}
