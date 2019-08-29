import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOfTheDayComponent } from './game-of-the-day.component';

describe('GameOfTheDayComponent', () => {
  let component: GameOfTheDayComponent;
  let fixture: ComponentFixture<GameOfTheDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameOfTheDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
