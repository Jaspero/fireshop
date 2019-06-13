import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import {basename, dirname, join} from 'path';

export const fileDeleted = functions.storage
  .object()
  .onDelete(async (data: any) => {
    const fileName = basename(data.name);
    const dirName = dirname(data.name);
    /**
     * Delete thumbnails for an image
     * Skip if the file is already a thumb
     */
    if (
      data.contentType.startsWith('image/') &&
      data.contentType !== 'image/webp' &&
      !data.name.startsWith('thumb_') &&
      (data.metadata.skipDelete ? data.metadata.skipDelete !== 'true' : true)
    ) {
      const storage = new Storage().bucket(data.bucket);
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
