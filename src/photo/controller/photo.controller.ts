import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomRequest } from '../../CustomRequest';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PhotoService } from '../service/photo.service';

@ApiTags('Photo')
@ApiBearerAuth()
@Controller('photo')
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Create a photo.',
    type: Number,
  })
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/jpeg' })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build(),
    )
    photo: Express.Multer.File,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user.id;
    const createPhotoDto = {
      buffer: photo.buffer,
      title: photo.originalname,
    };

    return this.photoService.create(userId, createPhotoDto);
  }
}
