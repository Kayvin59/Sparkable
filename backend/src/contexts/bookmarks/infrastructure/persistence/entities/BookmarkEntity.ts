import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BookmarkDto } from "../../../domain/models/BookmarkDto";

@Entity('bookmarks')
export class BookmarkEntity implements BookmarkDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  linkUuid: string;
}