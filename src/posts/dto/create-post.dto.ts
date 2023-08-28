import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
export class CreatePostDto {
  @IsString({ message: 'All fields are required!' })
  @IsNotEmpty({ message: 'All fields are required!' })
  title: string;

  @IsString({ message: 'All fields are required!' })
  @IsNotEmpty({ message: 'All fields are required!' })
  @IsUrl()
  text: string;

  @IsString({ message: 'All fields are required!' })
  @IsNotEmpty({ message: 'All fields are required!' })
  @IsUrl()
  image?: string;
}
