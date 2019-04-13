import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import {basename, dirname, join} from 'path';

export const fileDeleted = functions.storage
  .object()
  .onDelete(async ({bucket, name, contentType}) => {
    const fileName = basename(name);
    const dirName = dirname(name);

    /**
     * Delete thumbnails for an image
     * Skip if the file is already a thumb
     */
    if (
      contentType.startsWith('image/') &&
      contentType !== 'image/webp' &&
      !name.startsWith('thumb_')
    ) {
      const storage = new Storage().bucket(bucket);
      const lookUpName = (entry?: string) =>
        join(dirName, (entry || '') + fileName);
      const webpLookUp = (entry?: string) =>
        lookUpName(entry).replace(/(.jpg|.png|.jpeg)/, '.webp');
      const toRemove = [
        lookUpName('thumb_s_'),
        lookUpName('thumb_m_'),
        webpLookUp(),
        webpLookUp('thumb_s_'),
        webpLookUp('thumb_m_')
      ];

      for (const fp of toRemove) {
        try {
          await storage.file(fp).delete();
        } catch (e) {}
      }
    }
  });
