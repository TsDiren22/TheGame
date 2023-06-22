import { Component, OnInit } from "@angular/core";
import { Text } from "./models/text.model";
import { ITextService } from "./services/ITextService.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogContentExampleDialog } from "../sudoku/sudoku.component";
import { TextBubbleComponent } from "src/app/text-bubble/text-bubble.component";
import { TextAiIntro } from "src/app/text-bubble/conversations/textai-intro";

@Component({
  templateUrl: "./textai.component.html",
  styleUrls: ["./textai.component.css"],
  selector: "app-textai",
})
export class TextaiComponent implements OnInit {
  text: Text = new Text("", "", "", "");
  feedback: string = "";
  color: string = "";
  disable: boolean = false;
  rulesDialog: MatDialogRef<DialogContentExampleDialog> | undefined;
  score: number = 0;
  highestScore: number = 0;

  constructor(public dialog: MatDialog, private textService: ITextService) {
    this.openDialog();
  }

  ngOnInit(): void {
    this.textService.resetTextCounter();
    this.textService.getRandomText().subscribe((text) => (this.text = text));
  }

  async submit(e: any) {
    let choice: string = e.target.id;
    if (choice === this.text.createdBy) {
      this.color = "text-success";
      this.feedback = "Correct!";
      this.score++;
    } else {
      let writtenBy: string =
        this.text.createdBy === "Human" ? "a human!" : "an A.I.!";
      this.color = "text-danger";
      this.feedback = "This text was actually written by " + writtenBy;
    }
    this.disable = true;
  }

  next() {
    this.feedback = "";
    //Set score to 0 if previous text was information
    if (this.text.category == "Information") {
        
        this.score = 0;
    }
    this.textService.getRandomText().subscribe((text) => (this.text = text));
    this.disable = false;
    //If current text is information add the score
    if (this.text.category == "Information") {
        if (this.score > this.highestScore) {
            this.highestScore = this.score;
        }
        this.disable = true;
        this.text.title += " Your score this run was: " + this.score + ". Your highest score this playthrough is " + this.highestScore;
    }
  }

  //Open dialog
  openDialog() {
    this.rulesDialog = this.dialog.open(DialogContentExampleDialog);
    this.dialog.open(TextBubbleComponent, {
        width: "1000px",
        height: "400px",
        disableClose: true,
        data: { conversationType: TextAiIntro },
    });
}
}

@Component({
  selector: "dialog-textai",
  templateUrl: "./dialog-textai.html",
})
export class Dialog {}
