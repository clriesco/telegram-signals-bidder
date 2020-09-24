import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndedSignalsComponent } from './ended-signals.component';

describe('EndedSignalsComponent', () => {
  let component: EndedSignalsComponent;
  let fixture: ComponentFixture<EndedSignalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndedSignalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndedSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
