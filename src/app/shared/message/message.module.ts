import { CommonModule } from "@angular/common";
import { MessageComponent } from "./message.component";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [MessageComponent],
  imports: [CommonModule],
  exports: [MessageComponent],
})
export class MessageModule {}
