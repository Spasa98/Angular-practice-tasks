import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit,OnDestroy {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;
  subscriptions: Subscription[] = [];
  value: string | undefined;
  listOfCharacters:any;
  timeout:any;
  pagesInfo:any;
  previousePageInfo:any;
  curentPage:any=1;
  lastLenght!:number;
  constructor(private characterService:CharacterService){

  }
  ngOnInit(): void {
    this.getCharacters(this.curentPage);
  }

  getCharacters(pageNumber:number){
    this.subscriptions.push(
      this.characterService.getCharacters(pageNumber).subscribe({
        next:(res:any)=>{
          this.showCharacters(res);
        },
        error:err=>{
          console.log("Error: ",err);
        }
      })
    )
  }
  getCharactersByName(pageNumber:number,characterName:string){
    this.subscriptions.push(
      this.characterService.getCharactersByName(pageNumber,characterName).subscribe({
        next:(res:any)=>{
          this.showCharacters(res);
        },
        error:err=>{
          console.log("Error: ",err);
        }
      })
    )
  }
  showCharacters(res:any){
    this.lastLenght=res.results.length;
    console.log(this.lastLenght)
    if(res.info.prev==null){
      this.listOfCharacters=res.results;
    }
    else{
      this.listOfCharacters.push(...res.results)
    }
    this.previousePageInfo=this.pagesInfo;
    this.pagesInfo=res.info;
  }
  onShowMore(){
    this.curentPage++;
    if(this.value==undefined){
      this.getCharacters(this.curentPage);
    }
    else{
      this.getCharactersByName(this.curentPage,this.value)
    }
  }
  onShowLese(){
    this.curentPage--;
    this.listOfCharacters.splice(this.listOfCharacters.length - this.lastLenght, this.lastLenght);
    if(this.previousePageInfo){
      this.pagesInfo=this.previousePageInfo;
    }

  }
  onTextChange(event: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.curentPage=1;
      this.getCharactersByName(this.curentPage,event);
      this.scrollToTop();
    }, 500);
  }
  scrollToTop() {
    const container = this.resultsContainer.nativeElement as HTMLElement;
    container.scrollTop = 0;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
