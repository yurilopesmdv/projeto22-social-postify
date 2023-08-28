import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
export class CreatePublicationDto {
  @IsNumber()
  @IsNotEmpty()
  mediaId: number;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty()
  date: string;
}
