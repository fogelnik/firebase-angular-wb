export interface Comment {
  id?: string; // id комментария (генерируется Firebase)
  productId: string; // id товара
  authorId: string; // id пользователя
  text: string; // текст комментария
  createdAt: Date; // дата создания
  updatedAt?: Date; // дата редактирования
  parentId?: string; // если это ответ на другой комментарий
  authorName: string; // имя пользователя
}
