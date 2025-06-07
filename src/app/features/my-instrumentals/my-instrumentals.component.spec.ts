import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInstrumentalsComponent } from './my-instrumentals.component';

describe('MyInstrumentalsComponent', () => {
  let component: MyInstrumentalsComponent;
  let fixture: ComponentFixture<MyInstrumentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyInstrumentalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInstrumentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
