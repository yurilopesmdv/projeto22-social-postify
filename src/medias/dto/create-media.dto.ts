import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateMediaDto {
  @IsString({ message: 'All field are required!' })
  @IsNotEmpty({ message: 'All field are required!' })
  title: string;

  @IsString({ message: 'All fields are required!' })
  @IsNotEmpty({ message: 'All fields are required!' })
  @IsUrl()
  username: string;
}
