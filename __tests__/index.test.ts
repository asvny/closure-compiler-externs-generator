import { processLibraries, FS } from '../index';
import { vol, Volume, createFsFromVolume } from 'memfs';
import { libraries } from './fixtures/libraries';
import { applyDefaults, ExternImportError } from '../library';

describe('externs-generator', () => {
  let fs: FS;
  let volume: typeof vol;

  function assertVolumeSnapshot() {
    expect(volume.toJSON()).toMatchSnapshot();
  }

  beforeEach(() => {
    volume = new Volume();
    fs = createFsFromVolume(volume) as any;
  });

  describe('generation', () => {
    it.each([false, true])(
      'produces externs for a given set of modules with debug = %s',
      (debug) => {
        processLibraries('/', libraries, debug, fs);
        assertVolumeSnapshot();
      },
    );

    it('for scoped modules', () => {
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
      assertVolumeSnapshot();
    });
  });
  describe('libraries definition', () => {
    it('throws on missing extern imports', () => {
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
      ).toThrowError(ExternImportError);
    });
  });
});
