import type { Library } from '../../library';
import { applyDefaults } from '../../library';

const libraryConfigs: (Partial<Library> & { moduleName: string })[] = [
  {
    moduleName: 'react',
  },
];

export const libraries: readonly Library[] = libraryConfigs.map(applyDefaults);
