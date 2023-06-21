import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject, debounce, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Hero } from 'src/app/core/models/hero.model';
import { HeroService } from 'src/app/core/services/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent {
  heroes$!: Observable<Hero[]>;
  @Input() label= '';

  private searchTerm = new Subject<string>();
  @Output() private selected = new EventEmitter<Hero>();

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroes$ = this.searchTerm.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap((term) => this.heroService.search(term))
    );
  }

  onSelected(selectedItem: MatAutocompleteSelectedEvent):void {
    this.searchTerm.next('');

    const hero: Hero = selectedItem.option.value;
    this.selected.emit(hero);
  }

  search(term: string): void{
    this.searchTerm.next(term);
  }
}
