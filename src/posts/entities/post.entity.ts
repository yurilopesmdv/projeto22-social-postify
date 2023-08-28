export class Post {
  title: string;
  text: string;
  image?: string;
  constructor(title: string, text: string, image?: string) {
    this.title = title;
    this.text = text;
    this.image = image;
  }
}
