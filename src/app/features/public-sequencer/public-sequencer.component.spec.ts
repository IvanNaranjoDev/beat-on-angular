import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSequencerComponent } from './public-sequencer.component';

describe('PublicSequencerComponent', () => {
  let component: PublicSequencerComponent;
  let fixture: ComponentFixture<PublicSequencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicSequencerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicSequencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
