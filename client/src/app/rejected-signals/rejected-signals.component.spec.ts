import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedSignalsComponent } from './rejected-signals.component';

describe('RejectedSignalsComponent', () => {
  let component: RejectedSignalsComponent;
  let fixture: ComponentFixture<RejectedSignalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedSignalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
