import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { CreatePhoto } from '../dto/create-photo.dto';
import { PhotoRepository } from '../repository/photo.repository';

@Injectable()
export class PhotoService {
  constructor(private photoRepository: PhotoRepository) {}
  async create(userId: number, photoData: CreatePhoto) {
    const folderPath = `./images/${userId}`;
    const imagePath = `${folderPath}/${photoData.title}`;

    const isFolderOrFile = await this.validationFolderAndFile(
      folderPath,
      imagePath,
    );
    if (isFolderOrFile) {
      throw new HttpException('File already exists.', HttpStatus.BAD_REQUEST);
    }

    const writeFile = this.writeFile(imagePath, photoData.buffer);
    if (!writeFile) {
      throw new HttpException(
        'Error writing file.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.photoRepository.insert(imagePath);
  }

  isFolderOrFile(path: string) {
    return existsSync(path);
  }

  createDir(path: string) {
    return mkdirSync(path);
  }

  writeFile(path: string, buffer: Buffer) {
    return writeFile(path, buffer);
  }

  async validationFolderAndFile(folderPath: string, imagePath: string) {
    const isFolder = this.isFolderOrFile(folderPath);
    if (!isFolder) {
      this.createDir(folderPath);
    }
    console.log('isFolder', isFolder);

    return await this.photoRepository.findByUrl(imagePath);
  }
}
