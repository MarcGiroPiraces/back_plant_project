import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
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

    try {
      this.writeFile(imagePath, photoData.buffer);
    } catch (error) {
      throw new HttpException(
        'Error while writing the file.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      return await this.photoRepository.insert(imagePath);
    } catch (error) {
      this.removeFile(imagePath);
      throw new HttpException(
        'Error while inserting the photo.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  isFolderOrFile(path: string) {
    return existsSync(path);
  }

  createDirectory(path: string) {
    return mkdirSync(path);
  }

  writeFile(path: string, buffer: Buffer) {
    return writeFile(path, buffer);
  }

  removeFile(path: string) {
    return unlink(path);
  }

  async validationFolderAndFile(folderPath: string, imagePath: string) {
    const isFolder = this.isFolderOrFile(folderPath);
    if (!isFolder) {
      this.createDirectory(folderPath);
    }

    return await this.photoRepository.findByUrl(imagePath);
  }
}
