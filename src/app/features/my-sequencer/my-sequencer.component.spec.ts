import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySequencerComponent } from './my-sequencer.component';

describe('MySequencerComponent', () => {
  let component: MySequencerComponent;
  let fixture: ComponentFixture<MySequencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySequencerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySequencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
