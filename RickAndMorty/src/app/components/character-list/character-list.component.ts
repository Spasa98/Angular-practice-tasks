import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit,OnDestroy {
  subscriptions: Subscription[] = [];
  value: string | undefined;
  listOfCharacters:any;
  timeout:any;
  pagesInfo:any;
  curentPage:any=1;
  constructor(private characterService:CharacterService){

  }
  ngOnInit(): void {
    this.getCharacters(this.curentPage);
  }

  getCharacters(pageNumber:number){
    this.subscriptions.push(
      this.characterService.getCharacters(pageNumber).subscribe({
        next:(res:any)=>{
          if(res.info.prev==null){
            this.listOfCharacters=res.results;
          }
          else{
            this.listOfCharacters.push(...res.results)
          }
          this.pagesInfo=res.info;
          console.log(res);
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
          this.listOfCharacters=res.results;
          this.pagesInfo=res.info;

          console.log(res);
        },
        error:err=>{
          console.log("Error: ",err);
        }
      })
    )
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
    this.listOfCharacters.splice(this.listOfCharacters.length - 20, 20);
  }
  onTextChange(event: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.curentPage=1;
      this.getCharactersByName(this.curentPage,event);
    }, 500);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
