import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private httpClient:HttpClient) { }

  getCharacters(pageNumber:number){
    return this.httpClient.get(`https://rickandmortyapi.com/api/character?page=${pageNumber}`);
  }
  getCharactersByName(pageNumber:number,characterName:string){
    return this.httpClient.get(`https://rickandmortyapi.com/api/character?page=${pageNumber}&name=${characterName}`);
  }
}
