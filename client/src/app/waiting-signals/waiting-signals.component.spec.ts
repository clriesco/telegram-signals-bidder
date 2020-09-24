import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingSignalsComponent } from './waiting-signals.component';

describe('WaitingSignalsComponent', () => {
  let component: WaitingSignalsComponent;
  let fixture: ComponentFixture<WaitingSignalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingSignalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
