export default class Message {
  constructor(content, author = 'Me', date = new Date()) {
    this.content = content;
    this.author = author;
    this.date = new Date();
  } 
} 