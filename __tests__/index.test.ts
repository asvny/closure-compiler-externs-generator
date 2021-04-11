import { processLibraries, FS } from '../index';
import { Volume, createFsFromVolume } from 'memfs';
import { libraries } from './fixtures/libraries';
import { applyDefaults, ExternImportError } from '../library';

function createVolumeAndFs() {
  const volume = new Volume();
  const fs = createFsFromVolume(volume) as FS;

  return {
    fs,
    volume,
  };
}

describe('externs-generator', () => {
  describe('generation', () => {
    it.each([false, true])(
      'produces externs for a given set of modules with debug = %s',
      (debug) => {
        expect.hasAssertions();
        const { volume, fs } = createVolumeAndFs();
        processLibraries('/', libraries, debug, fs);
        expect(volume.toJSON()).toMatchSnapshot();
      },
    );

    it('for scoped modules', () => {
      expect.hasAssertions();
      const { volume, fs } = createVolumeAndFs();
      processLibraries(
        '/',
        [
          {
            moduleName: '@sindresorhus/slugify',
          },
        ].map(applyDefaults),
        false,
        fs,
      );
      expect(volume.toJSON()).toMatchSnapshot();
    });
  });
  describe('libraries definition', () => {
    it('throws on missing extern imports', () => {
      expect.hasAssertions();
      const { fs } = createVolumeAndFs();
      expect(() =>
        processLibraries(
          '/',
          [
            {
              moduleName: 'x',
              externImports: ['/path/to/nonexistent/file'],
            },
          ].map(applyDefaults),
          false,
          fs,
        ),
      ).toThrow(ExternImportError);
    });
  });
});
