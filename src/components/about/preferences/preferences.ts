import { languages } from './_languages.json';
import { infrastructure } from './_infrastructure.json';
import { databases } from './_databases.json';
import { tools } from './_tools.json';

export type TechnologyPreferenceCategory =
  | 'language, frameworks, & ecosystems'
  | 'databases & hosting platforms'
  | 'tools & productivity'
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
    case 'databases & hosting platforms':
      return databases;
    case 'tools & productivity':
      return tools;
    default:
      return languages;
  }
}
